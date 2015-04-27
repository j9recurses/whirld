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

var Form = function(options){
  this.options = $.extend({
    modAttrId: null
  }, options);

  // what it needs to know to save with modules
  this.modEl = $('#'+ this.options.modAttrId);
  this.modId = this.modEl.data('mod-id');
  this.modId = this.modEl.data('mod-type');

  // what it needs to know for itself
  this.mapId = $('#project-creation-2').data('data-map-id');
  this.eTarget = null;
  this.projectId = $('#project-id').val();
  this.url = '/maps/update_remote/' + this.projectId;
}

Form.prototype = {
  ajax: function(el){
    var self = this;
    var key = el.attr('id').split('-')[1];
    var data = {};
        data[key] = el.val();
    $.ajax({
      url: this.url,
      data:  data,
      cache: false,
      type: 'post',
      success: function(data) {
         console.log("Success: " + el.attr('id').split('-')[1] + ' field was created');
      },
      error: function() {
        console.log("Something went wrong!");
      }
    }); // end ajax
  },
  save: function(){
    var self = this;
    $.ajax({
      url: this.url,
      data:  this.setData(),
      cache: false,
      type: 'post',
      success: function(data) {
         console.log("Success: " + self.eTarget.attr('id').split('-')[1] + ' field was created');
      },
      error: function() {
        console.log("Something went wrong!");
      }
    }); // end ajax
  },
  changeCounter:function(){
    var letterCount = this.eTarget.val().length;
    var span = this.eTarget.nextAll('span.char-limit');
        $(span).removeClass('invisible');
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);
    this.eTarget.on('focusout', function() {
      if(letterCount == 0) { $($(this).nextAll('span.char-limit')).addClass('invisible'); }
    });
  },
  setData: function(){
    var key = this.eTarget.attr('id').split('-')[1];
    var data = {};
    data[key] = this.eTarget.val();
    return data;
  },
  // functions for creating the description field
  descriptionField: function(){
    var self = this;
    $('#project-description').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        autosize(self.eTarget)
        self.changeCounter(e);
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
      }
    });
  },

  // functions for creating location fields

  locationField: function(){
    if($('#project-creation-1').length > 1){
      $('#project-lat').val('');
      $('#project-lon').val('');
    }
    var self = this;
    $('#project-location').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
        self.ajax($('#project-lat'));
        self.ajax($('#project-lon'));
      }
    });
  },
  latField: function(){
    var self = this;
    $('#project-lat').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
      }
    });
  },
  lonField: function(){
    var self = this;
    $('#project-lon').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
      }
    });
  },
  
  // functions for creating tag fields
  tagText: function(){
    var s = this.eTarget.val().toLowerCase();
    var t = s.replace(/[\.,-\/#!'$\n?%\^&\*;:{}=\-_`~()]/g,"");
        t = t.trim();
    return t;
  },
  tagHtml: function(){
    var self = this;
    var t = this.tagText();
    var tagHTML = "<span class='project-tag cursor-def light font_small'>#" + t + "</span>";
    var tag = $(tagHTML);
    var tagID = 'tag-' + t;
        tag.attr('id', tagID);
        tag.on('click', function() { 
          $(this).remove(); 
          self.tagSave();
        });
    return tag;
  },
  tagList: function(){
    var taglist = []
     $.each(this.modEl.find('.project-tag'), function(i, tag){
      var tagval =  $(tag).text()
      taglist.push(tagval);
    });
    var taglist_str = taglist.join(",")
    console.log(taglist.length)
    return taglist_str;
  },
  tagAppend: function(e){
    var tagContainer = this.eTarget.nextAll('.tag-container');
    var tag = this.tagHtml(e)[0];
    if(e.which == 188 || e.which == 13) {
      if(tagContainer.children('.project-tag').length == 0) {
        tagContainer.append(tag);
        this.eTarget.val('');
      }
      else {
        var tagCheck = tagContainer.find('#'+tag.id);
        if(tagCheck.length > 0) {
          tagCheck.addClass('error');
          this.eTarget.val('');
          setTimeout(function() {
             tagCheck.removeClass('error');
           }, 600);
        }
        else{
          tagContainer.append(tag);
          this.eTarget.val('');
        }
      }
    }
  },
  tagSave: function(){
    var data = {
      mod_gallery: this.modId,
      mod_type: this.modType,
      taglist: this.tagList()
    }
    $.ajax({
      url: '/photo_mods/create_taggings',
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: tags were created');
      },
      error: function(){
        console.log('Error: tags were not created');
      }
    }); // end ajax
  },
  modTagField: function(){
    var self = this;
    this.modEl.find('.tag-input').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.tagAppend(e);
      },
      focusout: function(){
        self.tagSave();
      }
    })
  },
  tagField: function(){

  },
  titleField: function(){
    var self = this;
    $('#project-name').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        autosize(self.eTarget)
        self.changeCounter(e);
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
      }
    });
  }
}