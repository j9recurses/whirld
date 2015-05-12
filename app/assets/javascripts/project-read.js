$(document).ready(function(){
		
  $('#knitter-map-pane').css('height', $(this).height() * .9 );
  $('#knitter-map-pane').css('display', 'block');
  var page = $('#project-show');
  setTimeout(function(){
    var map
    (function(){
      window.mapKnitter = new MapKnitter.Map({
        latlng:     L.latLng(page.data('map-lat'), page.data('map-lon')),
        zoom:       page.data('map-zoom'),
        readOnly:   true,
        warpablesUrl:   page.data('warpable-url')
      });
     })();
  }, 1000)

}); // end document.ready