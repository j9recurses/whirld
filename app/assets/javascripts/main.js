$(document).ready(function(){
  autosize($('textarea#project-description'));
  autosize($('textarea#project-title'));
  creationStickyNav();
  mainStickyNav();
  var bb = new ButtonBar({type: 'end'});
      bb.init();
  var form = new Form();
      form.init();

});


function ButtonBar(settings){
  var type = settings.type;
  function closeBar(bar){
    bar.removeClass('open');
    bar.addClass('closed');
    $.each(bar.children('.option'), function(i, option){
      $(option).removeClass('option-'+i.toString()).dequeue();
    })
  }
  function createBTW(){
    html = "<ul class='button-bar button-bar-btw closed'><li class='option item' data-module-type='grid'><button><i class='h2-size fa fa-newspaper-o'></i></button><br><span class='hidden button-label font_small'>Grid</span></li><li class='option item' data-module-type='comparison'><button><i class='h2-size fa fa-cc-visa'></i></button><br><span class='hidden button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item' data-module-type='half'><button><i class='h2-size fa fa-bar-chart'></i></button><br><span class='hidden button-label font_small'>Half</span></li><li class='option item' data-module-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='hidden button-label font_small'>Text</span></li><li class='option item' data-module-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='hidden button-label font_small'>Video</span></li></ul>";
    el = $($.parseHTML(html));
    el.attr('id', "btw-bar-" + $('.button-bar-btw').length);
    return el
  }
  function createBar(){
    var el;
    if(type == 'end'){ 
      el = $('#end-bar');
    }
    else if(type == 'btw') {
      el = createBTW();
    }
    return el;
  }
  function hide(el){ el.addClass('hidden'); }
  function show(el){ el.removeClass('hidden'); }
  function openBar(){
    var bar = $($(this).parent());
        bar.addClass('open');
        bar.removeClass('closed');
        $.each(bar.children('.option'), function(i, option){
          $(option).addClass('option-'+i.toString()).dequeue();
        })
    bar.children('.option').hover(function(){
      $(this).children('.button-label').toggleClass('hidden');
    })
    bar.closest('html').on('keyup', function(e){
      if(e.which == 27){ closeBar(bar); }
    });
  }

  // Public
  this.bar = createBar();
  this.endBar = $('#end-bar');
  this.options = this.bar.children('.option');

  this.init = function(){
    this.bar.on('click', '.option-toggle', openBar);
    this.bar.on('click', '.option', function(){
      var mod = new Module($(this));
          mod.create();
      closeBar($(this).parent());
    });
  }
}
function Module(option){
  var bar = option.parent();
  var type = option.data('module-type');
  var modid = type + "-module-" + $('.module').length;

  function comparison(){
    var html = "<section id='comp-mod-1' class='comparison-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Comparison</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='droppable dropzone h-centered row group wrapper'><p class='caps'>Drop two photos here.</p></div><div class='row group wrapper'><textarea class='tag-input' placeholder='Tag your module here.'></textarea><div></div></div></section>";
    return html;
  }
  function grid(){
    var html = "<section class='grid-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Photo Grid</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='droppable dropzone h-centered row group wrapper'><p class='caps'>Drop up to ten photos here.</p></div><div class='row group wrapper'><textarea class='tag-input' placeholder='Tag your module here.'></textarea><div></div></div></section>";
    return html;
  }
  function half(){
    var html = "<section class='half-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Half & Half</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='text-module h-centered six columns'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div><div class='droppable dropzone h-centered six columns'><p class='caps'>Drag one photo here.</p></div></div><div class='row group wrapper'><textarea class='tag-input' placeholder='Tag your module here.'></textarea><div></div></div></section>";
    return html;
  }
  function text(){
    var html = "<section class='text-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-text'></i><span class='cursor-def'>Text</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div><div class='row group wrapper'><textarea class='tag-input' placeholder='Tag your module here.'></textarea><div></div></div></section>";
    return html;
  }
  function video(){
    var html = "<section class='video-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-video-o'></i><span class='cursor-def'>Video</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea class='padding-bottom' name='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea></div><div class='row group wrapper'><textarea class='tag-input' placeholder='Tag your module here.'></textarea><div></div></div></section>";
    return html;
  }
  this.create = function(){
    var html;
    if(type == 'comparison'){ html = comparison() }
    else if(type == 'grid'){ html = grid() }
    else if(type == 'half'){ html = half() }
    else if(type == 'text'){ html = text() }
    else if(type == 'video'){ html = video() }
    var mod = $($.parseHTML(html));
        mod.attr('id', modid);

    var icon = mod.find('.fa-remove')
        icon.attr('id', modid);
        icon.on('click', function(){ 
          $('#'+modid).remove();
          $('#btw-bar-'+modid.split('-')[2]).remove();
        })

    var btw = new ButtonBar({type: 'btw'});
        btw.init();
    bar.before(mod);
    mod.before(btw.bar);

    var tagbox = new Form();
        tagbox.tagBox($('#'+modid).find('textarea'));
  }
}
function Form(){
  function createTag(e){
    var input = $(e.target);
    var s = input.val().toLowerCase();
    var tagText = s.replace(/[\.,-\/#!'$?%\^&\*;:{}=\-_`~()]/g,"");
    if(e.which == 13){
      tagText = tagText.trim();
    }
    var tagHTML = "<span class='project-tag cursor-def light font_small'>#" + tagText + "</span>";
    var tag = $($.parseHTML(tagHTML));
    var tagID = 'tag-' + tagText;
        tag.attr('id', tagID);
        tag.on('click', function(){ $(this).remove(); });
    return tag;
  }
  function appendTag(e){
    var input = $(e.target);
    var tagList = input.next();
    var tag = createTag(e)[0];
    if(e.which == 188 || e.which == 13){
      if(tagList.children('.project-tag').length == 0){
        tagList.append(tag);
        input.val('');
      }
      else {
        if($('#'+tag.id).length > 0){
          $('#'+tag.id).addClass('error');
          input.val('');
          setTimeout(function() {
             $('#'+tag.id).removeClass('error');
           }, 600); 
        }
        else{
          tagList.append(tag);
          input.val('');
        }
      }
    }
  }
  function changeCounter(e){
    var input = $(e.target);
    var letterCount = input.val().length;
    var span = input.next('span')[0];
        $(span).removeClass('hidden');
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);
    input.on('focusout', function(){
      if(letterCount == 0){ $($(this).next('span')[0]).addClass('hidden'); }
    });
  }
  this.tagBox = function(el){
    console.log(el)
    el.keyup(function(e){ appendTag(e); })
  }
  this.init = function(){
    $('#project-description').keyup(function(e){ changeCounter(e); });
    $('#project-tag-list').keyup(function(e){ appendTag(e); });
    $('#project-title').keyup(function(e){ changeCounter(e); });
  }
}

var creationStickyNav = function () {
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

var mainStickyNav = function () {
    $('#navbar-main').stickyNavbar({
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

  // Video stuff
  // var submit_button = $('#submit_pre_upload_form');
  //  var video_upload = $('#video_upload');
  //  submit_button.click(function () {
  //    $.ajax({
  //      type: 'POST',
  //      url: "/videos/videos_get_upload_token",
  //      data: $('#video_pre_upload').serialize(),
  //      dataType: 'json',
  //      success: function(response) {
  //        video_upload.find('#token').val(response.token);
  //       window.alert(response.token)
  //        video_upload.attr('action', response.url.replace(/^http:/i, window.location.protocol)).submit();
  //        submit_button.unbind('click').hide();
  //        $('.preloader').css('display', 'block');
  //      },
  //      error: function(XMLHttpRequest, textStatus, errorThrown) {
  //        alert(errorThrown);
  //      }
  //    });
  //  });