MapKnitter.Map = MapKnitter.Class.extend({

//draggable

  initialize: function(options) {
    this._zoom = options.zoom || 0;
    this._latlng = L.latLng(options.latlng);

    /* Initialize before map in order to add to layers; probably it can be done later too */
    var google = new L.Google("SATELLITE",{
      maxZoom: 20,
      opacity:0.5,
      minZoom: 0
    });

    this._map = L.map('knitter-map-pane', {
      zoomControl: false,
      layers: [google]
    }).setView(this._latlng, this._zoom);

    // make globally accessible map namespace for knitter.js
    map = this.map

    if (!options.readOnly) {
      saveBtn = L.easyButton('fa-check-circle fa-green mk-save',
      function() {},
        'Save status',
        this._map,
        this
      )
    }

    images = [], bounds = [];

    /* Set up basemap and drawing toolbars. */
    this.setupMap();

    /* Load warpables data via AJAX request. */
    this._warpablesUrl = options.warpablesUrl;
    this.withWarpables(function(warpables){
      $.each(warpables,function(i,warpable) {
        // only already-placed images:
        if (warpable.nodes.length > 0) {

          var corners = [ 
                new L.latLng(warpable.nodes[0].lat,
                             warpable.nodes[0].lon),
                new L.latLng(warpable.nodes[1].lat,
                             warpable.nodes[1].lon),
                new L.latLng(warpable.nodes[3].lat,
                             warpable.nodes[3].lon),
                new L.latLng(warpable.nodes[2].lat,
                             warpable.nodes[2].lon)
          ];

          var img = new L.DistortableImageOverlay(
            warpable.srcmedium,
            { 
              corners: corners,
              mode: 'lock'
          }).addTo(window.mapKnitter._map);

          bounds = bounds.concat(corners);
          window.mapKnitter._map.fitBounds(bounds);
          images.push(img);
          img.warpable_id = warpable.id

          if (!options.readOnly) {
            // img.on('select', function(e){
            // refactor to use on/fire; but it doesn't seem to work
            // without doing it like this: 
            L.DomEvent.on(img._image, 'click', window.mapKnitter.selectImage, img);
            img.on('deselect', window.mapKnitter.saveImageIfChanged, img)
            L.DomEvent.on(img._image, 'dblclick', window.mapKnitter.dblClickImage, img);
            L.DomEvent.on(img._image, 'load', function() {
              var img = this
              window.mapKnitter.setupToolbar(img)
            }, img);
          }
        }
      });

    });



    /* Deselect images if you click on the sidebar,
     * otherwise hotkeys still fire as you type. */
    $('.sidebar').click(function(){ $.each(images,function(i,img){ img.editing.disable() }) })
    /* Deselect images if you click on the map. */
    //this._map.on('click',function(){ $.each(images,function(i,img){ img.editing.disable() }) })

    // hi res:
    //img._image.src = img._image.src.split('_medium').join('')
  },

  /* add a new, unplaced, but already uploaded image to the map */
  addImage: function(url,id) {
    var img = new L.DistortableImageOverlay(url);
    images.push(img);
    img.warpable_id = id
    img.addTo(map);
    L.DomEvent.on(img._image, 'mousedown', window.mapKnitter.selectImage, img);
    img.on('deselect', window.mapKnitter.saveImageIfChanged, img)
    L.DomEvent.on(img._image, 'dblclick', window.mapKnitter.dblClickImage, img);
    L.DomEvent.on(img._image, 'load', img.editing.enable, img.editing);
    L.DomEvent.on(img._image, 'load', function() {
      var img = this
      img.on('edit', window.mapKnitter.saveImageIfChanged, img);
      L.DomEvent.on(img._image, 'mouseup', window.mapKnitter.saveImageIfChanged, img);
      L.DomEvent.on(img._image, 'touchend', window.mapKnitter.saveImageIfChanged, img);
    }, img);
  },

  selectImage: function(e){
    var img = this
    // save state, watch for changes by tracking
    // stringified corner positions:
    img._corner_state = JSON.stringify(img._corners)
    for (var i in images) {
      if (img._leaflet_id != images[i]._leaflet_id) {
        /* Deselect (disable) other images */
        images[i].editing.disable()
        /* Ensure that other toolbars are removed */
        if (images[i].editing.toolbar) {
          map.removeLayer(images[i].editing.toolbar);
        }
      }
    }
    /* Ensure this is enabled */
    img.editing.enable.bind(img.editing)()
    img.bringToFront()
    /* If it's locked, allow event to propagate on to map below */
    if (this.editing._mode != "lock") e.stopPropagation()
  },

  saveImageIfChanged: function() {
    var img = this
    // check if image state has changed at all before saving!
    if (img.editing._mode != "lock" && img._corner_state != JSON.stringify(img._corners)) {
      window.mapKnitter.saveImage.bind(img)()
    }
  },

  dblClickImage: function (e) {
    var img = this
    window.mapKnitter.selectImage.bind(img)
    img.editing._enableDragging()
    img.editing.enable()
    img.editing._toggleRotateDistort()
    e.stopPropagation()
  },

  saveImage: function() {
    //console.log('saving')
    var img = this
    // reset change state string:
    img._corner_state = JSON.stringify(img._corners)
    // send save request
    $.ajax('/images/update',{
      type: 'POST',
      data: {
        warpable_id: img.warpable_id,
        locked: (img.editing._mode == 'lock'),
        points:
          img._corners[0].lng+','+img._corners[0].lat+':'+
          img._corners[1].lng+','+img._corners[1].lat+':'+
          img._corners[3].lng+','+img._corners[3].lat+':'+
          img._corners[2].lng+','+img._corners[2].lat,
      },
      beforeSend: function(e) {
        $('.mk-save').removeClass('fa-check-circle fa-times-circle fa-green fa-red').addClass('fa-spinner fa-spin')
      },
      complete: function(e) {
        $('.mk-save').removeClass('fa-spinner fa-spin').addClass('fa-check-circle fa-green')
      },
      error: function(e) {
        $('.mk-save').removeClass('fa-spinner fa-spin').addClass('fa-times-circle fa-red')
      }
    })
  },

  // /maps/newbie/warpables/42, but we'll try /warpables/42
  // as it should also be a valid restful route
  deleteImage: function() {
    var img = this
    // this should only be possible by logged-in users
    if (confirm("Are you sure you want to delete this image? You cannot undo this.")) {
      $.ajax('/images/'+img.warpable_id,{
        dataType: "json",
        type: 'DELETE',
        beforeSend: function(e) {
          $('.mk-save').removeClass('fa-check-circle fa-times-circle fa-green fa-red').addClass('fa-spinner fa-spin')
        },
        complete: function(e) {
          $('.mk-save').removeClass('fa-spinner fa-spin').addClass('fa-check-circle fa-green')
        },
        error: function(e) {
          $('.mk-save').removeClass('fa-spinner fa-spin').addClass('fa-times-circle fa-red')
        }
      })
    } else {
      // say it failed
    }
  },

  getMap: function() {
    return this._map;
  },

  /* Fetch JSON list of warpable images */
  withWarpables: function(callback) {
    if (this._warpables) {
      if (callback) { callback(this._warpables); }
    } else {
      jQuery.getJSON(this._warpablesUrl, function(warpablesData) {
        this._warpables = warpablesData;
        if (callback) { callback(this._warpables); }
      });
    }
  },

  /* withWarpable(id, "medium", function(img) { ... }) */
  withWarpable: function(id, size, callback) {
    this.withWarpables(function(warpables) {
      var url = warpables[id][size],
        img = jQuery("<img/>").attr("src", url).attr("data-warpable-id", id);
      callback(img);
    });
  },

  setupMap: function() {
    var map = this._map;

    //L.tileLayer.provider('Esri.WorldImagery').addTo(map);
    var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/anishshah101.ipm9j6em/{z}/{x}/{y}.png', {
      maxZoom: 20,
     //minZoom: 0,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'examples.map-i86knfo3'
    })

     basemapDetails = {
      subdomains: ['','a.','b.','c.','d.'],
      minZoom: 0,
      maxZoom: 20,
      type: 'png',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
       };

      var watercolor = L.tileLayer("http://{s}tile.stamen.com/watercolor/{z}/{x}/{y}.png", basemapDetails);
      var toner = L.tileLayer("http://{s}tile.stamen.com/toner/{z}/{x}/{y}.png", basemapDetails);
      var toner_lite = L.tileLayer("http://{s}tile.stamen.com/toner-lite/{z}/{x}/{y}.png", basemapDetails);
      var toner_background = L.tileLayer("http://{s}tile.stamen.com/toner-background/{z}/{x}/{y}.png", basemapDetails);

      //Mapknitter has Google Satellite as well. Keep that one.
    var baseMaps = {
        "OpenStreetMap": mapbox,
        "Google Satellite": google,
        "Watercolor": watercolor,
        "Toner": toner,
        "Toner-Lite": toner_lite,
         "Toner-Background": toner_background
    };
    // eventually, annotations
    var overlayMaps = {
    };

    var layersControl = new L.Control.Layers(baseMaps,overlayMaps);
    this._map.addControl(layersControl);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale().addTo(map);
  }

});
