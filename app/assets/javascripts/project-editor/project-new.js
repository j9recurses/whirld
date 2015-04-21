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
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}