$(document).ready(function(){
  var sb = new SearchBar();
      sb.init();


  $('#comments-testing').on('click', function(){
    console.log('clicking the button')
    $.ajax({
      url: '',
      data: {},
      cache: false,
      type: 'post',
      success: function(data){
        console.log('Success comments posted')
        console.log(data)
      }, 
      error: function(){
        console.log('Failure: comments not posted')
      }
    });
  });


// $.ajax({
//       url: url,
//       data:  data,
//       cache: false,
//       type: 'post',
//       success: function(data) {
//         console.log('Success: module created');

//         // Set parts, data, initiate events
//         self.initMod();

//         // Set ID
//         self.setId(data.id);

//         // append module to DOM before the origin bar, before events are attached
//         self.originBar = self.setOriginBar();
//         self.modEl.insertBefore(self.originBar);

//         // create a new button bar and append it before the module element
//         self.setNewBar();
//         self.newBar.barEl.insertBefore(self.modEl);

//         // initiate drag and sort if it's a module with photos
//         if(self.isPhotoMod){
//           self.setDrop();
//           self.setSort();          
//         }

//         // initiate the form fields
//         var tf = new Form({ modAttrId: self.modEl.attr('id') })
//             tf.modTagField();

//         if(self.options.modType == 'split' || self.options.modType == 'text'){
//           txtField = new Form({ modAttrId: self.modEl.attr('id') });
//           txtField.textField();
//         }

//       },
//       error: function(){
//         console.log("Error: module not created");
//       }
//     }); // end ajax


});

var AutoComp = function(options){
  this.options = $.extend({
    appendTo: '#navbar-main',
    inputId: null,
    autofocus: false,
    delay: 400,
    minLength: 2
  }, options);

  this.inputEl = $('#' + this.options.inputId)

}

AutoComp.prototype = {
  highlightResults: function(item, term){
    return String(item.value).replace(new RegExp(term, "gi"),"<span class='search-term-highlight'>$&</span>");
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
            response($.map(data, function(item) {
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
      // ul.append("<li class='ui-autocomplete-category'>" + 'Projects' + "</li>");
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
      // ul.append("<li class='ui-autocomplete-category'>Locations</li>");
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