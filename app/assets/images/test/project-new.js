$(document).ready(function() {
	// no matter what, 
	// initiate the sticky navs
	// initiate form fields

	// if we're on the second step of creation (#map_info)
	if($('#project-creation-2').length > 0){
		// initiate the button bar
		var bar = new ButtonBar({ type: 'end' });
		// initiate the tab manager
		// initiate the photo upload
    var annotations = new MapKnitter.Annotations({
      name:   'annotation',
      map_id: $('#project-creation-2').data('map-id'),
      map:   window.mapKnitter.getMap()
    });

    console.log('hello')
    console.log(annotations)
	}

});

function Module(settings){
	// ID the parts that will need to be used
	var originBar = settings.option.parent();
	var type = settings.option.attr('id');
	var user_gallery_id = $('#project-creation-2').data('user-gallery-id');

	//utility functions

	// functions for creating modules
  // Functions for module html and events
  function htmlHeader(icon, type){
    var html = "<div class='row group wrapper'><div class='six columns'><i class='fa fa-" + icon + "'></i><span class='cursor-def'> " + type + "</span></div><div class='six columns h-righted'><i class='fa fa-remove a'></i><i class='fa fa-save'></i></div></div>";
    return html
  }
  function htmlDropzone(){
    var message;
    if(type == 'comparison'){
      message = 'Drag two photos here to compare them.';
    }
    else if(type == 'grid'){
      message = 'Drag up to ten photos here.';
    }
    else if(type == 'split'){
      message = 'Drag one photo here.';
      return "<p class='caps'>" + message +"</p>";
    }
    var html = "<div class='droppable dropzone row group wrapper'><p class='caps'>" + message +"</p></div>";
    return html;
  }
  function htmlTaginput(){
    var html = "<div class='row group wrapper'><textarea class='tag-input padding-top' placeholder='#tags'></textarea><div class='tag-container'></div></div>";
    return html
  }
  function htmlComparison(){
    var html = "<article class='comparison-module module padding-bottom padding-top'>" + htmlHeader('sliders', 'Comparison') + htmlDropzone() + htmlTaginput(); + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlGrid(){
    var html = "<article class='grid-module module padding-bottom padding-top'>" + htmlHeader('square', 'Photo Grid') + htmlDropzone() + htmlTaginput() +"</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlSplit(){
    var text = "<div class='text-module h-centered six columns'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>";
    var photo = "<div class='droppable dropzone six columns'>" + htmlDropzone() + "</div>";
    var html = "<article class='split-module module padding-bottom padding-top'>" + htmlHeader('star-half', 'Photo with Text') + "<div class='row group wrapper'>" + photo + text + "</div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlText(){
    var html = "<article class='text-module module padding-bottom padding-top'>" + htmlHeader('file-text', 'Text') + "<div class='row group wrapper'><textarea class='text-module-body' placeholder='Add some text' class='twelve columns'></textarea></div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlVideo(){
    var html = "<article class='video-module module padding-bottom padding-top'>" + htmlHeader('file-video', 'Video') + "<div class='row group wrapper'><textarea class='padding-bottom' class='text-module-body' placeholder='Insert video URL from Youtube or Vimeo' class='twelve columns'></textarea><textarea class='caption char-limited padding-top' placeholder='Add an optional caption.'></textarea><span class='char-limit font_small light hidden' data-limit='140'>140</span></div>" + htmlTaginput() + "</article>";
    var mod = $($.parseHTML(html));
    return mod;
  }
  function htmlMod(){
    if(type == 'comparison'){
      var mod = htmlComparison();
    }
    else if(type == 'grid'){
      var mod = htmlGrid();
    }
    else if(type == 'split'){
      var mod = htmlSplit();
    }
    else if(type == 'text'){
      var mod = htmlText();
    }
    else if(type == 'video'){
      var mod = htmlVideo();
    }
    return mod;
  }
	function appendMod(mod){
		originBar.before(mod);
	}
	function createMod(){
		var mod = htmlMod();
		var url = '/photo_mods/user_gallery_' + type + '_create/'+user_gallery_id;
		var data =  {user_gallery_id: user_gallery_id};
		$.ajax({
			url: url,
			data: data,
			cache: false,
			type: 'post',
			success: function(data){
				console.log('successful');
				// Put data in DOM
        mod.attr('id', 'module-' + type + '-' + data.id);
        mod.data('mod-type', type);
        mod.data('mod-id', data.id);

        // Append module before the button bar it came from
        originBar.before(mod);

        // Give module its own button bar
        new ButtonBar({type: 'btw', mod: mod});

			},
			error: function(){
				console.log('something went wrong')
			}
		});
		return mod;
	}

	function updateModule(){
		console.log('update tags');
		console.log('update photos');
		return mod;
	}
	createMod();
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}