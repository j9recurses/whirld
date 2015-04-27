function Form(el, modId) {
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
  function ajaxAll(elArray){
    $.each(elArray, function(i, el){
      $(el).on('focusout', function(){
        ajax($(this));
        if($(el).attr('id') == 'project-location'){
          ajax($('#project-lat')); 
          ajax($('#project-lon'));
        }
      });
    });
  }
  function changeCounter(e) {
    var input = $(e.target);
    var letterCount = input.val().length;
    var span = input.nextAll('span.char-limit');
        $(span).removeClass('invisible');
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);
    input.on('focusout', function() {
      if(letterCount == 0) { $($(this).nextAll('span.char-limit')).addClass('invisible'); }
    });
    $(e.target).closest('.module').removeClass('saved');
    $(e.target).closest('.module').data('saved', false);
  }
  function addFocus(el){
    el.closest('.input-wrapper').addClass('focus-in').addClass('has-text');
  }
  function checkFocus(elArray){
    $.each(elArray, function(i, el){
      if($(el).val().length > 0){
        $(el).closest('.input-wrapper').addClass('has-text');
        autosize($(el));
      }
    });
  }
  function removeFocus(el){
    if(el.val().length == 0){
      el.closest('.input-wrapper').removeClass('focus-in').removeClass('has-text');
    }
    else{ 
      el.closest('.input-wrapper').removeClass('focus-in');
    }
  }
  function createBasicField(elArray) {
    $.each(elArray, function(i, el) {
      el.keyup(function(e) { changeCounter(e); });
      el.on('focusin', function(){
        addFocus($(this));
        autosize($(this));
        $(this).on('focusout', function(){
          removeFocus($(this));
        });
      });
    }); // end each
  }

  // Location field functions
  function dataLocation(el){
    var lat = el.next().find('#project-lat');
    var lon = el.next().find('#project-lon');
    var data = {location: el.val(), lat: lat.val(), lon: lon.val()};
    return data;
  }
  function createLocationFields(el){
    if($('#project-creation-1').length > 1){
      $('#project-lat').val('');
      $('#project-lon').val('');
    }
    el.on('focusin', function(){
      addFocus($(this));
      $(this).on('focusout', function(){
        removeFocus($(this));
        // $.each([$('#project-lat'), $('#project-lon')], function(i, el){
        //   if($(el).val().length == 0){ removeFocus($(el)); }
        // });
      });
      addFocus($('#project-lat'));
      addFocus($('#project-lon'));
    });
    $('#project-lat').on('focusin', function(){
      addFocus($(this));
      $(this).on('focusout', function(){ removeFocus($(this)) });
    });
    $('#project-lon').on('focusin', function(){
      addFocus($(this));
      $(this).on('focusout', function(){ removeFocus($(this)) });
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
    el.keyup(function(e) { 
      appendTag(e); 
      $(e.target).closest('.module').removeClass('saved'); 
      $(e.target).closest('.module').data('saved', false);
    });
    el.on('focusin', function(){
      addFocus($(this));
      $(this).on('focusout', function(){
        removeFocus($(this));
      });
    });
  }

  // Object logic
  function loadDoc(){
    createBasicField( [ $('#project-description'), $('#project-name') ] );
    createTagField($('#project-tag_list'));
    createLocationFields($('#project-location'));
    if($('#project-creation-2').length > 0){
      ajaxAll( [ $('#project-description'), $('#project-name'), $('#project-location'), $('#project-lat'), $('#project-lon') ] );
      checkFocus( [ $('#project-description'), $('#project-name'), $('#project-location'), $('#project-lat'), $('#project-lon') ] );
    }
  }
  function initFields(){
    if(el.hasClass('caption')){
      el.keyup(function(e){
        changeCounter(e);
      });
      autosize(el);
    }
    else if(el.hasClass('tag-input')){
      createTagField(el);
    }
    else if(el.hasClass('text-module-body')){
      el.keyup(function(e){
        $(e.target).closest('.module').removeClass('saved'); 
        $(e.target).closest('.module').data('saved', false);
      });
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

function PhotoUpload(el) {
  var el = el;

  function htmlPhotoPrev(result) {
    console.log(result)
    var html = "<article class='preview six columns h-centered' id='#preview-" + result.id +"'><div class='img-wrapper v-centered'><img src='" + result.photo_file.medium.url +"' class='draggable invisible' data-img-id='" + result.id +"'</div></article>";
    var photoPrev = $($.parseHTML(html));
    var img = photoPrev.find('img');
        img.data('id', result.id)
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
        $('#photo-manager').addClass('invisible');
      },
      done: function (e, data) {
        appendPhotos(data.result);
        $('.temp-preloader').addClass('hidden');
        $('#photo-manager').removeClass('invisible');
      } // end done
    }); // end fileupload 
  }

  function driver(){
    init();
  }
  driver();
}