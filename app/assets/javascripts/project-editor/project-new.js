$(document).ready(function(){
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

// initiate the finish
// $('#project-finish').on({
//     click: function(){
//       var modIds = '';
//       $.each($('.module'), function(i, mod){
//         if($(mod).find('.photo').length > 0){
//           modIds += $(mod).data('mod-id') + ',';
//         }
//       });
//       console.log(modIds);
//       var map_id =  $('#project-creation-2').data('map-id');
//       console.log(map_id);
//       // DATA HERE. Probably need to change param names, but this is how you get the values
//       var data = {
//           map_id: map_id,
//           mod_order: modIds
//       }
//       console.log(data);
//       $.ajax({
//         url: '/maps/map_info_finish/'+ map_id,// URL HERE,
//         data: data,
//         cach: false,
//         type: 'put',
//         success: function(data){
//           console.log('Success: module order updated');
//         },
//         error: function(data){
//           console.log('Something went wrong.')
//         }
//       }); // end ajax
//     } // end click
//   });

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