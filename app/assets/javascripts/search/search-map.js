
var SearchMap = function(options){
  this.options = $.extend({
    markerSettings: {
      markerUrl: '/assets/test/blue_icon.png',
      markerSize:     [25, 25], // size of the marker
      markerAnchor:   [0, 0] // point of the icon which will correspond to marker's location
    },
    mapPaneClassName: 'map-pane',
    mappaneId: 'search-map-pane',
    scrollDisabled: true
  }, options);

  this.geojsonFeature = [
    {
    "type": "Feature",
    "properties": 
        {
        "id": 1,
        "title": "Goats and Grass: Managing Natural Resources in California’s Parks",
        "cover_image_url": 'http://i.imgur.com/DhZ47IS.jpg',
        "tags": "drought, pinole, california, waterplease",
        "user":"kbasye",
        "created_on": "April 15, 2015",
        "location": "Pinole, CA"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.3640359, 38.0086337],
        }
    }, 
        {
    "type": "Feature",
    "properties": 
        {
        "id": 2,
        "title": "Looking over Downtown",
        "cover_image_url": 'http://i.imgur.com/SGJI3ek.jpg',
        "tags": "san francisco, the city, the bay, bay area, hills",
        "user":"j9heiser",
        "created_on": "May 1, 2014",
        "location": "San Francisco, CA"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.2586923, 37.8677489]
        }
    }, 
    {
        "type": "Feature",
        "properties": 
            {
            "id": 3,
            "title": "Whirld's Aventures in Briones",
            "cover_image_url": 'http://i.imgur.com/XXustpW.jpg',
            "tags": "briones, california, whirld, adventures, fun",
            "user":"fhutchinson",
            "created_on": "September 15, 2013",
            "location": "Briones National Park"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-122.139664, 37.935689]
    }
    },
        {
        "type": "Feature",
        "properties": 
            {
            "id": 4,
            "title": "The Day the Music Died: Oakland Shoreline Park",
            "cover_image_url": 'http://i.imgur.com/tbaVuRy.jpg',
            "tags": "drone death, opps, dji, bay, drowneddrone",
            "user":"pswigert",
            "created_on": "February 4, 2013",
            "location": "Oakland, CA"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-122.324215, 37.805496]
        }
    }
  ];
  this.markerLayer = null;
  this.currentId = null;
}

SearchMap.prototype = {
  setImages: function(){

  },
  setMap: function(){
    //Set Up Map
    var map = new L.map('search-map-pane').setView([37.8, -106.1], 7);
        map.scrollWheelZoom.disable();

    //Basemap options
    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    var ggl = new L.Google();
    var ggl2 = new L.Google('TERRAIN');
    map.addLayer(ggl);
    map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl, 'Google Terrain':ggl2}, {}));

     var defaultIcon = L.AwesomeMarkers.icon({
      icon: 'circle',
      iconColor: 'white',
      markerColor: 'cadetblue',
      prefix: 'fa'
    });

    // var tempIcon = L.icon({
    //     iconUrl: '/assets/test/blue_icon.png',
    //     iconSize:     [25, 25], // size of the icon
    //     iconAnchor:   [0, 0] // point of the icon which will correspond to marker's location
    // });

    //Add Data to Map and Refit Bounds
    //The variable with the data is call <geojsonFeature> in the .json file
    var markerLayer = L.geoJson(this.geojsonFeature, {
      pointToLayer: function(feature, latlng) {
        return new L.marker(latlng, {icon: defaultIcon});
      },
      onEachFeature: function (feature, layer) {
        // Apppend tags
        var rawTagList = feature.properties.tags.split(',');
        var tagListContainer = "<ul class='project-tag-list inline-list font_small'><li class='project-tag-icon item h3-size'><i class='fa fa-tag'></i></li>";
        var tagEl;
        $.each(rawTagList, function(i, tag){
          tagEl = "<li class='project-tag item push-down'><a href='maps/tagged/'" + tag + ">" + tag + "</a></li>";
          tagListContainer += tagEl;
        })
        tagListContainer += "</ul>"
        // Set image and header
        var img = "<img src="+feature.properties.cover_image_url+" height='200' width='260'>";
        var header = "<h1 class='h4-size'><a href='/maps/'" + feature.properties.id + ">"+feature.properties.title+"</h1>"; 
        
        // Bind content
        layer.bindPopup(img+header+tagListContainer);
       }
     });
    markerLayer.addData(this.geojsonFeature);
    markerLayer.addTo(map);

    this.markerLayer = markerLayer;

    //Refit Bounds
    map.fitBounds(markerLayer.getBounds(), {padding: [30, 30]});
  },
  setTestData: function(){
    var self = this;
    $.each(this.geojsonFeature, function(i, result){
      resultId = result.properties.id;
      resultEl = $('#search-card-' + resultId);

      // Set titles
      $(resultEl.find('h1 a')).text(result.properties.title);

      // Set meta info
      var user = $("<li class='user-meta-item item font_small bold'><a href='/'>" + result.properties.user + "</a></li>");
      var location = $("<li class='user-meta-item item font_small bold'>" + result.properties.location + "</li>");
      var date = $("<li class='user-meta-item item font_small pull-right'>" + result.properties.created_on + "</li>");

      $(resultEl.find('.map-meta')).append(user);
      $(resultEl.find('.map-meta')).append(location);
      $(resultEl.find('.map-meta')).append(date);

      // Set background images
      $(resultEl.find('.img-wrapper')).css('background-image', 'url(' + result.properties.cover_image_url + ')');

      // Apppend tags
      var rawTagList = result.properties.tags.split(',');
      var tagListContainer = $(resultEl.find('.project-tag-list'));
      var tagEl;
      $.each(rawTagList, function(i, tag){
        tagEl = $("<li class='project-tag item push-down'><a href='maps/tagged/'" + tag + ">" + tag + "</a></li>");
        tagListContainer.append(tagEl);
      })
      
    });
  },
  scrollHighlight: function(){
    var firstSearchCard = $($('.search-card')[0]);
    this.currentId = '';
    var cards = $('.search-card');

    var self = this;

    setId(firstSearchCard.data('map-id'));

    function setId(newId){
      // If the ID hasn't actually changed, don't do anything
      if (newId === this.currentId) return;
      // Otherwise, iterate through layers, setting the current
      // marker to a different color and zooming to it.
      var count = 0;
      self.markerLayer.eachLayer(function(layer) {
        // if(count % 2 == 1){
          // console.log("Layer: " + layer.feature.properties.id)
          // console.log("new: " + newId)
            if (layer.feature.properties.id === newId) {
              console.log('change')
              layer.setIcon(L.AwesomeMarkers.icon({
                icon: 'circle',
                iconColor: 'white',
                markerColor: 'blue',
                prefix: 'fa'
              }));

            } 
            else {
              console.log('nothing')
              layer.setIcon(L.AwesomeMarkers.icon({
                icon: 'circle',
                iconColor: 'white',
                markerColor: 'cadetblue',
                prefix: 'fa'
              }));
            }
        // }
        count += 1;
      });
      // And then set the new id as the current one,
      // so that we know to do nothing at the beginning
      // of this function if it hasn't changed between calls
      this.currentId = newId;
    }
 
    $(window).on({
      scroll: function(e){
        var firstSearchCardHeight = firstSearchCard.offset().top;
        newId = self.currentId;
        for (var i = cards.length - 1; i >= 0; i--) {
          var rect = cards[i].getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= firstSearchCardHeight) {
            newId = $(cards[i]).data('map-id');
          }
        };
        setId(newId);
      }
    }); // end scroll

  }
}

