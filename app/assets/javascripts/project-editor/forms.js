var Form = function(options){
  this.options = $.extend({
    modAttrId: null
  }, options);

  // what it needs to know to save with modules
  this.modEl = $('#'+ this.options.modAttrId);
  this.modId = this.modEl.data('mod-id');
  this.modType = this.modEl.data('mod-type');

  // what it needs to know for itself
  this.mapId = $('#project-creation-2').data('map-id');
  this.eTarget = null;
  this.url = '/maps/update_remote/' + this.mapId;
  this.user_gallery_id = $('#project-creation-2').data('user-gallery-id');
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
  save: function(wrapper){
    var self = this;
    $.ajax({
      url: self.url,
      data:  this.setData(),
      cache: false,
      type: 'post',
      beforeSend: function(){
        console.log(wrapper)
        wrapper.find('.fa-check-circle').addClass('uk-hidden');
        wrapper.find('.fa-spinner').removeClass('uk-hidden');
      },
      complete: function(){
        wrapper.find('.fa-check-circle').removeClass('uk-hidden');
        wrapper.find('.fa-spinner').addClass('uk-hidden');
      },
      success: function(data) {
         console.log("Success: " + self.eTarget.attr('id').split('-')[1] + ' field was created');
      },
      error: function() {
        console.log("Something went wrong!");
      }
    }); // end ajax
  },
  changeCounter:function(){
    var wrapper = this.eTarget.closest('.input-wrapper');
    var span = $(wrapper).find('.char-limit');
        span.removeClass('uk-invisible');
    var letterCount = this.eTarget.val().length;
    var count = $(span).data('limit') - letterCount;
    $(span).text(count);

    this.eTarget.on('focusout', function() {
      if(letterCount == 0) { span.addClass('invisible'); }
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
    var el = $('#project-description');
    var wrapper = $('#description-label');
    if(el.val().length > 0){
      var span = wrapper.find('.char-limit');
          span.removeClass('uk-invisible');
      span.text(span.data('limit') - el.val().length)
    }
    var self = this;
    el.on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save(wrapper);
      }
    });
    autosize($('#project-description'));
  },

  // functions for creating location fields

  locationField: function(){
    if($('#project-creation-1').length > 1){
      $('#project-lat').val('');
      $('#project-lon').val('');
    }

    var locAC = new AutoComp({
      inputId: 'project-location'
    });
    locAC.location();

    var el = $('#project-location');
    var wrapper = $('#location-label');

    var self = this;
    el.on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save(wrapper);
        self.ajax($('#project-lat'));
        self.ajax($('#project-lon'));
      }
    });
  },
  latField: function(){
    var wrapper = $('#location-label');
    var self = this;
    $('#project-lat').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save(wrapper);
      }
    });
  },
  lonField: function(){
    var wrapper = $('#location-label');
    var self = this;
    $('#project-lon').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save(wrapper);
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
    var tagHTML = "<span class='project-tag uk-text-small uk-text-muted'>" + t + "</span>  ";
    var tag = $(tagHTML);
    var tagID = 'tag-' + t;
        tag.attr('id', tagID);
        tag.on('click', function() {
          $(this).remove();
          self.tagSave('map', self.tagList());
        });
    return tag;
  },
  tagList: function(){
    var taglist = []
     $.each(this.modEl.find('.project-tag'), function(i, tag){
      var tagval =  $(tag).text();
      taglist.push(tagval);
    });
    var taglist_str = taglist.join(",");
    return taglist_str;
  },
  tagAppend: function(e, map){
    var self = this;
    e.preventDefault();
    var tagContainer = this.eTarget.nextAll('.tag-container');
    var tag = this.tagHtml(e)[0];
    if(e.which == 188 || e.which == 13 || e.which == 1) {
      if(tagContainer.children('.project-tag').length == 0) {
        tagContainer.append(tag);
        if(map){self.tagSave(map, self.projectTagList());}
        else{self.tagSave(map, self.tagList());}
      }
      else {
        var tagCheck = tagContainer.find('#'+tag.id);
        if(tagCheck.length > 0) {
          tagCheck.addClass('uk-text-warning');
          this.eTarget.val('');
          setTimeout(function() {
             tagCheck.removeClass('uk-text-warning');
           }, 600);
        }
        else{
          tagContainer.append(tag);
          if(map){self.tagSave(map, self.projectTagList());}
          else{self.tagSave(map, self.tagList());}
        }
      }
    }
  },
  tagSave: function(map, taglist){
    var self = this;
    var data;
    if(map != null){ 
      data = {
        mod_gallery: $('#project-creation-2').data('map-id'),
        mod_type: 'map',
        tagList: taglist
      }
    }
    else{
      data = {
        mod_gallery: this.modId,
        mod_type: this.modType,
        taglist: taglist
      }
    }
    console.log(data)
    $.ajax({
      url: '/photo_mods/create_taggings',
      data: data,
      cache: false,
      type: 'post',
      beforeSend: function(){
        
      },
      success: function(data){
        console.log('Success: tags were created');
        console.log(self.eTarget)
        self.eTarget.val('')
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
        e.preventDefault();
        self.eTarget = $(e.target);
        self.tagAppend(e, null);
      },
      focusout: function(){
        self.tagSave(null, self.tagList());
      }
    })
  },
  projectTagList: function(){
    var project_tags = $('#project-tag_list').next().find('.project-tag');
    var taglist = []
     $.each(project_tags, function(i, tag){
      var tagval =  $(tag).text();
      taglist.push(tagval);
    });
    var taglist_str = taglist.join(",");
    return taglist_str;
  },
  projectTagField: function(){
    var self = this;
    $('#project-tag_list').on({
      keyup: function(e){
        e.preventDefault();
        self.eTarget = $(e.target);
        self.tagAppend(e, 'map');
      }
      // focusout: function(){
      //   var tagContainer = $(this).nextAll('.tag-container');
      //   if($('#project-tag_list').val().length > 0){
      //     self.eTarget = $(this);
      //     var tag = self.tagHtml();
      //     tagContainer.append(tag);
      //     self.tagSave('map', self.projectTagList());
      //   }
      // }
    })
  },
  captionField: function(){
    var self = this;
    var caption = $(this.modEl.find('.caption'));
        autosize(caption);
    var url = '/photo_mods/user_gallery_' + this.modType + '_update/'  + this.modId;
    var data = {
        mod_gallery: this.modId,
        mod_type: this.modType
      }
    // Update mod
    caption.on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        data[self.modType + '_text'] = caption.val();
        console.log(data)
        $.ajax({
          url: url,
          data: data,
          cache: false,
          type: 'put',
          success: function(data){
            console.log('Success: caption field was updated');
          },
          error: function(){
            console.log('Error: caption field was not updated');
          }
        }); // end ajax
      }
    });    
  },
  // functions for creating text fields
  splitTextField: function(){
    var url = '/photo_mods/user_gallery_' + this.modType + '_update/'  + this.modId;
    var data = {
        mod_gallery: this.modId,
        mod_type: this.modType
      }
    // Update mod
    this.modEl.find('.text-module-body').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        data['split_text'] = self.eTarget.val();
        console.log(data)
        $.ajax({
          url: url,
          data: data,
          cache: false,
          type: 'put',
          success: function(data){
            console.log('Success: text field was updated');
          },
          error: function(){
            console.log('Error: text field was not updated');
          }
        }); // end ajax
      }
    });
  },
  blockTextField: function(){
    autosize(this.modEl.find('.text-module-body'));
    var url = '/photo_mods/user_gallery_' + this.modType + '_update/'  + this.modId;
    var data = {
        mod_gallery: this.modId,
        mod_type: this.modType
      }

    // Update mod
    this.modEl.find('.text-module-body').on({
      focusout: function(e){
        self.eTarget = $(e.target);

        console.log($(this))
        data['bloc_text'] = self.eTarget.val();
        console.log(data)
        $.ajax({
          url: url,
          data: data,
          cache: false,
          type: 'put',
          success: function(data){
            console.log('Success: text field was updated');
          },
          error: function(){
            console.log('Error: text field was not updated');
          }
        }); // end ajax
      }
    });
  },
  videoField: function(){
    autosize(this.modEl.find('.text-module-body'));
    var url = '/photo_mods/user_gallery_' + this.modType + '_update/'  + this.modId;
    var data = {
        mod_gallery: this.modId,
        mod_type: this.modType
      }

    // Update mod
    this.modEl.find('.video-module-url').on({
      focusout: function(e){
        self.eTarget = $(e.target);

        console.log($(this))
        data['url'] = self.eTarget.val();
        console.log(data)
        $.ajax({
          url: url,
          data: data,
          cache: false,
          type: 'put',
          success: function(data){
            console.log('Success: text field was updated');
          },
          error: function(){
            console.log('Error: text field was not updated');
          }
        }); // end ajax
      }
    });
  },
  titleField: function(){
    var el = $('#project-name');
    var wrapper = $('#name-label');
    if(el.val().length > 0){
      var span = wrapper.find('.char-limit');
          span.removeClass('uk-invisible');
      span.text(span.data('limit') - el.val().length)
    }
    var self = this;
    el.on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
        autosize($('#project-name'));
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save(wrapper);
      }
    });
  },
  // functions for finish button
  finishButton: function(){
    var map_id = $('#project-creation-2').data('map-id');
    $('#finish').on({
        click: function(){
          var data_list = [];

          $.each($('.module'), function(i, mod){
            var obj = [$(mod).data('mod-id'), $(mod).data('mod-type')];

            // obj[$(mod).data('mod-id')] = $(mod).data('mod-type');
            data_list.push(obj);
          });

          console.log(data_list)
          
          var data =  {
            map_id:  map_id,
            mod_order: JSON.stringify(data_list)
          };
// mod_order = [ [12(modgallery_id), "grid"], [14, "split"], [14, "text"]

          console.log(data);
          $.ajax({
            url: '/maps/map_info_finish/'+ map_id,// URL HERE,
            data: data,
            cach: false,
            type: 'put',
            success: function(data){
              console.log('Success: module order updated');
            },
            error: function(data){
              console.log('Something went wrong.')
              console.log(data)
            }
          }); // end ajax
        } // end click
    });
  },
  map_new: function(){
    var self = this;
    $('#project-name').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
        autosize($('#project-name'));
      }
    });
    $('#project-description').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
        autosize($('#project-description'));
      }
    });
    var locAC = new AutoComp({
      inputId: 'project-location'
    });
    locAC.location();
  }

} // end Form Prototype
