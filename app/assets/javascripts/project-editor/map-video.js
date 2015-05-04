var MapVideo = function(options){
	this.options = $.extend({

	}, options);
}

MapVideo.prototype = {

	init: function(){
		console.log('Initated map video');
      // Leaflet Draw. Set up draw bar and create drawnItems, and bind link to them on creation
      drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawControl = new L.Control.Draw({
      //Can get rid of the markers that we don't want
            draw: {
        rectangle: false,
        polygon: false,
        marker: false,
        circle: false
                  }
        //Could have options to edit/delete the lines in here. But just took it out
      });
      map.addControl(drawControl);
			console.log(map)
      console.log(drawControl)
	}
}