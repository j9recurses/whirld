var stickyNav = function () {
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
    zindex: 9999,                   // The zindex value to apply to the element: default 9999, other option is "auto"
    stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
    unstickyModeClass: "unsticky"   // Class that will be applied to 'this' in non-sticky mode
  });
}
var removeModule = function(moduleID){
  $('#'+moduleID).remove()
}
var createModule = function(moduleType){
  if(moduleType == 'text'){
    var html = "<section class='text-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-text'></i><span class='cursor-def'>Text</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div></section>"
  }
  else if(moduleType == 'video'){
    var html = "<section class='video-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-video-o'></i><span class='cursor-def'>Video</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea class='padding-bottom' name='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea></div></section>"
  }
  else if(moduleType == 'photo'){
    var html = "<section class='photo-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-photo-o'></i><span class='cursor-def'>Photo</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='droppable dropzone h-centered'><p class='caps'>Drag photo here.</p></div></div></section>"
  }
  else if(moduleType == 'half'){
    var html = "<section class='half-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Half & Half</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='text-module h-centered six columns'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div><div class='droppable dropzone h-centered six columns'><p class='caps'>Drag photo here.</p></div></div></section>"
  }
  else if(moduleType == 'comparison'){
    var html = "<section class='comparison-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Pete's Comparison bar</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='droppable dropzone h-centered six columns'><p class='caps'>Choose two photos to compare.</p></div></div></section>"
  }
  else if(moduleType == 'grid'){
    var html = "<section class='grid-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Photo Grid</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='droppable dropzone h-centered six columns'><p class='caps'>Drag up to ten images here.</p></div></div></section>"
  }
  var module = $($.parseHTML(html));
  var moduleID = moduleType+"-module-"+$('.module').length;
      module.attr('id', moduleID);
  var icon = $(module.find('i.fa-remove'));
      icon.data('module', moduleID);
      module.on('click', '.fa-remove', function(){
        var modID = $(this).data('module');
        removeModule(modID);
      })
  return module;
}

var openButtonBar = function(buttonBar){
  buttonBar.addClass('open')
  $.each(buttonBar.children('.option'), function(i, option){
      $(option).removeClass("hidden").delay(0).queue(function(){
          $(option).addClass('option-'+i.toString()).dequeue();
      });
  })
}
var closeButtonBar = function(buttonBar){
  $.each(buttonBar.children('.option'), function(i, option){
    $(option).removeClass('option-'+i.toString()).delay(100).queue(function(){
        $(option).addClass('hidden').dequeue();
        buttonBar.removeClass('open').dequeue();
    });
  })
}
var toggleButtonBar = function(toggleButton){
  if(toggleButton.hasClass('open')){
    closeButtonBar(toggleButton);
  }
  else{
    openButtonBar(toggleButton);
  }
}
var fadeButtonBarLabel = function(){
  $('.option').hover(function(){
    var label = $(this).children('.button-label');
    label.toggleClass('invisible');
  })
}


$(document).ready(function(){
  autosize($('textarea'));
  stickyNav();

  // Button Bar
  $('.button-bar').on('click', '.option-toggle', function(){ var buttonBar = $(this).parent(); toggleButtonBar(buttonBar); });
  $('.button-bar').on('click', '.option', function(){
    var buttonBar = $(this).parent();
    toggleButtonBar(buttonBar);
  });
  $('.option').on('click', function(){
    var moduleType = $(this).data('module-type');
    var module = createModule(moduleType);

    var buttonBar = $($(this).parent()); 
        buttonBar.before(module);
  })
  fadeButtonBarLabel();

  // Project tags
  $('#project-tags').keyup(function(e){
    var input = $(this);
    var inputContainer = input.parent();
    if(e.which == 188 || e.which == 13){
      var tagText = input.val().toLowerCase().split(',')[0];
      var tagHTML = "<li class='tag item'><a href='/'>" + tagText + "</a><i class='fa fa-remove'></i></li>";
      var tag = $($.parseHTML(tagHTML));
      inputContainer.after(tag);
      input.val('');

      var icon = $(tag.find('i.fa-remove'));
          icon.on('click', function(){
            $(this).parent().remove()
          })
    }
  })

  // Photo manager

  $('#photo-state').on('click', '.tab', function(){
    var targetID = $(this).attr('id').split('-')[1];
    var target = $('#'+targetID);
    var link = $('#tab-'+targetID);

    var otherTargetID = '';

    if(targetID == 'uploaded'){
      otherTargetID = 'saved';
    }
    else if(targetID == 'saved'){
      otherTargetID = 'uploaded';
    }
    var otherTarget = $('#' + otherTargetID);
    var otherLink = $('#tab-'+otherTargetID);

    console.log(link)


    if(target.hasClass('hidden')){
      target.removeClass('hidden');
      otherTarget.addClass('hidden');

      link.addClass('active');
      otherLink.removeClass('active');
    }

  })

})















