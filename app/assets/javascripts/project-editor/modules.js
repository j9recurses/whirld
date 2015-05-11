
// Constructor for module html
var ModuleHtml = function(options){
  this.options = $.extend({
    modType: 'grid'
  }, options);

  this.emptyMessage = null;
  this.iconClass = null;
  this.label = null;

  this.setModData();
}
// Functions for module html and events
ModuleHtml.prototype = {
  setModData: function(){
    if(this.options.modType == 'grid'){
      this.emptyMessage = "<p class='uk-h1'><i class='fa fa-photo'></i> Drag up to ten photos here.</p>";
      this.iconClass = 'th-large';
      this.label = 'Photo Grid';
    }
    else if(this.options.modType == 'split'){
      this.emptyMessage = "<p class='uk-h2'><i class='fa fa-photo'></i> Drag one photo here.</p>";
      this.iconClass = 'star-half';
      this.label = 'Text With Photo';
    }
    else if(this.options.modType == 'comparison'){
      this.emptyMessage = "<p class='uk-h2'><i class='fa fa-photo'></i> Drag two photos here to compare them.</p>";
      this.iconClass = 'angle-right';
      this.label = 'Compare Two Photos';
    }
    else if(this.options.modType == 'text'){
      this.iconClass = 'file-text';
      this.label = 'Text Block';
    }
    else if(this.options.modType == 'video'){
      this.iconClass = 'file-video';
      this.label = 'Video';
    }
  },
  htmlCaption: function(){
    var html = "<div class='uk-form width-1-1'><textarea class='caption uk-width-1-1' placeholder='Describe your content.'</textarea><small class='char-limit uk-invisible' data-limit='70'>70</small></div>";
    return html
  },
  htmlDropzone: function(){
    var html = "<div class='uk-placeholder uk-text-muted uk-placeholder-large droppable ui-droppable ui-sortable uk-text-center'>" + this.emptyMessage + "</div>";
    return html;
  },
  htmlHeader: function(){
    var html = "<div class='module-header uk-width-1-1 uk-grid uk-grid-collapse'><h2 class='uk-text-muted uk-text-bold uk-h4 uk-width-1-2'><i class='fa fa-" + this.iconClass + "'></i> " + this.label + "</h2><div class='uk-width-1-2 uk-text-right remove-mod'><button class='uk-close'></button></div></div>";
    return html
  },
  htmlTaginput: function(){
    var html = "<input class='tag-input uk-width-1-1' placeholder='#tags'/><div class='tag-container'></div>";
    return html
  },
  comparison: function(){
    var html = "<article class='comparison-module module uk-width-1-1'>" + this.htmlHeader() + this.htmlDropzone() + "<div class='uk-form width-1-1'>" + this.htmlTaginput() + "</div></article>";
    return $(html);
  },
  grid: function(){
    var html = "<article class='grid-module uk-width-1-1 module'>" + this.htmlHeader() + this.htmlDropzone() + "<div class='uk-form width-1-1'>" + this.htmlTaginput() + "</div></article>";
    return $(html);
  },
  split: function(){
    var text = "<div class='uk-width-1-2 uk-form'><textarea class='text-module-body uk-width-1-1' placeholder='Add some text'></textarea></div>";
    var photo = "<div class='uk-placeholder uk-text-muted uk-placeholder-large droppable dropzone ui-droppable ui-sortable uk-text-center uk-width-1-2'>" + this.emptyMessage + "</div>";
    var html = "<article class='split-module uk-width-1-1'>" + this.htmlHeader() + "<div class='uk-grid uk-width-1-1 uk-grid-collapse'>" + photo + text + "</div>" + this.htmlTaginput() + "</article>";
    return $(html);
  },
  text: function(){
    var html = "<article class='text-module module uk-width-1-1'>" + this.htmlHeader() + "<div class='uk-form uk-width-1-1'><textarea class='text-module-body uk-width-1-1 uk-margin-bottom' placeholder='Add a block of text'></textarea></div>" + this.htmlTaginput() + "</article>";
    return $(html);
  },
  video: function(){
    var html = "<article class='video-module module uk-width-1-1'>" + this.htmlHeader() + "<div class='row group wrapper'><textarea class='padding-bottom' class='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea>" + this.htmlCaption() +  + this.htmlTaginput() + "</article>";
    return $(html);
  },
  html: function(){
    var modHtml = 'this.' + this.options.modType + '()';
    return eval(modHtml);
  }
}

