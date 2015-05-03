$(document).ready(function(){
  var sb = new SearchBar();
      sb.init();
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
          // at some point will need to differentiate between projects, users, etc.
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
        // if (item.category != category) {
        //   category = item.category;
        //   ul.append("<li class='ui-autocomplete-category'>" + category + "</li>");
        // }
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
      var exploreAll = "<li><ahref='/all'>Explore the Whole Whirld <i class='fa fa-angle-right pull-right'></i></a></li>";
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