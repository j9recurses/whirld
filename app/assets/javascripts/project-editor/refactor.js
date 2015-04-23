$(document).ready(function(){
  // initiate button bar
  var bb = new ButtonBar();
      bb.initBar();

});

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

// Constructor for module logic, ajax
var Module = function(options){
  this.options = $.extend({
    modType: 'grid',
    modClassName: 'module',
    originBarId: 'end-bar',
    removeButtonClassName: 'fa-remove',
    saveButtonClassName: 'fa-save'
  }, options);

  // attributes set with initBar()
  this.id = null;
  this.modEl = null;
  this.originBar = null;
  this.photoLimit = null;
  this.removeButton = null;
  this.saveButton = null;
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');

}
Module.prototype = {
  setId: function(){
    console.log('set module id')
  },
  setNewBar: function(){
    var bar = new ButtonBar({ barType: 'btw' });
        bar.initBar();
    return bar;
  },
  setOriginBar: function(){
    var bar = new ButtonBar({ barType: this.options.originBarId.split('-')[0] });
        bar.initBar();
    return bar;
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
  setParts: function(){
    this.modEl = new ModuleHtml({ modType: this.options.modType }).html();
    this.removeButton = this.modEl.find('.' + this.options.removeButtonClassName);
    this.saveButton = this.modEl.find('.' + this.options.saveButtonClassName);
    this.originBar = this.setOriginBar();
    this.newBar = this.setNewBar();
  },
  initBar: function(){
    // after things are appended to the DOM, set the information and identify its parts
    this.setData();
    this.setParts()

    // append module to DOM before the origin bar, before events are attached
    this.originBar.barEl.before(this.modEl);
    this.originBar.close();

    // append new bar before module
    this.modEl.before(this.newBar.barEl);
    console.log(this.originBar)
    console.log(this.newBar)

    // preserve context for events
    var self = this;

    // attach events
    this.removeButton.on({
      click: function(){
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
    var url = '/photo_mods/user_gallery_' + this.options.modType + '_create/' + this.user_gallery_id;
    var data = {user_gallery_id: this.user_gallery_id};
    $.ajax({
      url: url,
      data:  data,
      cache: false,
      type: 'post',
      success: function(data) {
        console.log('Success: module created');
        
        // Set ID
        this.id = data.id;
      },
      error: function(){
        console.log("Error: module not created");
      }
    }); // end ajax
    this.initBar();
  },
  delete: function(){

  }
}