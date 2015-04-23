$(document).ready(function() {
  if($('#project-creation-2').length > 0) {
    new Nav({type: 'create'});

    new PhotoUpload($('#photo-upload-input'));

    $.each($('.preview'), function(i, thumb){
      new Drag($(thumb).find('img'));
    });
    // new MapDrop({ whatever options or info you need from global space })
  }
  else{
    new Nav({type: 'main'});
  }
  new ButtonBar({type: 'end'});
  new Form();

  $('#project-finish').on({
    click: function(){
      var modIds = '';
      $.each($('.module'), function(i, mod){ 
        if($(mod).find('.photo').length > 0){
          modIds += $(mod).data('mod-id') + ',';
        } 
      });
      console.log(modIds);
      // DATA HERE. Probably need to change param names, but this is how you get the values
      var data = {
          map_id: $('#project-creation-2').data('map-id'),
          mod_order: modIds
      }
      $.ajax({
        url: 'update_remote',// URL HERE,
        data: data,
        cach: false,
        type: 'put',
        success: function(data){
          console.log('Success: module order updated');
        },
        error: function(data){
          console.log('Something went wrong.')
        }
      }); // end ajax
    } // end click
  });

});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
