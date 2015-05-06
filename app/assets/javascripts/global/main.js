$(document).ready(function(){

//like whirl function.
//this function takes the following params:
//Klass_id : id of the module object
//Klass_Type: the name fo the model in uppercase
//EX: for a map with an id of 1:
//Klass_id:1, klass_type:Map
//This function returns the model object plus the updated number of whirls for that object.
//This variable can be found in json hash as: whirls: 2
 $( '#someButton' ).click ( function () {
  var data_items = {
                     //module object
                     klass_id: 1,
                     ////module class
                     klass_type: "UserGalleryGrid"};
        $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/whirl",
          type: 'post',
          dataType: "json",
          data: data_items,
          success: function(data) {
           console.log(data)
          },
           error: function() {
              console.log("Something went wrong!");
            }
        });
    }
  );

///comments- singular non-threaded
//this function takes the following params:
//Klass_id : id of the module object
//Klass_Type: the name fo the model in uppercase
//comment_txt: the actual comment text
//EX: for a map with an id of 1:
//Klass_id:1, klass_type:Map
//
//
$('#textareaCmt').bind("enterKey",function(e){
 var comment_txt = $('textarea').val()
 console.log ( 'in here text' );

  var data_items = {
                    //module object id
                     klass_id: 1,
                     //module object class name
                     klass_type: "Map",
                     //comment text
                     comment: comment_txt
                     ///title: title --> we can also pass an extra field for title if necesary
                   };
  console.log(data_items);
    $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/comment",
          type: 'post',
          dataType: "json",
          data: data_items,
          success: function(data) {
           console.log(data);
          $('textarea').hide;
          $('#commentContainer').append('</br><b>'+data.commenter_login+' said: </b>' + data.body + '<div id="mm"> Reply to this comment</div> <textarea id="reply" data-reply=' +data.id +'></textarea></br></br>').show();
          },
           error: function() {
              console.log("Something went wrong!");
            }
        });
    });
$('textarea').keyup(function(e){
if(e.keyCode == 13)
{
  $(this).trigger("enterKey");
}
});

///threaded comments--> child reply to parent comment
$("#commentContainer").delegate("#reply", "keyup", function(e){
  if(e.keyCode == 13)
{
  console.log("it works!");
  var child_comment = $('#reply').val();
  var parent_comment_id = $('#reply').data();
  parent_comment_id = parent_comment_id["reply"]
  var data_items = {
                     //module object id
                     klass_id: 1,
                     ////module class name
                     klass_type: "Map",
                     //comment text
                     comment: child_comment,
                    //parent_comment_id
                     parent_comment_id:parent_comment_id
                   };
  console.log(data_items);
   $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/threaded_comment",
          type: 'post',
          dataType: "json",
          data: data_items,
          success: function(data) {
           console.log(data);
          },
           error: function() {
              console.log("Something went wrong!");
            }
        });
   }

});

//note: i didn't build this out; its current jerry rigged.
//The id  to delete is hardcoded
$( '#delButton' ).click ( function () {
    //id of of the comment you are trying to delete
    var comment_to_delete_id = 3;

        $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/delete_comment/" + comment_to_delete_id,
          type: 'delete',
          dataType: "json",
          //data: data_items,
          success: function(data) {
           console.log(data)
          },
           error: function() {
              console.log("Something went wrong!");
            }
        });
    }
  );

//note: i didn't build this out; its current jerry rigged.
//The id  to delete is hardcoded
$( '#updateButton' ).click ( function () {
    //id of of the comment you are trying to delete
    var comment_to_edit_id = 2;
    var comment_text = "blah blah blash"
    var data_items = { comment_id:comment_to_edit_id,
                      comment: comment_text
                     }
        $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/edit_comment/" + comment_to_edit_id,
          type: 'put',
          dataType: "json",
          //data: data_items,
          success: function(data) {
           console.log(data)
          },
           error: function() {
              console.log("Something went wrong!");
            }
        });
    }
  );



















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
