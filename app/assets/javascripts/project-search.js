    $('.map-pane').css('height', $(this).height() * .9 );
    $('.map-pane').css('display', 'block');

var geojsonFeature = [
    {
    "type": "Feature",
    "properties": 
        {"title": "Drought in Pinole",
        "cover_image": 'http://i.imgur.com/DhZ47IS.jpg'
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.3640359, 38.0086337]
        }
    }, 
        {
    "type": "Feature",
    "properties": 
        {"title": "Looking over Downtown",
        "cover_image": 'http://i.imgur.com/SGJI3ek.jpg'
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-122.2586923, 37.8677489]
        }
    }, 
    {
        "type": "Feature",
        "properties": 
            {"title": "Whirld's Aventures in Briones",
            "cover_image": 'http://i.imgur.com/XXustpW.jpg'
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-122.139664, 37.935689]
    }
    },
        {
        "type": "Feature",
        "properties": 
            {"title": "The Day the Music Died: Oakland Shoreline Park",
            "cover_image": 'http://i.imgur.com/tbaVuRy.jpg'
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-122.324215, 37.805496]
    }
    }
];


    //Set Up Map

        var map = new L.map('search-map-pane').setView([37.8, -106.1], 7);
        map.scrollWheelZoom.disable();

        //Basemap options
        var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        var ggl = new L.Google();
        var ggl2 = new L.Google('TERRAIN');
        map.addLayer(ggl);
        map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl, 'Google Terrain':ggl2}, {}));


        //Change the icon here. The designers can choose something more beautiful here
        //I just got sick of that blue thing
        var tempIcon = L.icon({
        iconUrl: '/assets/test/blue_icon.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [0, 0] // point of the icon which will correspond to marker's location

        });
            

    //Add Data to Map and Refit Bounds

        //The variable with the data is call <geojsonFeature> in the .json file
        var myLayer = L.geoJson(geojsonFeature, {
             // style: function (feature) {
             //     return feature.properties.style;
             // },
            pointToLayer: function(feature, latlng) {
                return new L.marker(latlng, {icon: tempIcon});
            },
            onEachFeature: function (feature, layer) {
                 //layer.bindPopup(feature.properties.title);
                 //temp_image = "<img src="+feature.properties.cover_image;
                layer.bindPopup("<img src="+feature.properties.cover_image+" height='100' width='130'>");
             }
         });

        myLayer.addData(geojsonFeature);
        myLayer.addTo(map);


        //Refit Bounds
        map.fitBounds(myLayer.getBounds(), {padding: [30, 30]});
