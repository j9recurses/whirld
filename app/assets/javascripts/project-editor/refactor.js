$(document).ready(function(){

// initiate button bar


  var bb = new ButtonBar();
      bb.initBar();
});


// button bar needs to open, close
var ButtonBar = function(options){
  this.options = $.extend({
    barType: 'end',
    barClassName: 'button-bar',
    barLabelClassName: 'button-label',
    barToggleClassName: 'option-toggle'
  }, options);

  // attributes set with initBar()
  this.id = null;
  this.bar = null;
  this.mod = null;
  this.toggle = null;
  this.label = null;

  // utility class
  this.hide = function(el){ el.addClass('invisible'); }

  this.show = function(el){ el.removeClass('invisible'); }

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
      return barId += '-' + $('.' + this.options.barClassName).length;
    }
  },
  setBar: function(){
    console.log('set bar');
    var bar;
    if(this.options.barType == 'end'){
      bar = $('#' + this.id);
      console.log(bar)
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
    return this.bar.find('.' + this.options.barToggleClassName)
  },

  // html to render new bar
  htmlBar: function(){
    html = "<ul class='button-bar button-bar-btw'><li class='option item invisible' data-module-type='grid'><button><i class='h2-size fa fa-square'></i></button><br><span class='invisible button-label font_small'>Grid</span></li><li class='option item invisible' data-module-type='comparison'><button><i class='h2-size fa fa-sliders'></i></button><br><span class='invisible button-label font_small'>Compare</span></li><li class='item option-toggle'><button><i class='h2-size fa fa-plus'></i></button><br><span class='hidden font_small'>Add</span></li><li class='option item invisible' data-module-type='split'><button><i class='h2-size fa fa-star-half'></i></button><br><span class='invisible button-label font_small'>Split</span></li><li class='option item invisible' data-module-type='text'><button><i class='h2-size fa fa-file-text'></i></button><br><span class='invisible button-label font_small'>Text</span></li><li class='option item invisible' data-module-type='video'><button><i class='h2-size fa fa-file-video-o'></i></button><br><span class='invisible button-label font_small'>Video</span></li></ul>";
    return $(html);
  },

  // event listeners
  open:function(){
    console.log('open bar');
    $.each(this.bar.children('.option'), function(i, option){
      $(option).removeClass('invisible').addClass('option-'+i).dequeue();
      $(option).off().on({
        mouseenter: function(){
          $(this).find('.button-label').removeClass('invisible');
        },
        mouseleave: function(){
          $(this).find('.button-label').addClass('invisible');
        }
      })
    });
  },
  close: function(){
    console.log('close bar');
    $.each(this.bar.children('.option'), function(i, option){
      $(option).addClass('invisible').dequeue();
      $(option).removeClass('option-'+i.toString()).dequeue();
    });
  },
  showLabel: function(){
    console.log('show label');
    this.show(this.label);
  },
  hideLabel: function(){
    console.log('hide label');
    this.hide(this.label);
  },
  removeBar: function(){
    this.bar.remove();
  },
  initBar: function(){
    this.id = this.setId();
    this.bar = this.setBar();
    this.toggle = this.setToggle();
    this.label = this.setLabel();

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
    var self = this;
    this.bar.closest('html').off().on({
      keyup: function(e){
        if(e.which == 27){ self.close(); }
      }
    });
  },
  createBtwBar: function(mod){
    this.initBar();

    this.mod = mod;
    mod.before(this.bar);
  
  }
};

var Module = function(options){
  this.options = $.extend({

  }, options);

  // needs a bar id to know what to remove when it is removed.


}
Module.prototype = {

}