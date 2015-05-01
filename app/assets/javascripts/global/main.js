$(document).ready(function(){
  var sb = new SearchBar();
      sb.init();
  
  var locAC = new LocAutoComp({
      inputId: 'search-location'
  });
      locAC.init();
  
  // var qAC = new LocAutoComp({
  //     inputId: 'search-keyword'
  // });
  //     qAC.init();

  // var queryAC = new AutoComplete({
  //     inputId: 'search-keyword',
  //     formType: 'query'
  // });
  // queryAC.initQuery();
});

var LocAutoComp = function(options){
  this.options = $.extend({
    appendTo: '#navbar-main',
    inputId: null
  }, options);

  this.geocoder = new google.maps.Geocoder();
  this.inputEl = $('#' + this.options.inputId);
}
LocAutoComp.prototype = {
  highlightResults: function() {
    var self = this;
    $.ui.autocomplete.prototype._renderItem = function( ul, item) {
      var newText = String(item.value).replace(
                new RegExp(this.term, "gi"),
                "<span class='search-term-highlight'>$&</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<span class='cursor-def'>" + newText + "</span>")
            .appendTo(ul);
    };
  },
  locationUI: function(){
    console.log('rendering location data')
    this.highlightResults();
  },
  locationSource: function(request, response){
    var self = this;
    self.geocoder.geocode( {'address': request.term }, function(results, status) {
      response($.map(results, function(item) {
        return {
          label:  item.formatted_address,
          value: item.formatted_address,
          latitude: item.geometry.location.lat(),
          longitude: item.geometry.location.lng(),
          bounds: item.geometry.bounds
        }
      }));
    })
  },
  autoComp: function(){
    var self = this;
    this.inputEl.autocomplete({
      appendTo: this.options.appendTo,
      autofocus: false,
      delay: 400,
      minLength: 2,
      open: function(request, response){
        $(this).data("uiAutocomplete").menu.element.addClass("search-term-list");
        self.locationUI();
      },
      source: function(request, response) {
        self.locationSource(request, response);
      }, // end source
      _renderMenu: function( ul, items ) {
          var self = this;
          $.each( items, function( index, item ) {
              self._renderItem( ul, item );
          });
      }
    });
  },
  init: function(){
    this.locationUI();
    this.autoComp();
  }
}

var SearchBar = function(options){
  this.options = $.extend({
    expandedClassName: 'search-expanded',
    iconWrapperId: 'search-icon-wrapper',
    inputId: 'search-input-wrapper',
    wrapperId: 'search-bar-wrapper',
    btwTextClassName: 'search-input-btw'
  }, options);

  this.inputEl = $('#' + this.options.inputId);
  this.wrapper = $('#' + this.options.wrapperId);
  this.btwTextEl = $('.' + this.options.btwTextClassName);
}
SearchBar.prototype = {
  openBar: function(){
    var self = this;
    self.wrapper.off().on('click', '#' + self.options.iconWrapperId, function(){
      var wrapper = $(this).closest('#'+self.options.wrapperId);
      if(wrapper.hasClass(self.options.expandedClassName)){
        self.btwTextEl.addClass('invisible');    
        setTimeout(function(){
          wrapper.removeClass(self.options.expandedClassName);
          self.inputEl.find('#search-keyword').blur();
          self.inputEl.find('#search-keyword').blur();
        }), 200;

      }
      else{
        wrapper.addClass(self.options.expandedClassName);
        self.inputEl[0].selectionStart = self.inputEl[0].selectionEnd = self.inputEl.val().length;
        setTimeout(function(){
          self.btwTextEl.removeClass('invisible');    
        }, 200)
      }
      
    });
  },
  init: function(){
    // Initiate event listeners for toggling bar open
    this.openBar();
    
    // Initiate autocomplete on the search bar
    // var ac = new AutoComplete({
    //   inputId: this.inputId
    // })
    // ac.init()
  }
}