// Constructor for module logic, ajax
var Module = function(options){
  this.options = $.extend({
    id: null,
    modType: 'grid',
    modClassName: 'module',
    originBarId: 'end-bar',
    removeButtonClassName: 'remove-mod'
  }, options);


  // attributes set with initMod()
  this.defaultMesage = null;
  this.dropzone = null;
  this.id = this.options.id;
  this.isPhotoMod = this.setIsPhotoMod();
  this.modEl = null;
  this.newBar = null;
  this.originBar = null;
  this.photoCount = 0;
  this.photoLimit = null;
  this.removeButton = null;
  this.taglist = null;
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');

}
Module.prototype = {
  setIsPhotoMod: function(){
    if(this.options.modType == 'grid' || this.options.modType == 'split' || this.options.modType == 'comparison'){ return true }
      else{ return false }
  },
  setId: function(id){ // called inside ajax
    this.id = id;
    this.modEl.attr('id', 'module-' + this.options.modType + '-' + this.id);
    this.modEl.data('mod-id', this.id);
  },
  setNewBar: function(){
    var bar = new ButtonBar({ barType: 'btw' });
        bar.createBtw(this.modEl.attr('id'));
    this.newBar = bar;
  },
  setOriginBar: function(){
    return $('#' + this.options.originBarId);
  },
  setDefaultMessage: function(){
    var message;
    if(this.options.modType == 'comparison'){
      message = "<p class='uk-h1'><i class='fa fa-photo'></i> Drag two photos here to compare them.</p>";
    }
    else if(this.options.modType == 'grid'){
      message = "<p class='uk-h1'><i class='fa fa-photo'></i> Drag up to ten photos here.</p>";
    }
    else if(this.options.modType == 'split'){
      message = "<p class='uk-h2'><i class='fa fa-photo'></i> Drag one photo here.</p>";
    }
    return message;
  },
  setModEl: function(){
    this.modEl = new ModuleHtml({ modType: this.options.modType }).html();
  },
  setData: function(){
    if(this.options.modType == 'grid'){
      this.photoLimit = 5;
    }
    else if(this.options.modType == 'split'){
      this.photoLimit = 1;
    }
    else if(this.options.modType == 'comparison'){
      this.photoLimit = 2;
    }
    this.setDefaultMessage();
  },
  setParts: function(){
    this.modEl.data('mod-type', this.options.modType);
    this.removeButton = this.modEl.find('.' + this.options.removeButtonClassName);
  },
  setDrop: function(){
    this.modEl = $('#module-'+ this.options.modType + '-' + this.id);
    var self = this;
    this.modEl.find('.droppable').droppable({
      accept: '.draggable',
      activeClass: 'drop-active',
      hoverClass: 'drop-target',
      start: function(e, ui){

      },
      drop: function(e, ui){
        var photoCount = self.modEl.find('.photo').length;
        if(photoCount < self.photoLimit){
          
          var path = $(ui.helper.find('.img-wrapper')).attr('style').split('url(\'')[1].split('\')')[0];
          self.dropzone = $(e.target);
          self.dropzone.removeClass('dropzone').removeClass('uk-placeholder').removeClass('uk-placeholder-large');
          if(self.options.modType != 'split'){
            self.dropzone.addClass('uk-grid');
          }
          self.dropzone.find('p').remove();

          self.mod = self.dropzone.closest('.module');

          console.log(ui.helper.find('.img-wrapper').data('img-id'))

          var photo = new ModPhoto({
            modId: self.id,
            modType: self.options.modType,
            modAttrId: self.modEl.attr('id'),
            dropzone: self.dropzone,
            modType: self.options.modType,
            ui: ui,
            path: path,
            imgId: ui.helper.find('.img-wrapper').data('img-id')
          });
          photo.create();

        }
      }
    });
  },
  setSort: function(){
    var self = this;
    this.modEl.find('.droppable').sortable({
      appendTo: $('.droppable'),
      connectWith: self.modEl.find('.droppable'),
      containment: self.modEl,
      cursor: '-webkit-grab',
      distance: 10,
      handle: '.img-wrapper',
      opacity: .9,
      revert: 150,
      deactivate: function(e, ui){
        console.log('Sorting finished');
        var ids = '';
        $.each(self.modEl.find('.photo'), function(i, modphoto){
          ids += $(modphoto).data('mod-photo-id') + ',';
        });
        self.update(ids)
      }
    });
  },
  initMod: function(){
    this.setModEl();
    this.setData();
    this.setParts();

    // preserve context for events
    var self = this;
   
    // attach events
    this.removeButton.on({
      click: function(){
        self.delete();
        self.newBar.barEl.remove();
        self.deletePhotos();
        self.modEl.remove();
      }
    });
  },
  create: function(){
    var self = this;
    var url = '/photo_mods/user_gallery_' + this.options.modType + '_create/' + this.user_gallery_id;
    var data = {user_gallery_id: this.user_gallery_id};
    $.ajax({
      url: url,
      data:  data,
      cache: false,
      type: 'post',
      success: function(data) {
        console.log('Success: module created');

        // Set parts, data, initiate events
        self.initMod();

        // Set ID
        self.setId(data.id);

        // append module to DOM before the origin bar, before events are attached
        self.originBar = self.setOriginBar();
        self.modEl.insertBefore(self.originBar);

        // create a new button bar and append it before the module element
        self.setNewBar();
        self.newBar.barEl.insertBefore(self.modEl);

        // initiate drag and sort if it's a module with photos
        if(self.isPhotoMod){
          self.setDrop();
          self.setSort();          
        }

        // initiate the form fields
        var tf = new Form({ modAttrId: self.modEl.attr('id') })
            tf.modTagField();

        if(self.options.modType == 'split'){
          var txtField = new Form({ modAttrId: self.modEl.attr('id') });
              txtField.splitTextField();
        }
        else if(self.options.modType == 'text'){
          var txtField = new Form({ modAttrId: self.modEl.attr('id') });
              txtField.textField();
        }
        else if(self.options.modType == 'grid' || self.options.modType == 'comparison'){
          var caption = new Form({ modAttrId: self.modEl.attr('id') });
              caption.captionField();
        }

      },
      error: function(){
        console.log("Error: module not created");
      }
    }); // end ajax
  },
  delete: function(){
    var self = this;
    var url = '/photo_mods/user_gallery_' + this.options.modType + '_delete/'  + this.id;
    var data = {mod_gallery: this.id};
    $.ajax({
      url: url,
      data: data,
      cache: false,
      type: 'post',
      beforeSend: function(xhr){
        xhr.setRequestHeader("X-Http-Method-Override", "DELETE");
      },
      success: function(data){
        console.log('Success: module deleted');

        var tf = new Form({ modAttrId: self.modEl.attr('id') });
            tf.tagSave();
      },
      error: function(){
        console.log("Error: module not deleted");
      }
    }); // end ajax
  },
  deletePhotos: function(){
    var self = this;
    $.each(this.modEl.find('.photo'), function(i, p){
      var options = {
        modId: self.id,
        modType: self.options.modType,
        modAttrId: self.modEl.attr('id'),
        imgId: $(p).find('img').data('img-id'),
        id: $(p).data('mod-photo-id')
      }
      var photo = new ModPhoto(options);
          photo.delete();
    });
  },
  update: function(order){
    console.log(order)
    var self = this;
    var url = '/photo_mods/user_gallery_' + this.options.modType + '_update/'  + this.id;
    var data = {mod_gallery: this.id};
    if(order){
      data[this.options.modType+'_photo_order'] = order;
    }
    console.log(data)
    $.ajax({
      url: url,
      data: data,
      cache: false,
      type: 'put',
      success: function(data){
        console.log('Success: module updated!');
        // update photos

        // update tags

        // update caption
      },
      error: function(){
        console.log("Error: module not updated");
      }
    }); // end ajax
  },
  resetDropzone: function(){
    this.modEl = $('#' + 'module-' + this.options.modType + '-' + this.id);
    this.setData();
    var photoCount = this.modEl.find('.photo').length;
    if(photoCount == 0){
      this.dropzone = this.modEl.find('.droppable');
      this.dropzone.removeClass('uk-grid');
      this.dropzone.addClass('uk-placeholder').addClass('uk-placeholder-large');
      this.dropzone.append($(this.setDefaultMessage()));
    }
  }
}

