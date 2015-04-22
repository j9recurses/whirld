function ButtonBar(settings) {
  var mod = settings.mod || '';
  var type = settings.type;

  function createBTW(){
    html = "<ul class='button-bar button-bar-btw'><li class='option item invisible' data-module-type='grid'><button><i class='h2-size fa fa-square'></i></button><br><span class='invisible button-label font_small'>Grid</span></li><li class='option item invisible' data-module-type='comparison'><button><i class='h2-size fa fa-sliders'></i></button><br><span class='invisible button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item invisible' data-module-type='split'><button><i class='h2-size fa fa-star-half'></i></button><br><span class='invisible button-label font_small'>Split</span></li><li class='option item invisible' data-module-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='invisible button-label font_small'>Text</span></li><li class='option item invisible' data-module-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='invisible button-label font_small'>Video</span></li></ul>";
    el = $($.parseHTML(html));
    el.attr('id', "btw-bar-" + mod.data('type') + '-' + mod.data('mod-id'));
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
      $(option).removeClass('invisible').addClass('option-'+i).dequeue();
      $(option).off().on({
        mouseenter: function(){
          $(this).find('.button-label').removeClass('invisible');
        },
        mouseleave: function(){
          $(this).find('.button-label').addClass('invisible');
        }
      })
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

function Module(option) {
  var originBar = option.parent();
  var type = option.data('module-type');
  var user_gallery_id = $('#project-creation-2').data('user-gallery-id');

  // Functions for module html and events
  function htmlHeader(icon, type){
    var html = "<div class='row group wrapper'><div class='six columns'><i class='fa fa-" + icon + "'></i><span class='cursor-def'> " + type + "</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i><i class='fa fa-save'></i></div></div>";
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
    else if(type == 'split'){
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
  function htmlComparison(){
    var html = "<article class='comparison-module module padding-bottom padding-top'>" + htmlHeader('sliders', 'Comparison') + htmlDropzone() + htmlTaginput(); + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlGrid(){
    var html = "<article class='grid-module module padding-bottom padding-top'>" + htmlHeader('square', 'Photo Grid') + htmlDropzone() + htmlTaginput() +"</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlSplit(){
    var text = "<div class='text-module h-centered six columns'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>";
    var photo = "<div class='droppable dropzone six columns'>" + htmlDropzone() + "</div>";
    var html = "<article class='split-module module padding-bottom padding-top'>" + htmlHeader('star-half', 'Photo with Text') + "<div class='row group wrapper'>" + photo + text + "</div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlText(){
    var html = "<article class='text-module module padding-bottom padding-top'>" + htmlHeader('file-text', 'Text') + "<div class='row group wrapper'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlVideo(){
    var html = "<article class='video-module module padding-bottom padding-top'>" + htmlHeader('file-video', 'Video') + "<div class='row group wrapper'><textarea class='padding-bottom' class='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea><textarea class='caption char-limited padding-top' placeholder='Add an optional caption.'></textarea><span class='char-limit font_small light hidden' data-limit='140'>140</span></div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlMod(){
    if(type == 'comparison'){
      var mod = htmlComparison();
    }
    else if(type == 'grid'){
      var mod = htmlGrid();
    }
    else if(type == 'split'){
      var mod = htmlSplit();
    }
    else if(type == 'text'){
      var mod = htmlText();
    }
    else if(type == 'video'){
      var mod = htmlVideo();
    }
    return mod;
  }
  // Functions for saving, editing, deleting modules and their assets. These have to be initiated within the createMod function.
  function updateOrCreateTags(mod, taglist){
    var data = {
      mod_gallery: parseInt(mod.data('mod-id')),
      mod_type: mod.data('type'),
      taglist: taglist
    }
    $.ajax({
      url: '/photo_mods/create_taggings',
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: tags were created')
      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  }
  function updateOrCreatePhoto(mod, photo){
    console.log('update or create one photo');
    var data = {
                mod_gallery: parseInt(mod.data('mod-id')),
                mod_type: mod.data('type'),
                photo_id: parseInt($(photo).find('img').data('img-id')),
                caption: $(photo).find('.caption').val()
              }
    $.ajax({
      url: '/photo_mods/place_mod_photo',
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: photo is associated')
        $(photo).data('img-saved', true);
        $(photo).data('association-id', data.id);
        $(photo).attr('id', 'photo-'+data.id);
        mod.addClass('saved');

        // run diffrent AJAX call with the orders of the photos because in UpdateMod / updateOrCreatePhoto, the .photo hasn't been appended yet.
        updatePhotoOrders(mod);
      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  }
  // this is an AJAX call to the UserGallery + type url that is called inside of updateOrCreatePhoto
  function updatePhotoOrders(mod){
    var photoIds = '';
    $.each(mod.find('.photo'), function(i, photo){
      photoIds += $(photo).data('association-id') + ',';
    });
    var data = { mod_gallery: mod.data('mod-id') };
        data[type + '_photo_order'] = photoIds;
    console.log(photoIds);
    $.ajax({
      url: '/photo_mods/user_gallery_' + type + '_update/'  + mod.data('mod-id'),
      data: data,
      cache: false,
      type: 'put',
      success: function(data){
        console.log('Success: order updated');
      },
      error: function(data){
        console.log('Something went wrong');
      }
    }); // end ajax
  }
  function updateMod(mod){

    var data = { mod_gallery: mod.data('mod-id') };
    $.ajax({
      url: '/photo_mods/user_gallery_' + type + '_update/'  + mod.data('mod-id'),
      data: data,
      cache: false,
      type: 'put',
      success: function(data) {
        console.log('Success: module updated!');
        // now update photos
        $.each(mod.find('.photo'), function(i, photo){
          updateOrCreatePhoto(mod, photo);
        });
        //now get the tags
        var taglist = []
         $.each(mod.find('.project-tag'), function(i, tag){
          var tagval =  $(tag).text()
          taglist.push(tagval);
        });
        var taglist_str = taglist.join(",")
        updateOrCreateTags(mod, taglist_str)
      },
      error: function(data){
        console.log("Error: module not updated");
        console.log(data);
      }
    }); // end ajax
  }
  function deletePhoto(mod, photo){
    var data = {
            mod_gallery: parseInt(mod.data('mod-id')),
            mod_type: mod.data('type'),
            photo_id: parseInt($(photo).find('img').data('img-id'))
          }
      $.ajax({
        url: '/photo_mods/remove_mod_photo/'+photo.data('association-id'),
        data: data,
        cache: false,
        type: 'delete',
        success: function(data){
          console.log('Success: photo is disassociated');
        },
        error: function(){
          console.log('something went wrong')
        }
      }); // end ajax
  }
  function deleteMod(mod){
    var data = {mod_gallery: mod.data('mod-id')}
    $.ajax({
      url: '/photo_mods/user_gallery_' + type + '_delete/'  + mod.data('mod-id'),
      data: data,
      cache: false,
      type: 'post',
      beforeSend: function(xhr)
      {
         xhr.setRequestHeader("X-Http-Method-Override", "DELETE");
      },
      success: function(data) {
        console.log('Success: module deleted!');
      },
      error: function(){
        console.log("Error: module not deleted");
      }
    }); // end ajax
    $('#btw-bar-' + type + '-' + mod.data('mod-id')).remove();
    mod.remove();
  }
  // on click of button bar, create the module and initiate other requests
  function createMod(){
    var mod = htmlMod();
    var url = '/photo_mods/user_gallery_' + type + '_create/' + user_gallery_id;
    var data = { user_gallery_id: user_gallery_id };

    $.ajax({
      url: url,
      data:  data,
      cache: false,
      type: 'post',
      success: function(data) {
        console.log('Success: module created');
        // Put data in DOM
        mod.attr('id', 'module-' + type + '-' + data.id);
        mod.data('type', type);
        mod.data('mod-id', data.id);
        mod.data('saved', true);
        mod.addClass('saved');

        // Append module before the button bar it came from
        originBar.before(mod);

        // Give module its own button bar
        new ButtonBar({type: 'btw', mod: mod});

        // initiate other interactions
        new Drop(mod);
        new Form($(mod).find('textarea.tag-input'), mod.attr('id'));
        new Form($(mod).find('textarea.text-module-body'), mod.attr('id'));

        // initiate other requests
        var save = mod.find('.fa-save');
            save.on({
              click: function(){ updateMod(mod); }
            });
        var remove = mod.find('.fa-remove');
            remove.on({
              click: function(){ deleteMod(mod) }
            });
      },
      error: function(){
        console.log("Error: module not created");
      }
    }); // end ajax
    return mod;
  }

  createMod();

  //inside of Module for now
  function Drop(mod) {
    var mod = mod;
    var modType = mod.data('type');

    // functions for on-drop DOM photo creation
    function htmlDefaultMessage(){
      var message;
      if(modType == 'comparison'){
        message = 'Drag two photos here to compare them.';
      }
      else if(modType == 'grid'){
        message = 'Drag up to ten photos here.';
      }
      else if(modType == 'split'){
        message = 'Drag one photo here.';
      }
      var html = "<p class='caps'>" + message +"</p>";
      return $($.parseHTML(html));
    }
    function htmlPhoto(){
      var colNum;
      if(modType == 'split'){
        colNum = 'twenty-four';
      }
      else{
        colNum = 'twelve';
      }
      return html = "<div class='photo " + colNum + " columns'><div class='img-wrapper'><button class='photo-remove font_small h-centered hidden'><i class='fa fa-remove'></i></button></div><textarea class='caption char-limited padding-top' placeholder='Add an optional caption'></textarea><span class='char-limit font_small light invisible' data-limit='140'>140</span></div>";
    }
    function createPhoto(ui){ // add .photo data and states here.
      var id = ui.draggable.data('img-id');
      var img = ui.draggable.clone();
          img.removeClass('draggable').removeClass('ui-draggable').removeClass('ui.draggable-handle');
          img.data('img-id', id);
      var photo = $($.parseHTML(htmlPhoto()));
          photo.find('.img-wrapper').prepend(img);
      return photo;
    }
    function createDropZone(e, ui){
      var dropzone = $(e.target);
          dropzone.removeClass('dropzone');
          dropzone.find('p').remove();
      var mod = dropzone.closest('.module');
          mod.removeClass('saved');
      var photo = createPhoto(ui);

      dropzone.append(photo);
      initPhotoRemovable(photo);

      new Form($(photo.find('textarea.caption')));

      mod.removeClass('saved');
    }

    function droppableLimit(){
      if(modType == 'comparison'){ return 2; }
      else if(modType == 'grid'){ return 10; }
      else if(modType == 'split'){ return 1 }
    }

    // event handlers
    function initPhotoRemovable(photo){
      var imgWrapper = photo.find('.img-wrapper');
      imgWrapper.hover(function(){
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
        mod.removeClass('saved');
        deletePhoto(mod, photo)
        $(photo).remove();
      });
    }
    function initModDrop(mod){
      mod.find('.droppable').droppable({
        accept: '.draggable',
        activeClass: 'drop-active',
        hoverClass: 'drop-target',
        drop: function(e, ui){
          var photoCount = mod.find('.photo').length;
          if(photoCount < droppableLimit()){
            createDropZone(e, ui);
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

    // object logic
    function driver(){
      initModDrop(mod);
      initSort(mod);
    }
    driver();
  }

}