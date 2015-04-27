var ModPhoto = function(options){
  this.options = $.extend({
    modAttrId: null,
    dropzone: null,
    modType: 'grid',
    ui: null,
    removeButtonClassName: 'photo-remove'
  }, options);

  this.id = null;
  this.modEl = $('#' + this.options.modAttrId);
  this.modPhotoEl = null;
  this.colnum = null;
  this.ui = this.options.ui;
  this.img = null;
  this.imgId = null;
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
    this.setImg();
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
    // Set parts

    var self = this;
    var url = '/photo_mods/place_mod_photo';
    var data = {
            mod_gallery: parseInt(self.modId),
            mod_type: self.modType,
            photo_id: self.imgId,
            caption: ''
          };
    $.ajax({
      url: url,
      data: data,
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success: photo is associated')

        // Set parts, data, initiate events
        self.initModPhoto();

        // Set ID
        self.setId(data.id);

        // Append module photo to dropzone
        self.options.dropzone.append(self.modPhotoEl)

      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  },
  remove: function(){
    var mod = new Module({
      id: this.options.modAttrId.split('-')[2],
      modType: this.options.modAttrId.split('-')[1]
    });
    mod.resetDropzone();
    this.modPhotoEl.remove();
  },
  delete: function(){
    // ajax
    console.log('Sucess: deleting photos');
  }
}