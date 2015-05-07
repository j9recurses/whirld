$(document).ready(function(){
  if($('#project-creation-1').length > 0){
    var form = new Form();
        form.map_new();
  }
  if($('#project-creation-2').length > 0){
    var pe = new ProjectEditor();
        pe.init();
  }

  var mapId = $('#project-creation-2').data('map-id');
  var mapLat = $('#project-creation-2').data('map-lat');
  var mapLon = $('#project-creation-2').data('map-lon');
  window.mapKnitter = new MapKnitter.Map({
    latlng:     L.latLng(mapLat, mapLon),
    readOnly:   false,
    zoom: 12,
    warpablesUrl: "/maps/" + mapId +"/warpables.json",
    logged_in: true,
    anonymous:  false,
  });

  var annotations = new MapKnitter.Annotations({
    name:   'annotation',
    map_id: mapId,
    map:   window.mapKnitter.getMap(),
    logged_in: true,
    anonymous:  false

  });


});

var ProjectEditor = function(){

}
ProjectEditor.prototype = {
	initImages: function(){
    //initiate draggable for all the saved images already loaded

	},
	uiActions: function(){
		var self = this;

		$('#preview-list').mixItUp({
			controls: {
				activeClass: 'uk-active'
			},
			load: {
				filter: 'all',
				sort: 'created:desc'
			},
			callbacks: {
				onMixEnd: function(state){
			    $.each($('.preview'), function(i, thumb){
			      var t = new Image({
			        id: $(thumb).data('img-id'),
			        is_aerial: $(thumb).data('img_type') == 'aerial',
			        is_normal: $(thumb).data('img_type') == 'normal',
			      });
			      t.initSaved();
			    });
				}
			}
		});

		$('#view-switch').on('click', function(){
			console.log(this)
			var icon = $(this).find('i');
			if(icon.hasClass('fa-th-large')){
				icon.removeClass('fa-th-large');
				icon.addClass('fa-square');
				$('.preview').removeClass('mix-half');
				$('.preview').addClass('mix-whole');
			}
			else{
				icon.removeClass('fa-square');
				icon.addClass('fa-th-large');
				$('.preview').removeClass('mix-whole');
				$('.preview').addClass('mix-half');
			}
		});


	},
  init: function(){
//       // initiate form fields
    var desc = new Form();
        desc.descriptionField();
    var title = new Form();
        title.titleField();
    var loc = new Form();
        loc.locationField();
    var lat = new Form();
        lat.latField();
    var lon = new Form();
        lon.lonField();
//     var ptf = new Form();
//         ptf.projectTagField();

//     var photosel = new Form();
//         photosel.photoSelectFields();

//     var pageFinish = new Form();
//         pageFinish.finishButton();
//     // initiate button bar
//     var bb = new ButtonBar();
//         bb.initBar();

    // initiate photo uploader
    var p = new ImageUploader();
        p.init();

    this.uiActions();

  }
}




















