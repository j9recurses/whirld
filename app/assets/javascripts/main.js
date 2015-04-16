$(document).ready(function(){
  creationStickyNav();
  mainStickyNav();
  var bb = new ButtonBar({type: 'end'});
  var form = new Form();

  // // TEMPORARY
  // $.each($('article.preview'), function(i,el){
  //   $(el).attr('id', "preview-"+i);
  //   var img = $(el).find('img');
  //       img.data('id', i);
  // });

  // // Video stuff
  // var submit_button = $('#submit_pre_upload_form');
  //  var video_upload = $('#video_upload');

  //  submit_button.click(function () {
  //    console.log("in here")
  //    $.ajax({
  //      type: 'POST',
  //      url: "/videos/videos_get_upload_token",
  //      data: $('#video_pre_upload').serialize(),
  //      dataType: 'json',
  //      success: function(response) {
  //        video_upload.find('#token').val(response.token);
  //       window.alert(response.token)
  //        video_upload.attr('action', response.url.replace(/^http:/i, window.location.protocol)).submit();
  //        submit_button.unbind('click').hide();
  //        $('.preloader').css('display', 'block');
  //      },
  //      error: function(XMLHttpRequest, textStatus, errorThrown) {
  //        alert(errorThrown);
  //      }
  //    });
  //  });
  //  $("#map_name,#map_slug").keyup(function() {
  //    $("#map_slug").val(string_to_slug($(this).val()))
  //  });

  //  function string_to_slug(text){
  //    return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
  //  }

});
function Module(option){
  var bar = option.parent();
  var type = option.data('module-type');
  var modID = type + "-module-" + $('.module').length;

  function htmlHeader(icon, type){
    var html = "<div class='row group wrapper'><div class='six columns'><i class='fa fa-cc-" + icon + "'></i><span class='cursor-def'>" + type + "</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div>";
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
    var html = "<article class='comparison-module module padding-bottom padding-top'>" + htmlHeader('cc-visa', 'Comparison') + htmlDropzone() + htmlTaginput(); + "</article>";
    var mod = createMod(html);
    return mod;
  }
  function createGrid(){
    var html = "<article class='grid-module module padding-bottom padding-top'>" + htmlHeader('photo', 'Photo Grid') + htmlDropzone() + htmlTaginput() +"</article>";
    var mod = createMod(html);
    return mod;
  }
  function createHalf(){
    var text = "<div class='text-module h-centered six columns'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>";
    var photo = "<div class='droppable dropzone six columns'>" + htmlDropzone() + "</div>";
    var html = "<article class='half-module module padding-bottom padding-top'>" + htmlHeader('bar-chart', 'Photo with Text') + "<div class='row group wrapper'>" + photo + text + "</div>" + htmlTaginput() + "</article>";
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
    var dd = new DragDrop(mod);
  }
  driver();
}

