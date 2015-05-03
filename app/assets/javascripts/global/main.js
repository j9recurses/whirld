$(document).ready(function(){
  var sb = new SearchBar();
      sb.init();
  
  var locAC = new AutoComp({
      inputId: 'search-location'
  });
      locAC.location();
  
  var kwAC = new AutoComp({
    inputId: 'search-keyword'
  });
      kwAC.keyword();

});

var AutoComp = function(options){
  this.options = $.extend({
    appendTo: '#navbar-main',
    inputId: null,
    autofocus: false,
    delay: 400,
    minLength: 2
  }, options);

  this.inputEl = $('#' + this.options.inputId);
}

AutoComp.prototype = {
  highlightResults: function(item, term){
    return String(item.value).replace(new RegExp(term, "gi"),"<span class='search-term-highlight'>$&</span>");
  },
  keywordSource: function(request, response){

  },
  keyword: function(){
    var self = this;

    // create autocomplete instance
    var $ac = this.inputEl.autocomplete({
      appendTo: this.options.appendTo,
      autofocus: this.options.autofocus,
      delay: this.options.autofocus,
      minLength: this.options.minLength,
      // source: testData
      source: function(request, response){
        $.ajax({
          url: "/autocomplete",
          type: 'get',
          dataType: "json",
          data: {term: request.term},
          success: function(data) {
            console.log(data)

            response($.map(data, function(item) {
              console.log(item)
              return item;
            }));
          }
        });
      }
    });

    // // render results 
    keywordAC = $ac.data("ui-autocomplete");

    // customize menu to append categories
    keywordAC._renderMenu = function(ul, items){
      var self = this;
      var category = null;
      var exploreAll = "<li class='browse'><a href='/all'>Explore the Whole Whirld <i class='fa fa-angle-right pull-right'></i></a></li>";
      ul.append(exploreAll)
      ul.append("<li class='ui-autocomplete-category'>" + 'Projects' + "</li>");
      $.each(items, function(i, item){
        if (item.category != category) {
          category = item.category;
          ul.append("<li class='ui-autocomplete-category'>" + category + "</li>");
        }
        self._renderItemData( ul, item );
      });

    };
    // customize item to highlight text
    keywordAC._renderItem = function (ul, item) {
      var newText = self.highlightResults(item, this.term);

      //customize appearance of items here
      return $("<li></li>")
            .data("item.autocomplete", item)
            .append(newText)
            .appendTo(ul);
    };
  },
  locationSource: function(request, response){
    var self = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( {'address': request.term }, function(results, status) {
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
  location: function(){
    var self = this;
    // create autocomplete instance
    var $ac = this.inputEl.autocomplete({
      appendTo: this.options.appendTo,
      autofocus: this.options.autofocus,
      delay: this.options.autofocus,
      minLength: this.options.minLength,
      source: function(request, response){
        self.locationSource(request, response);
      }
    });
    // render results with highlighting
    locAC = $ac.data("ui-autocomplete")
    locAC._renderMenu = function(ul, items){
      var self = this;
      var category = null;
      var exploreAll = "<li><a class='browse' href='/all'>Explore the Whole Whirld <i class='fa fa-angle-right pull-right'></i></a></li>";
      ul.append(exploreAll);
      ul.append("<li class='ui-autocomplete-category'>Locations</li>");
      $.each(items, function(i, item){
        self._renderItemData( ul, item );
      });

    };
    locAC._renderItem = function (ul, item) {
      var newText = self.highlightResults(item, this.term);
      return $("<li></li>").data("item.autocomplete", item).append(newText).appendTo(ul);
    };
  }
}

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

  }
}













