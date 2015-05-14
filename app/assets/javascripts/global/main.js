// $('.map-pane').css('height', $(this).height() * .9 );
// $('.map-pane').css('display', 'block');

var currentUser = {
  id: 1,
  avatarUrl: "/assets/dave.jpg",
  name: "Dave"
}
var existingComments = [
  {
    // this section id is the data-section-id attribute from the split module
    "sectionId": "UserGallerySplit-14",
    "comments": [
      {
        "authorAvatarUrl": "/assets/jeff.jpg",
        "authorName": "Jeff",
        "comment": "Looks like fun. Did you get any shots of the old military installations there?"
      },
      {
        "authorAvatarUrl": "/assets/pat.jpg",
        "authorName": "Pat",
        "comment": "I saw them. The goats are grazing on top of them."
      }
    ]
  }
];
$(document).ready(function(){

  var tb = new SearchBar();
      tb.initTopBar();

  var SideComments = require('side-comments');
      sideComments = new SideComments('#module-container', currentUser, existingComments);


$('.wh-js-whirl').on({
  click: function(){
    var icon = $($(this).find('.icon-whirl'));
    var count = $(this).next('.wh-side-count');
    if(icon.hasClass('icon-whirl-off')){
      icon.removeClass('icon-whirl-off');
      icon.addClass('icon-whirl-on');
      $(this).toggleClass('whirled');
      var newCount = parseInt(count.text()) + 1;
      count.text(newCount)
    }
    else if(icon.hasClass('icon-whirl-on')){
      icon.removeClass('icon-whirl-on');
      icon.addClass('icon-whirl-off');
      $(this).toggleClass('whirled');
      var newCount = parseInt(count.text()) - 1;
      count.text(newCount)
    }
  }
});

$('#grid-1').find('.post').on('click', function(e){
  e.preventDefault();
  var val = $($(this).parent().siblings('input')).val();
  var list = $($(this).parent().parent().siblings('.comments'));
  var comment = "<li data-comment-id=''><div class='author-avatar'><img src='/assets/dave.jpg'></div><p class='author-name right-of-avatar'>Dave</p><p class='comment right-of-avatar'>" + val + "</p><a href='#' class='action-link delete'>Delete</a></li>";
  list.append($(comment))
  $(this).parent().parent().remove();

  var newButton = $("<a href='#' class='add-comment'>Leave a comment</a>");
  list.append(newButton)

})

//like whirl function.
//this function takes the following params:
//Klass_id : id of the module object
//Klass_Type: the name fo the model in uppercase
//EX: for a map with an id of 1:
//Klass_id:1, klass_type:Map
//This function returns the model object plus the updated number of whirls for that object.
//This variable can be found in json hash as: whirls: 2


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


});
