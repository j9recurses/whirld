$(document).ready(function(){
  if($('#project-creation-1').length > 0){

  }
  if($('#project-creation-2').length > 0){
    var pe = new ProjectEditor();
        pe.init();
  }

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
          modId: self.id,
          modType: self.options.modType,
          modAttrId: self.modEl.attr('id'),
          dropzone: self.dropzone,
          modType: self.options.modType,
          ui: ui
        });
        photo.create();
        // console.log(photo)
        // self.dropzone.append(photo.modPhotoEl);
      }
    }



});

var ProjectEditor = function(){

}
ProjectEditor.prototype = {
  init: function(){
      // initiate form fields
    var desc = new Form();
        desc.descriptionField();
    var title = new Form();
        desc.titleField();
    var loc = new Form();
        loc.locationField(); 
    var lat = new Form();
        lat.latField(); 
    var lon = new Form();
        lon.lonField();    
    var ptf = new Form();
        ptf.projectTagField();

    var photosel = new Form();
        photosel.photoSelectFields();

    var pageFinish = new Form();
        pageFinish.finishButton();
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
  }
}