function ButtonBar(settings){
  var mod = settings.mod || '';
  var type = settings.type;

  function openBar(){
    var bar = $($(this).parent());
        bar.addClass('open');
        bar.removeClass('closed');
        $.each(bar.children('.option'), function(i, option){
          $(option).addClass('option-'+i.toString()).dequeue();
        })
    bar.children('.option').hover(function(){
      $(this).children('.button-label').toggleClass('hidden');
    })
    bar.closest('html').on('keyup', function(e){
      if(e.which == 27){ closeBar(bar); }
    });
  }
  function closeBar(bar){
    bar.removeClass('open');
    bar.addClass('closed');
    $.each(bar.children('.option'), function(i, option){
      $(option).removeClass('option-'+i.toString()).dequeue();
    })
  }
  function createBTW(){
    html = "<ul class='button-bar button-bar-btw closed'><li class='option item' data-module-type='grid'><button><i class='h2-size fa fa-newspaper-o'></i></button><br><span class='hidden button-label font_small'>Grid</span></li><li class='option item' data-module-type='comparison'><button><i class='h2-size fa fa-cc-visa'></i></button><br><span class='hidden button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item' data-module-type='half'><button><i class='h2-size fa fa-bar-chart'></i></button><br><span class='hidden button-label font_small'>Half</span></li><li class='option item' data-module-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='hidden button-label font_small'>Text</span></li><li class='option item' data-module-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='hidden button-label font_small'>Video</span></li></ul>";
    el = $($.parseHTML(html));
    el.attr('id', "btw-bar-" + $('.button-bar-btw').length);
    return el
  }
  function init(el){
    el.on('click', '.option-toggle', openBar);
    el.on('click', '.option', function(){
      var mod = new Module($(this));
      closeBar($(this).parent());
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
    }
  }
  driver();
}

function DragDrop(mod){
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
    new Form($(mod.find('textarea.tag-input')));
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
  function initDrag(){
    $('.draggable').draggable({
      containment: '#project-creation',
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

  function driver(){
    initDrag();
    initModDrop(mod);
    initSort(mod);
  }
  driver();
}

function Form(el){
  el = el || $(document);

  function htmlPhotoPrev(result){
    var html = "<article class='preview six columns h-centered' id='#preview-" + result.id +"'><div class='img-wrapper v-centered'><img src='" + result.photo_file.url +"' class='draggable' data-id='" + result.id +"'</div></article>";
    var photoPrev = $($.parseHTML(html));
    return photoPrev;
  }
  function htmlPhotoRow(){
    var html = "<div class='photo-row row group wrapper'></div>";
    var row = $($.parseHTML(html));
    return row;
  }
  function createTagText(e){
    var input = $(e.target);
    var s = input.val().toLowerCase();
    var tagText = s.replace(/[\.,-\/#!'$\n?%\^&\*;:{}=\-_`~()]/g,"");
        tagText = tagText.trim();
    return tagText;
  }

  function createTag(e){
    var tagText = createTagText(e);
    var tagHTML = "<span class='project-tag cursor-def light font_small'>#" + tagText + "</span>";
    var tag = $($.parseHTML(tagHTML));
    var tagID = 'tag-' + tagText;
        tag.attr('id', tagID);
        tag.on('click', function(){ $(this).remove(); });
    return tag;
  }

  function appendTag(e){
    var input = $(e.target);
    var tagList = input.nextAll('.tag-container');
    var tag = createTag(e)[0];
    if(e.which == 188 || e.which == 13){
      if(tagList.children('.project-tag').length == 0){
        tagList.append(tag);
        input.val('');
      }
      else {
        if($('#'+tag.id).length > 0){
          $('#'+tag.id).addClass('error');
          input.val('');
          setTimeout(function() {
             $('#'+tag.id).removeClass('error');
           }, 600);
        }
        else{
          tagList.append(tag);
          input.val('');
        }
      }
    }
  }
  function changeCounter(e){
    var input = $(e.target);
    var letterCount = input.val().length;
    var span = input.nextAll('span.char-limit');
        $(span).removeClass('hidden');
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);
    input.on('focusout', function(){
      if(letterCount == 0){ $($(this).nextAll('span.char-limit')).addClass('hidden'); }
    });
  }
  function initPhotoUpload(el){
    var user_gal_id = el.find('#user-gal-id').attr('value');
    var button = el.find('#photo-upload-input');

      button.fileupload({
        dataType: 'json',
        url: '/user_galleries/'+user_gal_id+'/photos',
        done: function (e, data) {
          var container = $('#photos-uploaded');
          var lastRow = container.find('.photo-row').last();
          var photo = htmlPhotoPrev(data.result);
          var photoCount = lastRow.find('.preview').length;
          var row;
          if(photoCount == 1){
            row = lastRow;
            row.append(photo);
          }
          else{
            row = htmlPhotoRow();
            row.append(photo);
            container.append(row);
          }
        } // end done

    });
  }
  function loadDoc(){
    $('#project-description').keyup(function(e){ changeCounter(e); });
    autosize($('textarea#project-description'));
    $('#project-tag-list').keyup(function(e){ appendTag(e); });
    $('#project-title').keyup(function(e){ changeCounter(e); });
    autosize($('textarea#project-title'));
    if($('#project-creation').length > 0){
      initPhotoUpload($('#project-creation'));
    }
  }
  function driver(){
    if(el.hasClass('caption')){
      el.keyup(function(e){ changeCounter(e); });
      autosize(el);
    }
    else if(el.hasClass('tag-input')){
      el.keyup(function(e){ appendTag(e); });
    }
    else if(el.hasClass('text-module-body')){
      autosize(el);
    }
    else {
      loadDoc();
    }
  }
  driver();
}

var creationStickyNav = function () {
  $('#navbar-create').stickyNavbar({
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
    zindex: 9999,                   // The zindex value to apply to the element: default 9999, other option is "auto"
    stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
    unstickyModeClass: "unsticky"   // Class that will be applied to 'this' in non-sticky mode
  });
}

var mainStickyNav = function () {
    $('#navbar-main').stickyNavbar({
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
    zindex: 9999,                   // The zindex value to apply to the element: default 9999, other option is "auto"
    stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
    unstickyModeClass: "unsticky"   // Class that will be applied to 'this' in non-sticky mode
  });
}
