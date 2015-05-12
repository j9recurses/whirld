$(document).ready(function(){
  if($('#project-creation-1').length > 0){
    var form = new Form();
        form.map_new();
  }
  if($('#project-creation-2').length > 0){
    var pe = new ProjectEditor();
        pe.init();
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
  }

  // var annotations = new MapKnitter.Annotations({
  //   name:   'annotation',
  //   map_id: mapId,
  //   map:   window.mapKnitter.getMap(),
  //   logged_in: true,
  //   anonymous:  false

  // });
  
  $('#knitter-map-pane').droppable({
    accept: '.draggable',
    activeClass: 'drop-active',
    hoverClass: 'drop-target',
    drop: function(e, ui){
      var container = $(e.target);
      var img = ui.helper.find('.img-wrapper');

      window.mapKnitter.addImage($(img).data('warpable-url'), $(img).data('warpable-id'));

    }
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

    $('#profile-upload-drop').droppable({
      accept: '.draggable',
      activeClass: 'drop-active',
      hoverClass: 'drop-target',
      drop: function(e, ui){
        // var container = e;
        
        // var path = $(ui.helper.find('.img-wrapper')).attr('style').split('url(\'')[1].split('\')')[0];
        // // console.log(container)
        // html = "<div class='photo uk-width-1-1'><div class='photo-remove uk-hidden' data-uk-tooltip title='Remove photo from module.'><i class='fa fa-remove fa-lg uk-text-danger'></i></div><div class='img-wrapper' style=\"background-image: url('" + path + "')\"></div></div>";
        console.log(ui)
      }
    });

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
			        id: $(thumb).find('.img-wrapper').data('img-id'),
			        is_aerial: $(thumb).data('img_type') == 'aerial',
			        is_normal: $(thumb).data('img_type') == 'normal',
			      });
			      t.initSaved();
			    });
				}
			}
		});

		$('#view-switch').on('click', function(){
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

    var title = new Form();
        title.titleField();
    var loc = new Form();
        loc.locationField();
    var lat = new Form();
        lat.latField();
    var lon = new Form();
        lon.lonField();
    var desc = new Form();
        desc.descriptionField();
    var ptf = new Form();
        ptf.projectTagField();
    var pageFinish = new Form();
        pageFinish.finishButton();
//     // initiate button bar
    var bb = new ButtonBar();
        bb.initBar();

    // initiate photo uploader
    var p = new ImageUploader();
        p.init();
    var cp = new ImageUploader({
      id: 'cover-photo-upload'
    });
        cp.coverphoto();

    this.uiActions();

  }
}




















