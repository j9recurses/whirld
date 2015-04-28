var Form = function(options){
  this.options = $.extend({
    modAttrId: null
  }, options);

  // what it needs to know to save with modules
  this.modEl = $('#'+ this.options.modAttrId);
  this.modId = this.modEl.data('mod-id');
  this.modType = this.modEl.data('mod-type');

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
    autosize($('#project-description'));
    var self = this;
    $('#project-description').on({
      keyup: function(e){
        self.eTarget = $(e.target);
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
          self.tagSave(null, self.tagList());
        });
    return tag;
  },
  tagList: function(){
    var taglist = []
     $.each(this.modEl.find('.project-tag'), function(i, tag){
      var tagval =  $(tag).text().split('#')[1];
      taglist.push(tagval);
    });
    var taglist_str = taglist.join(",");
    return taglist_str;
  },
  tagAppend: function(e){
    var tagContainer = this.eTarget.nextAll('.tag-container');
    var tag = this.tagHtml(e)[0];
    if(e.which == 188 || e.which == 13 || e.which == 1) {
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
  tagSave: function(map_id, taglist){
    console.log(map_id)
    var data = {
      mod_gallery: this.modId,
      mod_type: this.modType,
      taglist: taglist,
    }
    if(map_id){ data['map_id'] = map_id }

    $.ajax({
      url: '/photo_mods/create_taggings',
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: tags were created');
        console.log(data)
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
        self.tagSave(null, self.tagList());
      }
    })
  },
  projectTagList: function(){
    var project_tags = $('#project-tag_list').next().find('.project-tag');
    var taglist = []
     $.each(project_tags, function(i, tag){
      var tagval =  $(tag).text().split('#')[1];
      taglist.push(tagval);
    });
    var taglist_str = taglist.join(",");
    return taglist_str;
  },
  projectTagField: function(){
    var self = this;
    $('#project-tag_list').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.tagAppend(e);
      },
      focusout: function(){
        self.tagSave($('#project-creation-2').data('map-id'), self.projectTagList());
      }
    })
  },

  // functions for creating text fields
  textField: function(){
    autosize(this.modEl.find('.text-module-body'));
    var url = '/photo_mods/user_gallery_' + this.modType + '_update/'  + this.modId;
    var data = {
        mod_gallery: this.modId,
        mod_type: this.modType
      }

    // set params
    var modText;
    if(this.modType == 'text'){
      modText = 'bloc_text'
    }
    else if(this.modType == 'split'){
      modText == 'split_text'
    }

    // Update mod
    this.modEl.find('.text-module-body').on({
      focusout: function(e){
        self.eTarget = $(e.target);
        data[modText] = self.eTarget.val();
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
    var self = this;
    $('#project-name').on({
      keyup: function(e){
        self.eTarget = $(e.target);
        self.changeCounter(e);
        autosize($('#project-name'));
      },
      focusout: function(e){
        self.eTarget = $(e.target);
        self.save();
      }
    });
  },
  // functions for finish button
  finishButton: function(){
    var map_id = $('#project-creation-2').data('map-id');
    $('#project-finish').on({
        click: function(){
          var data = [
                { map_id: map_id }
              ];

          $.each($('.module'), function(i, mod){
            var obj = {};
            obj[$(mod).data('mod-id')] = $(mod).data('mod-type');
            data.push(obj);
          });

          $.ajax({
            url: '/maps/map_info_finish/'+ map_id,// URL HERE,
            data: JSON.stringify(data),
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

  // functions for photo manager controls
  isEmpty: function(trigger, type){
    return $('#photos-'+trigger).find('.' + type).length == 0;
  },
  setDisabled: function(type){
    $('#' + type).prop('checked', false);
    $('#' + type).prop('disabled', true);
  },
  setEnabled: function(type){
    $('#' + type).prop('disabled', false);
  },
  setAbility: function(trigger){
    var self = this;
    $.each([ 'aerial', 'normal' ], function(i, type){
      if(self.isEmpty(trigger, type)){
        self.setDisabled(type);
      }
      else{
        self.setEnabled(type);
      }
    });
  }, 
  setChecked: function(option){
    var self = this;
    if(self.isEmpty(option, 'aerial') == false){
      $('#aerial').prop('checked', true);
      self.showPhotos(option, 'aerial');
    }
    else if(self.isEmpty(option, 'normal') == false){
      $('#normal').prop('checked', true);
      self.showPhotos(option, 'normal');
    }
  },
  hidePhotos: function(trigger, type){
    $('#photos-'+trigger).find('.'+type).addClass('invisible').addClass('hidden');
  },
  showPhotos: function(trigger, type){
    $('#photos-'+trigger).find('.'+type).removeClass('hidden').removeClass('invisible');
  },
  photoSelectFields: function(){
    var self = this;
    var photoContainers = { uploaded: $('#photos-uploaded'), saved: $('#photos-saved') };

    // disable uploaded tabs
    $('#aerial').prop('disabled', true);
    $('#normal').prop('disabled', true);

    // when the drop down changes
    $('#photo-state').on({
      change: function(){
        // toggle the whole containers
        $.each(photoContainers, function(option, container){
          container.toggleClass('hidden');
          container.toggleClass('invisible');
        }); // end each
        // determine whether aerial and normal should be clicked on or not
        var option = $('#photo-state option:selected').val()
        self.setAbility(option);
        self.setChecked(option);
      } // end change
    }); 
    // toggle aerial or normal
    $('#photo-types').on({
      change: function(){
        var trigger = $('#photo-state option:selected').val();

        // show the photos of the selected
        var type = $('#photo-types input:checked').val();
        self.showPhotos(trigger, type);

        // hide the photos of the other
        var other;
        $.each($('#photo-types input'), function(i, el){
          if($(el).val() != type){
            other = $(el).val();
          }
        });
        self.hidePhotos(trigger, other);
      }
    })
  }

} // end Form Prototype
