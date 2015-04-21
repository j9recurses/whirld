function Nav(settings) {
  var type = settings.type;

  function initStickyNav(el, z) {
    el.stickyNavbar({
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
      zIndex: z
    });
  }
  function driver() {
    if(type == 'create') {
      initStickyNav($('#navbar-create'), 9);
      initStickyNav($('#navbar-photo-manager'), 8);
    }
    else if(type == 'main') {
      initStickyNav($('#navbar-main'), 9);
    }
  }
  driver();
}