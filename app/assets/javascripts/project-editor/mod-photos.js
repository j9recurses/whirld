var ModPhoto = function(options){
  this.options = $.extend({
    id: null,
    imgId: null,
    modId: null,
    modType: null,
    modAttrId: null,
    dropzone: null,
    modType: 'grid',
    ui: null,
    removeButtonClassName: 'photo-remove'
  }, options);

  // Mod Photo attributes
  this.createUrl = '/photo_mods/place_mod_photo';
  this.id = this.options.id;
  this.modPhotoEl = null;
  this.colnum = null;
  this.ui = this.options.ui;
  this.img = null;
  this.imgId = this.options.imgId;
  this.imgWrapper = null;
  this.removeButton = null;
}
ModPhoto.prototype = {
  setColnum: function(){
    if(this.options.modType == 'split'){
      this.colnum = 'twenty-four';
    }
    else{
      this.colnum = 'twelve';
    }
  },
  htmlPhoto: function(){
    html = "<div class='photo " + this.colnum + " columns'><div class='img-wrapper'><button class='photo-remove font_small h-centered hidden'><i class='fa fa-remove'></i></button></div></div>";
    return $(html);
  },
  setId: function(id){
    this.id = id;
    this.modPhotoEl.attr('id', 'mod-photo-' + this.id);
    this.modPhotoEl.data('mod-photo-id', this.id);
  },
  setImg: function(){
    var img = this.ui.draggable.clone();
        img.removeClass('draggable').removeClass('ui-draggable').removeClass('ui.draggable-handle');
    this.imgId = this.ui.draggable.data('img-id');
    img.data('img-id', this.imgId);
    this.img = img;
  },
  setRemoveButton: function(){
    this.removeButton = this.modPhotoEl.find('.'+this.options.removeButtonClassName);
  },
  setData: function(){
    this.setColnum();
  },
  setParts: function(){
    this.modPhotoEl = this.htmlPhoto();
    this.modPhotoEl.find('.img-wrapper').prepend(this.img);
    this.removeButton = this.modPhotoEl.find('.' + this.options.removeButtonClassName);
  },
  initModPhoto: function(){
    this.setData();
    this.setParts();

    var self = this;

    // initiate events
    this.modPhotoEl.find('.img-wrapper').on({
      mouseenter: function(){
        self.removeButton.removeClass('hidden');
      },
      mouseleave: function(){
        self.removeButton.addClass('hidden');
      }
    });

    this.removeButton.on({
      click: function(){
        self.delete();
        self.remove();
      }
    })
  },
  create: function(){
    // need this for image id
    this.setImg();
    
    // prepare for AJAX
    var self = this;
    var url = this.createUrl;
    var data = {
            mod_gallery: parseInt(this.options.modId),
            modtype: this.options.modType,
            photo_id: this.imgId
          };
    console.log(data)      
    $.ajax({
      url: url,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: photo is associated')
        console.log('This is the ID that should be changing: ' + data.id)
        // Set parts, data, initiate events
        self.initModPhoto();

        // Set ID
        self.setId(data.id);

        // Append module photo to dropzone
        self.options.dropzone.append(self.modPhotoEl)

        // update orders of all photos in module
        self.updateOrder();
      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  },
  delete: function(){
    var self = this;
    var data = {
        mod_gallery: this.options.modId,
        mod_type: this.options.modType,
        photo_id: this.imgId
      }
    $.ajax({
      url: '/photo_mods/remove_mod_photo/'+this.id,
      data: data,
      cache: false,
      type: 'delete',
      success: function(data){
        console.log('Success: photo is disassociated');

        // update orders of all photos in module
        self.updateOrder();
      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  },
  remove: function(){
    var mod = new Module({
        id: this.options.modId,
        modType: this.options.modType
    });
    this.modPhotoEl.remove();
    mod.resetDropzone();  
  },
  updateOrder: function(){
    var mod = new Module({
      id: this.options.modId,
      modType: this.options.modType
    })
    var ids = '';
    $.each($('#' + this.options.modAttrId).find('.photo'), function(i, modphoto){
      ids += $(modphoto).data('mod-photo-id') + ',';
    });
    console.log(ids)
    mod.update(ids)
  }
}