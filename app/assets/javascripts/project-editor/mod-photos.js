var ModPhoto = function(options){
  this.options = $.extend({
    modAttrId: 'mod',
    ui: null,
    removeButtonClassName: 'photo-remove'
  }, options);

  this.id = null;
  this.modEl = $('#'+this.options.modAttrId);
  this.modPhotoEl = null;
  this.modType = this.modEl.data('mod-type');
  this.modId = this.modEl.data('mod-id');
  this.colnum = null;
  this.ui = this.options.ui;
  this.img = null;
  this.imgId = null;
  this.imgWrapper = null;
  this.removeButton = null;
}
ModPhoto.prototype = {
  setColnum: function(){
    if(this.modType == 'split'){
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
  setData: function(){
    this.setColnum();
  },
  setParts: function(){
    this.modPhotoEl = this.htmlPhoto();
    this.setImg();
    this.imgWrapper = this.modPhotoEl.find('.img-wrapper');
    this.imgWrapper.prepend(this.img);
  },
  setRemoveButton: function(){
    this.removeButton = this.modPhotoEl.find('.'+this.options.removeButtonClassName);
  },
  initModPhoto: function(){
    console.log(this)
    var self = this;

  },
  create: function(){
    // Set parts
    this.setData();
    this.setParts();

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

        // Set ID's
        self.setId(data.id);


        console.log(self.imgWrapper)
        self.imgWrapper.on('hover', function(){
          console.log('hello')
        })

      },
      error: function(){
        console.log('something went wrong')
      }
    }); // end ajax
  },
  delete: function(){
    // ajax
  }
}