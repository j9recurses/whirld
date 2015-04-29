$('.map-pane').css('height', $(this).height() * .9 );
$('.map-pane').css('display', 'block');

// We've gotten geoJSON search results back, and they are in the HTML with id's of projects and images.
$(document).ready(function(){
  var wm = new SearchMap({
            mappaneId: 'search-map-pane'
          });
      wm.setMap();
      wm.setTestData();
      wm.scrollHighlight();

  $('#search-input-wrapper').off().on('click', '#search-icon-wrapper', function(){
    var wrapper = $(this).closest('#search-input-wrapper');
    if(wrapper.hasClass('search-expanded')){
      wrapper.removeClass('search-expanded');
    }
    else{
      wrapper.addClass('search-expanded');
      var input = $('#search-input');
          input[0].selectionStart = input[0].selectionEnd = input.val().length;
    }
  });


});
