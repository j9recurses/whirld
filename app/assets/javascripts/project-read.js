$(document).ready(function(){
		
  $('#knitter-map-pane').css('height', $(this).height() * .9 );
  $('#knitter-map-pane').css('display', 'block');
  var page = $('#project-show');
  console.log(page.data('warpable-url'))
  setTimeout(function(){
    var map
    (function(){
      window.mapKnitter = new MapKnitter.Map({
        latlng:     L.latLng(page.data('map-lat'), page.data('map-lon')),
        zoom:       12,
        readOnly:   true,
        warpablesUrl:   page.data('warpable-url')
      });
     })();
  }, 1000)

}); // end document.ready