$(document).ready(function() {
  if($('#project-creation-2').length > 0) {
    new Nav({type: 'create'});
    new PhotoUpload($('#photo-upload-input'));
  }
  else{
    new Nav({type: 'main'});
  }
  new ButtonBar({type: 'end'});
  new Form();
});
function Form(el) {
  var el = el || '';

  function dataCreate(el){
    var key = el.attr('id').split('-')[1];
    var data = {};
    if(key == 'location'){
      data = dataLocation(el);
    }
    else{
      data[key] = el.val();
    }
    return data;
  }

  // Common field functions
  function ajax(el) {
    var project_id = $('#project-id').val();    
    $.ajax({
      url: '/maps/update_remote/' + project_id,
      data:  dataCreate(el),
      cache: false,
      type: 'post',
      success: function(data) {
         console.log("sucess!!");
      },
      error: function() {
        console.log("Something went wrong!");
      }
    }); // end ajax
  }

  function changeCounter(e) {
    var input = $(e.target);
    var letterCount = input.val().length;
    var span = input.nextAll('span.char-limit');
        $(span).removeClass('hidden');
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);
    input.on('focusout', function() {
      if(letterCount == 0) { $($(this).nextAll('span.char-limit')).addClass('hidden'); }
    });
  }

  function createBasicField(elArray) {
    $.each(elArray, function(i, el) {
      el.keyup(function(e) { changeCounter(e); });
      autosize(el);
    });
  }

  // Location field functions
  function dataLocation(el){
    var lat = el.next().find('#project-lat');
    var lon = el.next().find('#project-lon');
    var data = {location: el.val(), lat: lat.val(), lon: lon.val()};
    return data;
  }
  function createLocationField(el){
    var lat = el.next().find('#project-lat');
    var lon = el.next().find('#project-lon');
    el.on('focusout', function(e){
      ajax(el);
      ajax(lat);
      ajax(lon);
    });
    lat.on('focusout', function(e){
      ajax($(this));
    });
    lon.on('focusout', function(e){
      ajax($(this));
    });
  }
  // Tag field functions
  function textTag(e) {
    var input = $(e.target);
    var s = input.val().toLowerCase();
    var tagText = s.replace(/[\.,-\/#!'$\n?%\^&\*;:{}=\-_`~()]/g,"");
        tagText = tagText.trim();
    return tagText;
  }

  function htmlTag(e) {
    var tagText = textTag(e);
    var tagHTML = "<span class='project-tag cursor-def light font_small'>#" + tagText + "</span>";
    var tag = $($.parseHTML(tagHTML));
    var tagID = 'tag-' + tagText;
        tag.attr('id', tagID);
        tag.on('click', function() { $(this).remove(); });
    return tag;
  }

  function appendTag(e) {
    var input = $(e.target);
    var tagContainer = input.nextAll('.tag-container');
    var tag = htmlTag(e)[0];
    if(e.which == 188 || e.which == 13) {
      if(tagContainer.children('.project-tag').length == 0) {
        tagContainer.append(tag);
        input.val('');
      }
      else {
        var tagCheck = tagContainer.find('#'+tag.id);
        if(tagCheck.length > 0) {
          tagCheck.addClass('error');
          input.val('');
          setTimeout(function() {
             tagCheck.removeClass('error');
           }, 600);
        }
        else{
          tagContainer.append(tag);
          input.val('');
        }
      }
    }
  }

  function createTagField(el){
    el.keyup(function(e) { appendTag(e); });
  }

  // Object logic
  function loadDoc(){
    createBasicField([ $('#project-description'), $('#project-name')] );
    createTagField($('#project-tag_list'));
    if($('#project-creation-2').length > 0){
      $('#project-name').on('focusout', function(){ ajax($(this)); });
      $('#project-description').on('focusout', function(){ ajax($(this)); });
      $('#project-tag_list').on('focusout', function(){ ajax($(this)); });
      createLocationField($('#project-location'));
    }
  }
  function initFields(){
    if(el.hasClass('caption')){
      createBasicField([el]);
    }
    else if(el.hasClass('tag-input')){
      createTagField(el);
    }
    else if(el.hasClass('text-module-body')){
      autosize(el);
    }
  }
  function driver(){
    if(el == '') {
      loadDoc();
    }
    else {
      initFields();
    }
  }
  driver();
}
function ButtonBar(settings) { 
  var mod = settings.mod || '';
  var type = settings.type;

  function createBTW(){
    html = "<ul class='button-bar button-bar-btw'><li class='option item invisible' data-module-type='grid'><button><i class='h2-size fa fa-square'></i></button><br><span class='invisible button-label font_small'>Grid</span></li><li class='option item invisible' data-module-type='comparison'><button><i class='h2-size fa fa-sliders'></i></button><br><span class='invisible button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item invisible' data-module-type='half'><button><i class='h2-size fa fa-star-half'></i></button><br><span class='invisible button-label font_small'>Half</span></li><li class='option item invisible' data-module-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='invisible button-label font_small'>Text</span></li><li class='option item invisible' data-module-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='invisible button-label font_small'>Video</span></li></ul>";
    el = $($.parseHTML(html));
    el.attr('id', "btw-bar-" + $('.button-bar-btw').length);
    return el
  }
  function initOpenBar(toggle){
    var bar = toggle.parent('.button-bar');

  }
  function openBar(toggle){
    toggle.addClass('invisible').addClass('hidden');
    var bar = toggle.parent('.button-bar');
        bar.addClass('open');
    $.each(bar.children('.option'), function(i, option){
      $(option).removeClass('invisible').dequeue();
      $(option).addClass('option-'+i.toString()).dequeue();
      $(option).hover(function(){
        $(this).children('.button-label').toggleClass('invisible');
      });
    });
    bar.closest('html').on('keyup', function(e){
      if(e.which == 27){ closeBar(toggle); }
    });
  }
  function closeBar(toggle){
    var bar = toggle.parent('.button-bar');
        bar.removeClass('open');
    $.each(bar.children('.option'), function(i, option){
      $(option).addClass('invisible').dequeue();
      $(option).removeClass('option-'+i.toString()).dequeue();
    });
    toggle.removeClass('hidden').removeClass('invisible');
    initOpenBar(toggle);
  }
  function closeAllBars(){
    $.each($('.button-bar'), function(i, bar){
      if($(bar).hasClass('open')){
        var toggle = $(bar).find('.option-toggle');
        closeBar($(toggle));
      }
    });
  }
  function init(el){
    el.on('click', '.option-toggle', function(){
      openBar($(this));
    });
    el.on('click', '.option', function(){
      var mod = new Module($(this));
      closeBar($(this).siblings('.option-toggle'));
    });
  }
  function driver(){
    if(type == 'end'){
      init($('#end-bar'));
    }
    else if(type == 'btw'){
      var btw = createBTW();
      btw.insertBefore(mod);
      init(btw);
      closeAllBars();
    }
  }
  driver();
}
function Drag(el) {
  function initDrag() {
    el.draggable({
      containment: '#project-creation-2',
      cursor: '-webkit-grabbing',
      cursorAt: { top: 0, left: 0 },
      distance: 10,
      helper: 'clone',
      opacity: '.9',
      revert: true,
      revertDuration: 350,
      snap: true,
      snapMode: 'both',
      snapTolerance: 10,
      zIndex: 100
    });
  }
  function driver() { initDrag(); }
  driver();
}
function Drop(mod) { 
  var mod = mod;
  var modType = mod.data('type');

  function htmlDefaultMessage(){
    var message;
    if(modType == 'comparison'){
      message = 'Drag two photos here to compare them.';
    }
    else if(modType == 'grid'){
      message = 'Drag up to ten photos here.';
    }
    else if(modType == 'half'){
      message = 'Drag one photo here.';
    }
    var html = "<p class='caps'>" + message +"</p>";
    return $($.parseHTML(html));
  }

  function htmlPhoto(){
    var colNum;
    if(modType == 'half'){
      colNum = 'twelve';
    }
    else{
      colNum = 'six';
    }
    return html = "<div class='photo " + colNum + " columns'><div class='img-wrapper'><button class='photo-remove font_small h-centered hidden'><i class='fa fa-remove'></i></button></div><textarea class='caption char-limited padding-top' placeholder='Add an optional caption'></textarea><span class='char-limit font_small light hidden' data-limit='140'>140</span></div>";
  }
  function createPhoto(ui){
    var id = ui.draggable.data('id');
    var img = ui.draggable.clone();
        img.removeClass('draggable').removeClass('ui-draggable').removeClass('ui.draggable-handle');
    var photo = $($.parseHTML(htmlPhoto()));
        photo.attr('id', 'photo-'+id);
        photo.find('.img-wrapper').prepend(img);
    return photo;
  }
  function initPhotoRemovable(photo){
    var imgWrapper = photo.find('.img-wrapper');
    imgWrapper.hover(function(){
      var id = $(this).find('img').data('id');
      var button = $(this).find('button')
          button.toggleClass('hidden');
    });
    imgWrapper.find('.photo-remove').on('click', function(){
      var photo = $(this).closest('.photo');
      var photoCount = $('.photo').length;
      if(photoCount == 1){
        var droppable = $(this).closest('.droppable')
            droppable.addClass('dropzone');
            droppable.append(htmlDefaultMessage())
      }
      $(photo).remove();
    });
  }
  function createModDrop(e, ui){
    var dropzone = $(e.target);
        dropzone.removeClass('dropzone');
        dropzone.find('p').remove();
    var mod = dropzone.closest('.module');
    var photo = createPhoto(ui);

    dropzone.append(photo);
    initPhotoRemovable(photo);

    new Form($(photo.find('textarea.caption')));
    // new Form($(mod.find('textarea.tag-input')));
  }
  function droppableLimit(){
    if(modType == 'comparison'){ return 2; }
    else if(modType == 'grid'){ return 10; }
    else if(modType == 'half'){ return 1 }
  }
  function initModDrop(mod){
    mod.find('.droppable').droppable({
      accept: '.draggable',
      activeClass: 'drop-active',
      hoverClass: 'drop-target',
      drop: function(e, ui){
        var photoCount = mod.find('.photo').length;
        if(photoCount < droppableLimit()){
          createModDrop(e, ui);
        }
      }
    });
  }
  function initSort(mod){
    mod.find('.droppable').sortable({
      appendTo: $('.droppable'),
      connectWith: mod.find('.droppable'),
      containment: mod,
      cursor: '-webkit-grab',
      distance: 10,
      handle: '.img-wrapper',
      opacity: .9,
      revert: 150
    });
  }
  function driver(){
    initModDrop(mod);
    initSort(mod);
  }
  driver();
}
function Module(option) { 
  var bar = option.parent();
  var type = option.data('module-type');
  var modID = type + "-module-" + $('.module').length;

  function htmlHeader(icon, type){
    var html = "<div class='row group wrapper'><div class='six columns'><i class='fa fa-" + icon + "'></i><span class='cursor-def'> " + type + "</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div>";
    return html
  }
  function htmlDropzone(){
    var message;
    if(type == 'comparison'){
      message = 'Drag two photos here to compare them.';
    }
    else if(type == 'grid'){
      message = 'Drag up to ten photos here.';
    }
    else if(type == 'half'){
      message = 'Drag one photo here.';
      return "<p class='caps'>" + message +"</p>";
    }
    var html = "<div class='droppable dropzone row group wrapper'><p class='caps'>" + message +"</p></div>";
    return html;
  }
  function htmlTaginput(){
    var html = "<div class='row group wrapper'><textarea class='tag-input padding-top' placeholder='#tags'></textarea><div class='tag-container'></div></div>";
    return html
  }
  function createMod(html){
    var mod = $($.parseHTML(html));
        mod.attr('id', modID);
        mod.data('type', type)
    var icon = mod.find('.fa-remove')
        icon.data('id', modID);
    icon.on('click', function(){ 
      $('#'+modID).remove();
      $('#btw-bar-'+modID.split('-')[2]).remove();
    });
    return mod;
  }
  function createComparison(){
    var html = "<article class='comparison-module module padding-bottom padding-top'>" + htmlHeader('sliders', 'Comparison') + htmlDropzone() + htmlTaginput(); + "</article>";
    var mod = createMod(html);
    return mod;
  }
  function createGrid(){
    var html = "<article class='grid-module module padding-bottom padding-top'>" + htmlHeader('square', 'Photo Grid') + htmlDropzone() + htmlTaginput() +"</article>";
    var mod = createMod(html);
    return mod;
  }
  function createHalf(){
    var text = "<div class='text-module h-centered six columns'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>";
    var photo = "<div class='droppable dropzone six columns'>" + htmlDropzone() + "</div>";
    var html = "<article class='half-module module padding-bottom padding-top'>" + htmlHeader('star-half', 'Photo with Text') + "<div class='row group wrapper'>" + photo + text + "</div>" + htmlTaginput() + "</article>";
    var mod = createMod(html);
    return mod;
  }
  function createText(){
    var html = "<article class='text-module module padding-bottom padding-top'>" + htmlHeader('file-text', 'Text') + "<div class='row group wrapper'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>" + htmlTaginput() + "</article>";
    var mod = createMod(html);
    return mod;
  }
  function createVideo(){
    var html = "<article class='video-module module padding-bottom padding-top'>" + htmlHeader('file-video', 'Video') + "<div class='row group wrapper'><textarea class='padding-bottom' class='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea><textarea class='caption char-limited padding-top' placeholder='Add an optional caption.'></textarea><span class='char-limit font_small light hidden' data-limit='140'>140</span></div>" + htmlTaginput() + "</article>";
    var mod = createMod(html);
    return mod;
  }
  function driver(){
    if(type == 'comparison'){
      var mod = createComparison();
    }
    else if(type == 'grid'){
      var mod = createGrid();
    }
    else if(type == 'half'){
      var mod = createHalf();
    }
    else if(type == 'text'){
      var mod = createText();
    }
    else if(type == 'video'){
      var mod = createVideo();
    }
    bar.before(mod);
    new ButtonBar({type: 'btw', mod: mod});  
    new Form($(mod).find('textarea.tag-input'));
    new Form($(mod).find('textarea.text-module-body'));
    new Form($(mod).find('textarea.caption'));
    new Drop(mod);
  }
  driver();
}
function PhotoUpload(el) {
  var el = el;

  function htmlPhotoPrev(result) {
    var html = "<article class='preview six columns h-centered' id='#preview-" + result.id +"'><div class='img-wrapper v-centered'><img src='" + result.photo_file.medium.url +"' class='draggable invisible' data-id='" + result.id +"'</div></article>";
    var photoPrev = $($.parseHTML(html));
    var img = photoPrev.find('img');
    new Drag(img);
    img.on('load', function() {
      $(this).removeClass('invisible');
    });
    return photoPrev;
  }
  function htmlPhotoRow() {
    var html = "<div class='photo-row row group wrapper'></div>";
    var row = $($.parseHTML(html));
    return row;
  }
  function appendPhotos(result) {
    var photo = htmlPhotoPrev(result);
    var container;
    if(result.is_aerial) {
      container = $('#photos-aerial');
      photo.addClass('aerial');
    }
    else if(result.is_normal) {
      container = $('#photos-street');
      photo.addClass('street');
    }
    var lastRow = container.find('.photo-row').last();
    var photoCount = lastRow.find('.preview').length;
    var row;
    if(photoCount == 1) {
      row = lastRow;
      row.append(photo);
    }
    else{
      row = htmlPhotoRow();
      row.append(photo);
      container.append(row);
    }
  }
  function init(){
    var user_gal_id = el.siblings('#user-gal-id').attr('value');
    el.fileupload({
      dataType: 'json',
      url: '/user_galleries/' + user_gal_id + '/photos',
      progressall: function(e, data){
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('.temp-preloader').removeClass('hidden');
        $('.progress-bar').css('width', progress + '%');
      },
      done: function (e, data) {
        appendPhotos(data.result);
        $('.temp-preloader').addClass('hidden');
        new Nav({type: 'reset'});
      } // end done
    }); // end fileupload 
  }

  function driver(){
    init();
  }
  driver();
}
function Nav(settings) {
  var type = settings.type;

  function initStickyNav(el, z) {
    el.stickyNavbar({
      animDuration: 250,              // Duration of jQuery animation
      startAt: 0,                     // Stick the menu at XXXpx from the top of the this() (nav container)
      easing: "linear",               // Easing type if jqueryEffects = true, use jQuery Easing plugin to extend easing types - gsgd.co.uk/sandbox/jquery/easing
      animateCSS: true,               // AnimateCSS effect on/off
      animateCSSRepeat: false,        // Repeat animation everytime user scrolls
      cssAnimation: "fadeInDown",     // AnimateCSS class that will be added to selector
      jqueryEffects: false,           // jQuery animation on/off
      jqueryAnim: "slideDown",        // jQuery animation type: fadeIn, show or slideDown
      mobile: false,                  // If false nav will not stick under 480px width of window
      mobileWidth: 480,               // The viewport width (without scrollbar) under which stickyNavbar will not be applied (due usability on mobile devices)
      stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
      unstickyModeClass: "unsticky",   // Class that will be applied to 'this' in non-sticky mode
      zIndex: z
    });
  }

  function getCatOrigin(tab){
    return $('#photo-cats').find('.item').data('origin');
  }
  function setCatOrigin(tab){
    $('#photo-cats').find('.item').data('origin', tab.data('type'));
  }
  function resetCatTabs(tab){
    var origin = tab.data('type');
    var activeCat = $('#photo-cats').find('.active').data('type');
    var activeSection = $('#photos-'+origin).find('#photos-'+activeCat);
        activeSection.removeClass('invisible').removeClass('hidden');
    var otherSection = activeSection.siblings('.sub-photo-list');
        otherSection.addClass('invisible').addClass('hidden');
  }
  function toggleTab(tab){
    if(!tab.hasClass('active')){
      tab.addClass('active');
      tab.siblings('.item').removeClass('active');
    }
  }
  function toggleCatPhotos(tab){
    var origin = getCatOrigin(tab);
    var newType = tab.data('type');
    var newPhotoSection = $('#photos-'+origin).find('#photos-'+newType);
    var oldPhotoSection = $(newPhotoSection.siblings('.sub-photo-list'));
    
    if(tab.hasClass('active')){
      newPhotoSection.removeClass('invisible').removeClass('hidden');
      oldPhotoSection.addClass('invisible').addClass('hidden');
    }
  }
  function toggleStatePhotos(tab){
    var photoSection = $('#photos-'+tab.data('type'));
        photoSection.removeClass('hidden');
        photoSection.siblings('.photo-list').addClass('hidden');
  }
  function initStateBar(bar){
    bar.on('click', '.item', function(){
      var tab = $(this);
      toggleTab(tab);
      resetCatTabs(tab)
      toggleStatePhotos(tab);
      setCatOrigin(tab);
    });
  }
  function initCatBar(bar){
    bar.on('click', '.item', function(){
      var tab = $(this);
      toggleTab(tab);
      toggleCatPhotos(tab);
    });
  }
  function driver() {
    if(type == 'create') {
      initStickyNav($('#navbar-create'), 9);
      initStickyNav($('#navbar-photo-manager'), 8);
      initStateBar($('#photo-state'));
      initCatBar($('#photo-cats'));
    }
    else if(type == 'main') {
      initStickyNav($('#navbar-main'), 9);
    }
    // else if(type == 'reset'){
    //   $('#photo-cats').removeClass('hidden');
    //   $('#tab-uploaded').removeClass('empty');
    // }
  }
  driver();
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}