// button bar needs to open, close
var ButtonBar = function(options){
  this.options = $.extend({
    barType: 'end',
    barClassName: 'button-bar-btw',
    barLabelClassName: 'button-label',
    barToggleClassName: 'option-toggle'
  }, options);

  // attributes set with initBar()
  this.id = null;
  this.barEl = null;
  this.toggle = null;
  this.label = null;

  // utility classes
  this.hide = function(el){ el.addClass('hidden'); }
  this.show = function(el){ el.removeClass('hidden'); }
  
  this.invisible = function(el){ el.addClass('invisible'); }
  this.visible = function(el){ el.removeClass('invisible'); }
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
      var count = $('.' + barClassName).length;
      return barId += '-' + $('.' + this.options.barClassName).length;
    }
  },
  setBar: function(){
    var bar;
    if(this.options.barType == 'end'){
      bar = $('#' + this.id);
      return bar;
    }
    else{
      bar = this.htmlBar();
      bar.attr('id', this.id);
      return bar;
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
    html = "<ul class='button-bar button-bar-btw'><li class='option item invisible' data-mod-type='grid'><button><i class='h2-size fa fa-square'></i></button><br><span class='invisible button-label font_small'>Grid</span></li><li class='option item invisible' data-mod-type='comparison'><button><i class='h2-size fa fa-sliders'></i></button><br><span class='invisible button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item invisible' data-mod-type='split'><button><i class='h2-size fa fa-star-half'></i></button><br><span class='invisible button-label font_small'>Split</span></li><li class='option item invisible' data-mod-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='invisible button-label font_small'>Text</span></li><li class='option item invisible' data-mod-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='invisible button-label font_small'>Video</span></li></ul>";
    return $(html);
  },

  // event listeners
  open:function(){
    console.log('open bar');
    console.log(this)
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
  }
};