var ImageUploader = function(options){
  this.options = $.extend({
    id: 'photo-upload-input'
  }, options);

  this.id = this.options.id;
  this.el = $('#'+this.id);
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
}

ImageUploader.prototype = {

  coverphoto: function(){
    var url = '/maps/update_remote/' + $('#project-creation-2').data('map-id');
    console.log(url)
    
    this.el.fileupload({
      dataType: 'json',
      url: url,
      done: function (e, data) {
        console.log(data)
      }, // end done
      fail: function (e, data) {
        console.log(data.errorThrown)
        console.log(data.textStatus);
        console.log(data.jqXHR);
      }
    }); // end fileupload
  },
  init: function(){
    var pe = new ProjectEditor();
    console.log('Initated: photo uploader')
    var self = this;
    self.el.fileupload({
      dataType: 'json',
      url: '/user_galleries/' + this.user_gallery_id + '/photos',
      progressall: function(e, data){
        $('#loader').removeClass('uk-hidden');
        $('#preview-list').addClass('uk-hidden');
      },
      done: function (e, data) {
        $('#loader').addClass('uk-hidden');
        $('#preview-list').removeClass('uk-hidden');

        console.log(data.result)

        var img = new Image({
          updated_at: data.result.updated_at,
          id: data.result.id,
          is_aerial: data.result.is_aerial,
          is_normal: data.result.is_normal,
          mediumPath: data.result.photo_file.medium.url,
          thumbPath: data.result.photo_file.thumb.url,
          path: data.result.url,
          warpableId: data.result.warpable_id,
          warpableUrl: data.result.warpable_url
        });
        img.initUploaded();
        pe.init();
      }, // end done
      fail: function (e, data) {
        console.log(data.errorThrown)
        console.log(data.textStatus);
        console.log(data.jqXHR);
      }
    }); // end fileupload

  }
}

var Image = function(options){
  this.options = $.extend({
    updated_at: null,
    dragContainerId: 'project-creation-2',
    id: 1,
    is_aerial: true,
    is_normal: false,
    thumbPath: null,
    mediumPath: null,
    path: null,
    removeButtonClassName: 'photo-delete',
    thumbContainerId: 'preview-list',
    warpableId: null,
    warpableUrl: null
  }, options);

  this.updated_at = this.setDate();
  this.id = this.options.id;
  this.img = null;
  this.thumbEl = null;
  this.photoType = this.setPhotoType();
  this.removeButton = null;
  this.thumbContainer = $('#'+this.options.thumbContainerId);
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
  this.user_id = $('#project-creation-2').data('user-id');
  this.user_name = $('#project-creation-2').data('user-name');

}

Image.prototype = {
  setDate: function(){
    var d = new Date(this.options.updated_at);
    return d.getTime();
  },
  updated_at_pretty: function(){
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    var d = new Date(this.options.updated_at);
    return monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  },
  setPhotoType: function(){
    if(this.options.is_aerial){ return 'aerial' }
      else{ return 'normal' }
  },
  htmlThumb: function(){
    var imgWrapper = "<div class='img-wrapper " + this.photoType + "' data-user-id='" + this.user_id + "' data-img-type='" + this.photoType + "' data-created='" + this.updated_at + "' data-warpable-id='" + this.options.warpableId + "' data-warpable-url='" + this.options.warpableUr + "' data-img-id='" + this.id + "' style=\"background-image:url('" + this.options.mediumPath + "')\"'></div>";
    var html = "<article id='preview-" + this.id + "' class='preview mix mix-half " + this.photoType + "'><div class='draggable'>" + imgWrapper + "</div></article>";
    var el = $(html)
    console.log(el)
    return el;
  },
  setRemoveButton: function(){
    this.removeButton = this.thumbEl.find('.'+this.options.removeButtonClassName);

    var self = this;
    self.thumbEl.find('.img-wrapper').off().on({
      mouseenter: function(){ 
          self.removeButton.removeClass('uk-hidden');
       },
      mouseleave: function(){ self.removeButton.addClass('uk-hidden'); }
    });
    self.removeButton.on('click', function(){
      UIkit.modal.confirm("Are you sure you want to delete this photo?", function(){
        self.delete();
      });
    });
  },
  setUploadedData: function(){
    this.thumbEl = this.htmlThumb();
  },
  setSavedData: function(){
    this.thumbEl = $('#preview-' + this.id);
  },
  setDrag: function(){
    $('.draggable').draggable({
      containment: '#' + this.options.dragContainerId,
      containment: 'window',
      cursor: '-webkit-grabbing',
      cursorAt: { top: 0, left: 0 },
      distance: 10,
      helper: 'clone',
      opacity: '.9',
      revert: true,
      revertDuration: 350,
      scroll: false,
      snap: true,
      snapMode: 'both',
      snapTolerance: 10,
      zIndex: 1000
    });
  },
  append: function(){
    this.thumbContainer.mixItUp('prepend', this.thumbEl, {filter: 'all'})
  },
  delete: function(){
    var self = this;
    var url = '/user_galleries/' + self.user_gallery_id + '/photos/' + self.id;
    $.ajax({
      url: url,
      cache: false,
      type: 'post',
      beforeSend: function(xhr){
        xhr.setRequestHeader("X-Http-Method-Override", "DELETE");
      },
      success: function(data){
        console.log('Success: module deleted');
        self.thumbEl.remove();
      },
      error: function(data){
        console.log("Error: module not deleted");
        console.log(data)
      }
    }); // end ajax
  },
  init: function(){
    var self = this;
    $('.preview').off().on('click', 'img', function(){
      console.log(this)
      window.mapKnitter.addImage($(this).data('warpable-url'), $(this).data('warpable-id'));
    });
  },
  initUploaded: function(){
    console.log('Initated: uploaded photo');
    this.setUploadedData();
    this.setRemoveButton();
    this.setDrag();
    this.init();
    this.append();
  },
  initSaved: function(){
    console.log('Initated: saved photo');
    this.setSavedData();
    this.setRemoveButton();
    this.setDrag();
    this.init();
  }
}
