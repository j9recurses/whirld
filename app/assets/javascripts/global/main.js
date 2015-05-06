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
    var comment_to_delete_id = 40;

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
    var comment_to_edit_id = 50;

        $.ajax({
          // at some point will need to differentiate between projects, users, etc.
          url: "/edit_comment/" + comment_to_delete_id,
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
