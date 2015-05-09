// button bar needs to open, close
var ButtonBar = function(options){
  this.options = $.extend({
    barType: 'end',
    barClassName: 'button-bar-btw',
    barLabelClassName: 'button-label',
    barToggleClassName: 'option-toggle',
    modId: 'btw-bar-module-grid-1'
  }, options);

  // attributes set with initBar()
  this.id = null;
  this.barEl = null;
  this.toggle = null;
  this.label = null;
  this.modId = null

  // utility classes
  this.hide = function(el){ el.addClass('uk-hidden'); }
  this.show = function(el){ el.removeClass('uk-hidden'); }
  
  this.invisible = function(el){ el.addClass('uk-invisible'); }
  this.visible = function(el){ el.removeClass('uk-invisible'); }
};

ButtonBar.prototype = {
  // setters used in initBar()
  setId: function(){
    console.log('set ID');
    var barId = this.options.barType + '-bar';
    if(this.options.barType == 'end'){
      return barId;
    }
    else{
      return barId += '-' + this.modId;
    }
  },
  setBar: function(){
    var bar;
    if(this.options.barType == 'end'){
      bar = $('#' + this.id);
      return bar;
    }
    else{
      barEl = this.htmlBar();
      barEl.attr('id', this.id);
      return barEl;
    }
  },
  setLabel: function(){
    console.log('set label');
    return this.toggle.find('.'+ this.options.barLabelClassName);
  },
  setToggle: function(){
    console.log('toggle');
    return this.barEl.find('.' + this.options.barToggleClassName)
  },
  setData: function(){
    this.id = this.setId();
    this.barEl = this.setBar();
    this.toggle = this.setToggle();
    this.label = this.setLabel();
  },
  // html to render new bar
  htmlBar: function(){
    html = "<ul class='button-bar button-bar-btw'><li class='option item uk-invisible' data-mod-type='grid'><button class='uk-button'><i class='fa fa-th-large uk-h4'></i></button><br><span class='uk-invisible button-label uk-text-small'>Grid</span></li><li class='option item uk-invisible' data-mod-type='comparison'><button class='uk-button'><i class='fa fa-angle-right uk-h4'></i></button><br><span class='uk-invisible button-label uk-text-small'>Compare</span></li><li class='item option-toggle'><button class='uk-button'><i class='fa fa-plus uk-h4'></i></button><br><span class='uk-hidden uk-text-small'>Add</span></li><li class='option item uk-invisible' data-mod-type='split'><button class='uk-button'><i class='fa fa-star-half'></i></button><br><span class='uk-invisible button-label uk-text-small'>Split</span></li><li class='option item uk-invisible' data-mod-type='text'><button class='uk-button'><i class='fa fa-file-text'></i></button><br><span class='uk-invisible button-label uk-text-small'>Text</span></li><li class='option item uk-invisible' data-mod-type='video'><button class='uk-button'><i class='fa fa-file-video-o'></i></button><br><span class='uk-invisible button-label uk-text-small'>Video</span></li></ul>";
    return $(html);
  },

  // event listeners
  open:function(){
    console.log('open bar');
    var self = this;
    $.each(this.barEl.children('.option'), function(i, option){
      self.visible($(option));
      $(option).addClass('option-'+i).dequeue();
      $(option).off().on({
        click: function(){
          var mod = new Module({ 
                                  modType: $(option).data('mod-type'),
                                  originBarId: self.id
                                });
              mod.create();
          self.close();
        },
        mouseenter: function(){
          self.visible($(this).find('.button-label'));
        },
        mouseleave: function(){
          self.invisible($(this).find('.button-label'));
        }
      })
    });
    this.hideToggle();
  },
  close: function(){
    var self = this;
    console.log('close bar');
    $.each(self.barEl.children('.option'), function(i, option){
      self.invisible($(option));
      $(option).removeClass('option-'+i.toString()).dequeue();
    });
    self.showToggle();
  },
  showLabel: function(){
    console.log('show label');
    this.visible(this.label);
  },
  hideLabel: function(){
    console.log('hide label');
    this.invisible(this.label);
  },
  showToggle: function(){
    this.show(this.toggle);
  },
  hideToggle: function(){
    this.hide(this.toggle);
  },
  removeBar: function(){
    this.barEl.remove();
  },

  // run after instantiation
  initBar: function(){
    console.log('Initated: button bar');
    // after things are appended to the DOM, set the information
    this.setData();
    // preserve context for events
    var self = this;

    // attach events
    // hide and show labels, click to open bar
    this.toggle.off().on({
      click: function(){
        self.open();
      },
      mouseenter: function(){
        self.showLabel();
      },
      mouseleave: function(){
        self.hideLabel();
      }
    });

    // press esc to close bar
    self.barEl.closest('html').off().on({
      keyup: function(e){
        if(e.which == 27){ self.close(); }
      }
    });
  },
  createBtw: function(modId){
    this.modId = modId;
    this.initBar();
  }
};