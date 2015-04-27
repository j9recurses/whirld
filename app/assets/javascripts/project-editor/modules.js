
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
      this.emptyMessage = 'Drag up to ten photos here.';
      this.iconClass = 'square';
      this.label = 'Photo Grid';
    }
    else if(this.options.modType == 'split'){
      this.emptyMessage = "<p class='caps'>Drag up to ten photos here.</p>";
      this.iconClass = 'star-half';
      this.label = 'Text With Photo';
    }
    else if(this.options.modType == 'comparison'){
      this.emptyMessage = 'Drag two photos here to compare them.';
      this.iconClass = 'sliders';
      this.label = 'Photo Grid';
    }
    else if(this.options.modType == 'text'){
      this.iconClass = 'file-text';
      this.label = 'Text';
    }
    else if(this.options.modType == 'video'){
      this.iconClass = 'file-video';
      this.label = 'Video';
    }
  },
  htmlCaption: function(){
    var html = "<textarea class='caption char-limited padding-top' placeholder='Add an optional caption.'></textarea><span class='char-limit font_small light hidden' data-limit='140'>140</span>";
    return $(html);
  },
  htmlDropzone: function(){
    var html = "<div class='droppable dropzone row group wrapper'><p class='caps'>" + this.emptyMessage +"</p></div>";
    return html;
  },
  htmlHeader: function(){
    var html = "<div class='row group wrapper'><div class='six columns'><i class='fa fa-" + this.icon + "'></i><span class='cursor-def'> " + this.options.modType + "</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i><i class='fa fa-save'></i></div></div>";
    return html
  },
  htmlTaginput: function(){
    var html = "<div class='row group wrapper'><textarea class='tag-input padding-top' placeholder='#tags'></textarea><div class='tag-container'></div></div>";
    return html
  },
  comparison: function(){
    var html = "<article class='comparison-module module padding-bottom padding-top'>" + this.htmlHeader() + this.htmlDropzone() + this.htmlTaginput(); + "</article>";
    return $(html);
  },
  grid: function(){
    var html = "<article class='grid-module module padding-bottom padding-top'>" + this.htmlHeader() + this.htmlDropzone() + this.htmlTaginput() +"</article>";
    return $(html);
  },
  split: function(){
    var text = "<div class='text-module h-centered six columns'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>";
    var photo = "<div class='droppable dropzone six columns'>" + this.htmlDropzone() + "</div>";
    var html = "<article class='split-module module padding-bottom padding-top'>" + this.htmlHeader() + "<div class='row group wrapper'>" + photo + text + "</div>" + this.htmlTaginput() + "</article>";
    return $(html);
  },
  text: function(){
    var html = "<article class='text-module module padding-bottom padding-top'>" + this.htmlHeader() + "<div class='row group wrapper'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>" + this.htmlTaginput() + "</article>";
    return $(html);
  },
  video: function(){
    var html = "<article class='video-module module padding-bottom padding-top'>" + this.htmlHeader() + "<div class='row group wrapper'><textarea class='padding-bottom' class='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea>" + this.htmlCaption() + "</div>" + this.htmlTaginput() + "</article>";
    return $(html);
  },
  html: function(){
    var modHtml = 'this.' + this.options.modType + '()';
    return eval(modHtml);
  }
}

var Droppable = function(options){
  this.options = $.extend({
    mod: null,
    photoLimit: null
  }, options);

  this.dropzone = null;
  this.mod = this.options.mod;
  this.photoLimit = this.options.photoLimit;
}

Droppable.prototype = {
  initDrop: function(){
    var self = this;
    this.mod.find('.droppable').droppable({
      accept: '.draggable',
      activeClass: 'drop-active',
      hoverClass: 'drop-target',
      drop: function(e, ui){
        var photoCount = self.mod.find('.photo').length;
        if(photoCount < self.photoLimit){
          
          self.dropzone = $(e.target);
          self.dropzone.removeClass('dropzone');
          self.dropzone.find('p').remove();

          self.mod = self.dropzone.closest('.module');

          var photo = new ModPhoto({
            modAttrId: self.mod.attr('id'),
            ui: ui
          });
          photo.create();
          self.dropzone.append(photo.modPhotoEl);

        }
      }
    });
  },
  initSort: function(){
    var self = this;
    this.mod.find('.droppable').sortable({
      appendTo: $('.droppable'),
      connectWith: self.mod.find('.droppable'),
      containment: self.mod,
      cursor: '-webkit-grab',
      distance: 10,
      handle: '.img-wrapper',
      opacity: .9,
      revert: 150,
      deactivate: function(e, ui){
        console.log('Sorting finished');
        // markUnSaved(mod);
      }
    });
  },
  init: function(){
    this.initDrop();
    this.initSort();
  }
}

// Constructor for module logic, ajax
var Module = function(options){
  this.options = $.extend({
    modType: 'grid',
    modClassName: 'module',
    originBarId: 'end-bar',
    removeButtonClassName: 'fa-remove',
    saveButtonClassName: 'fa-save'
  }, options);


  // attributes set with initMod()
  this.dropzone = null;
  this.id = null;
  this.modEl = null;
  this.newBar = null;
  this.originBar = null;
  this.photoCount = 0;
  this.photoLimit = null;
  this.removeButton = null;
  this.saveButton = null;
  this.taglist = null;
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');

}
Module.prototype = {
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
  setData: function(){
    if(this.options.modType == 'grid'){
      this.photoLimit = 10;
    }
    else if(this.options.modType == 'split'){
      this.photoLimit = 1;
    }
    else if(this.options.modType == 'comparison'){
      this.photoLimit = 2;
    }
  },
  setPhotoCount: function(){
    return this.photoCount += 1;
  },
  setParts: function(){
    this.modEl = new ModuleHtml({ modType: this.options.modType }).html();
    this.modEl.data('mod-type', this.options.modType);
    this.removeButton = this.modEl.find('.' + this.options.removeButtonClassName);
    this.saveButton = this.modEl.find('.' + this.options.saveButtonClassName);
  },
  setDrop: function(){
    var self = this;
    this.modEl.find('.droppable').droppable({
      accept: '.draggable',
      activeClass: 'drop-active',
      hoverClass: 'drop-target',
      drop: function(e, ui){
        var photoCount = self.modEl.find('.photo').length;
        if(photoCount < self.photoLimit){
          
          self.dropzone = $(e.target);
          self.dropzone.removeClass('dropzone');
          self.dropzone.find('p').remove();

          self.mod = self.dropzone.closest('.module');

          var photo = new ModPhoto({
            modAttrId: self.mod.attr('id'),
            ui: ui
          });
          photo.create();
          console.log(photo.modPhotoEl)
          self.dropzone.append(photo.modPhotoEl);
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
        // markUnSaved(mod);
      }
    });
  },
  initMod: function(){
    // after things are appended to the DOM, set the information and identify its parts
    this.setData();
    this.setParts();

    // preserve context for events
    var self = this;
   
    // attach events
    this.removeButton.on({
      click: function(){
        self.delete();
        self.newBar.barEl.remove();
        self.modEl.remove();
      }
    });
    this.saveButton.on({
      click: function(){
        console.log('save module')
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

        // initiate drag and sort
        self.setDrop();
        self.setSort();

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
      },
      error: function(){
        console.log("Error: module not deleted");
      }
    }); // end ajax
  },
  update: function(){
    var self = this;
    var url = '/photo_mods/user_gallery_' + this.options.modType + '_delete/'  + this.id;
    var data = {mod_gallery: this.id};
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
  }
}

