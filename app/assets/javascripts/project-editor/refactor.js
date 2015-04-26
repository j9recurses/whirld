$(document).ready(function(){
  // initiate button bar
  var bb = new ButtonBar();
      bb.initBar();

  // initiate photo uploader
  var p = new ImageUploader();
      p.init();

  //initiate draggable for all the saved images already loaded
  $.each($('.preview').find('img'), function(i, thumb){
    var t = new Image({
      id: $(thumb).data('img-id'),
      is_aerial: $(thumb).data('img_type') == 'aerial',
      is_normal: $(thumb).data('img_type') == 'normal',
    });
    t.initSaved();
  });

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
    stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
    unstickyModeClass: "unsticky",   // Class that will be applied to 'this' in non-sticky mode
    zIndex: 10
  });
  $('#navbar-photo-manager').stickyNavbar({
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
    zIndex: 10
  });
});


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
    thumbContainerId: 'photos-uploaded'
  }, options);
  
  this.id = this.options.id;
  this.thumbEl = null;
  this.photoType = this.setPhotoType();
  this.thumbContainer = $('#'+this.options.thumbContainerId);
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
  
}

Image.prototype = {
  setPhotoType: function(){
    if(this.options.is_aerial){ return 'aerial' }
      else{ return 'normal' }
  },
  htmlThumb: function(){
    var html = "<article class='preview h-centered pull-left '" + this.photoType + " id='#preview-" + this.id +"'><div class='img-wrapper v-centered'><img src='" + this.options.mediumPath +"' class='draggable invisible " + this.photoType + "' data-img-id='" + this.id +"'</div></article>";
    return $(html);
  },
  setUploadedData: function(){
    this.thumbEl = this.htmlThumb();
  },
  setSavedData: function(){
    this.thumbEl = $('#preview-') + this.id;
  },
  setDrag: function(){
    this.thumbEl.draggable({
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
      zIndex: 100
    });
  },
  append: function(){
    this.thumbContainer.append(this.thumbEl);
    this.thumbEl.removeClass('invisible');
  },
  create: function(){
    // ajax
  },
  delete: function(){
    // ajax
  },
  initUploaded: function(){
    console.log('Initated: uploaded photo');
    this.setUploadedData();
    this.setDrag();
    this.append();
  },
  initSaved: function(){
    console.log('Initated: saved photo');
    this.setSavedData();
  }
}