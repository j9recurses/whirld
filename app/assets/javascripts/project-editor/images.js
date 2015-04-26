var ImageUploader = function(options){
  this.options = $.extend({
    id: 'photo-upload-input'
  }, options);

  this.id = this.options.id;
  this.el = $('#'+this.id);
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
}

ImageUploader.prototype = {
  init: function(){
    console.log('Initated: photo uploader')
    var self = this;
    self.el.fileupload({
      dataType: 'json',
      url: '/user_galleries/' + this.user_gallery_id + '/photos',
      progressall: function(e, data){
        $('.temp-preloader').removeClass('hidden');
        $('#photo-manager').addClass('invisible');
      },
      done: function (e, data) {
        console.log(data)
        $('.temp-preloader').addClass('hidden');
        $('#photo-manager').removeClass('invisible');

        var img = new Image({
            id: data.result.id,
            is_aerial: data.result.is_aerial,
            is_normal: data.result.is_normal,
            mediumPath: data.result.photo_file.medium.url,
            thumbPath: data.result.photo_file.thumb.url,
            path: data.result.url
        });
        img.initUploaded();
      } // end done
    }); // end fileupload 
  }
}

var Image = function(options){
  this.options = $.extend({
    dragContainerId: 'project-creation-2',
    id: 1,
    is_aerial: true,
    is_normal: false,
    thumbPath: null,
    mediumPath: null,
    path: null,
    removeButtonClassName: 'photo-remove',
    thumbContainerId: 'photos-uploaded'
  }, options);
  
  this.id = this.options.id;
  this.img = null;
  this.thumbEl = null;
  this.photoType = this.setPhotoType();
  this.removeButton = null;
  this.thumbContainer = $('#'+this.options.thumbContainerId);
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
  
}

Image.prototype = {
  setPhotoType: function(){
    if(this.options.is_aerial){ return 'aerial' }
      else{ return 'normal' }
  },
  htmlThumb: function(){
    var html = "<article class='preview h-centered pull-left '" + this.photoType + "' id='#preview-" + this.id +"'><div class='img-wrapper v-centered'><img src='" + this.options.mediumPath +"' class='draggable invisible " + this.photoType + "' data-img-id='" + this.id +"' data-img-type='" + this.photoType +"'</div></article>";
    return $(html);
  },
  setData: function(){
    this.removeButton = this.thumbEl.find('.'+this.options.removeButtonClassName);
    this.img = this.thumbEl.find('img');
  },
  setUploadedData: function(){
    this.thumbEl = this.htmlThumb();
  },
  setSavedData: function(){
    this.thumbEl = $('#preview-' + this.id);
  },
  setDrag: function(){
    this.img.draggable({
      containment: '#' + this.options.dragContainerId,
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
      zIndex: 1000
    });
  },
  append: function(){
    this.thumbContainer.append(this.thumbEl);
    this.thumbEl.find('img').removeClass('invisible');
  },
  init: function(){
    // ajax listeners
  },
  initUploaded: function(){
    console.log('Initated: uploaded photo');
    this.setUploadedData();
    this.setData();
    this.setDrag();
    this.init();
    this.append();
  },
  initSaved: function(){
    console.log('Initated: saved photo');
    this.setSavedData();
    this.setData();
    this.setDrag();
    this.init();
  }
}