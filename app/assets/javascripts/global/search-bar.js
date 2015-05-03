var SearchBar = function(options){
  this.options = $.extend({
    expandedClassName: 'search-expanded',
    iconWrapperId: 'search-icon-wrapper',
    keywordId: 'search-keyword',
    locationId: 'search-location',
    wrapperId: 'search-bar-wrapper',
    btwTextClassName: 'search-input-btw'
  }, options);

  this.inputEl = $('#' + this.options.inputId);
  this.keywordEl = $('#' + this.options.keywordId);
  this.locationEl = $('#' + this.options.locationId);
  this.wrapper = $('#' + this.options.wrapperId);
  this.container = 
  this.btwTextEl = $('.' + this.options.btwTextClassName);
}
SearchBar.prototype = {
  isInputsEmpty: function(){
    if(this.keywordEl.val().length == 0 && this.locationEl.val().length == 0){
      return true;
    }
    else{
      return false;
    }
  },
  getValues: function(){
    var data = [];
    $.each(this.wrapper.find('input[type=text]'), function(i, input){
      var type = $(input).attr('id').split('-')[1];
      var obj = {};
      // only return input values that exist
      if($(input).val().length > 0){
        obj[type] = $(input).val();
        data.push(obj);
      }
    });
    return data
  },
  closeBar: function(){
    var self = this;
    this.btwTextEl.addClass('invisible');    
    setTimeout(function(){
      self.wrapper.removeClass(self.options.expandedClassName);
      self.keywordEl.blur();
    }), 200;
  },
  toggleBar: function(){
    var self = this;
    self.wrapper.off().on('click', '#' + self.options.iconWrapperId, function(){
      // When bar is open
      if(self.wrapper.hasClass(self.options.expandedClassName)){
        if(self.isInputsEmpty() == true){
          self.closeBar();
        }
        else{
          // self.search(self.getValues());
          console.log('Redirecting to search page...')
        }
      }
      // When bar is closed
      else{
        self.wrapper.addClass(self.options.expandedClassName);
        // put focus in keyword box
        self.keywordEl.selectionStart = self.keywordEl.selectionEnd = self.keywordEl.val().length;
        setTimeout(function(){
          self.btwTextEl.removeClass('invisible');    
        }, 200)
      }
    });
  },
  init: function(){
    // Initiate event listeners for toggling bar open
    this.toggleBar();

    var locAC = new AutoComp({
      inputId: 'search-location'
    });
    locAC.location();
    
    var kwAC = new AutoComp({
      inputId: 'search-keyword'
    });
    kwAC.keyword();
  }
}