$(document).ready(function(){
  autosize($('textarea#project-description'));
  autosize($('textarea#project-title'));
  stickyNav();
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
  var modid = this.type + "-module-" + $('.module').length;
  var type = option.data('module-type');

  function comparison(){
    var html = "<section class='comparison-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Pete's Comparison bar</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='droppable dropzone h-centered six columns'><p class='caps'>Choose two photos to compare.</p></div></div></section>";
    return html;
  }
  function grid(){
    var html = "<section class='grid-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Photo Grid</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='droppable dropzone h-centered six columns'><p class='caps'>Drag up to ten images here.</p></div></div></section>";
    return html;
  }
  function half(){
    var html = "<section class='half-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-server'></i><span class='cursor-def'>Half & Half</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><div class='text-module h-centered six columns'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div><div class='droppable dropzone h-centered six columns'><p class='caps'>Drag photo here.</p></div></div></section>";
    return html;
  }
  function text(){
    var html = "<section class='text-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-text'></i><span class='cursor-def'>Text</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea name='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div></section>";
    return html;
  }
  function video(){
    var html = "<section class='video-module module padding-bottom padding-top'><div class='row group wrapper'><div class='six columns'><i class='fa fa-file-video-o'></i><span class='cursor-def'>Video</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i></div></div><div class='row group wrapper'><textarea class='padding-bottom' name='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea></div></section>";
    return html;
  }
  this.create = function(){
    var html;
    if(type == 'comparison'){ html = comparison() }
    else if(type == 'grid'){ html = grid() }
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
  }
}
function Form(){
  function createTag(e){
    var input = $(e.target);
    var tagText;
    if(e.which == 188){
      tagText = input.val().toLowerCase().split(',')[0];
    }
    else if(e.which == 13){
      tagText = input.val().toLowerCase().trim();
    }
    var tagHTML = "<span class='project-tag light font_small'>#" + tagText + "</span>";
    var tag = $($.parseHTML(tagHTML));
    var tagID = 'tag-' + tagText;
        tag.attr('id', tagID);
        tag.on('click', function(){ $(this).remove(); });
    return tag;
  }
  function appendTag(e){
    var input = $(e.target);
    var tagList = $('#tag-container');
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
  this.init = function(){
    $('#project-description').keyup(function(e){ changeCounter(e); });
    $('#project-tag-list').keyup(function(e){ appendTag(e); });
    $('#project-title').keyup(function(e){ changeCounter(e); });
  }
}

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

// $(document).ready(function(){
//   autosize($('textarea'));
//   stickyNav();

//   // Photo manager

//   $('#photo-state').on('click', '.tab', function(){
//     var targetID = $(this).attr('id').split('-')[1];
//     var target = $('#'+targetID);
//     var link = $('#tab-'+targetID);

//     var otherTargetID = '';

//     if(targetID == 'uploaded'){
//       otherTargetID = 'saved';
//     }
//     else if(targetID == 'saved'){
//       otherTargetID = 'uploaded';
//     }
//     var otherTarget = $('#' + otherTargetID);
//     var otherLink = $('#tab-'+otherTargetID);

//     console.log(link)


//     if(target.hasClass('hidden')){
//       target.removeClass('hidden');
//       otherTarget.addClass('hidden');

//       link.addClass('active');
//       otherLink.removeClass('active');
//     }

//   })

// })

  // var countries = new Bloodhound({
  //   datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   limit: 10,
  //   prefetch: {
  //     url: '/countries.json',
  //     // the json file contains an array of strings, but the Bloodhound
  //     // suggestion engine expects JavaScript objects so this converts all of
  //     // those strings
  //     filter: function(list) {
  //       return $.map(list, function(country) { return { name: country }; });
  //     }
  //   }
  // });
   
  // // kicks off the loading/processing of `local` and `prefetch`
  // countries.initialize();
 
  // // passing in `null` for the `options` arguments will result in the default
  // // options being used
  // $('#prefetch .typeahead').typeahead(null, {
  //   name: 'countries',
  //   displayKey: 'name',
  //   source: countries.ttAdapter()
  // }); // end typeahead