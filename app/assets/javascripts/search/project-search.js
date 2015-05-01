// $('.map-pane').css('height', $(this).height() * .9 );
// $('.map-pane').css('display', 'block');

// We've gotten geoJSON search results back, and they are in the HTML with id's of projects and images.
$(document).ready(function(){
  // var wm = new SearchMap({
  //           mappaneId: 'search-map-pane'
  //         });
  //     wm.setMap();
      // wm.setTestData();
      // wm.scrollHighlight();
  var fb = new FilterBar();
  		fb.init();
});

var FilterBar = function(options){
	this.options = $.extend({

	}, options);
}

FilterBar.prototype = {
	// functions for getting values from dom
	getAllValues: function(){
		var data = [];
		$.each($('.filter'), function(i, el){
			var obj = {};
			var type = $(el).attr('id').split('-')[1];

			// grab data according to input type
			if(type == 'query' || type == 'location'){
				var val = $(el).val();
			}
			else{
				var val = $(el).text();
			}

			// check if value is empty 
			if(val == ''){ return }
			else{ obj[type] = val; }

			data.push(obj);
		});
		return data;
	},
	// functions for posting queries to server
	search: function(data){
		console.log(data)
		$.ajax({
			url: '',
			data: data,
			type: 'post',
			success: function(data){
				console.log('Success: user results are returning');
			},
			error: function(){
				console.log('Oops something went wrong.')
			}
		});
	},

	// functions for posting to DOM
	htmlProjectResult: function(){

	},
	appendResult: function(){

	},
	// interactions and triggers for ajax query posts
	query: function(){
		console.log('Initiated: query box')
		var url = '';
		// hopefully we'll be able to get the Autocomplete object working. It posts in the select listener.
	},
	entity: function(){
		console.log('Initiated: entity box')

		var self = this;

		$('#filter-entity-wrapper').off().on({
			click: function(){
				$(this).toggleClass('filter-expanded');
			}
		});

		$('#filter-entity-options').on('click', 'li', function(){
			var oldVal = $('#filter-entity').text();
			var newVal = $(this).text();
			$('#filter-entity').text(newVal);
			$(this).text(oldVal)
		});
	},
	location: function(){
		console.log('Initiated: location box')
		var url = '';
		// hopefully we'll be able to get the Autocomplete object working. It posts in the select listener.
	},
	tags: function(){
		console.log('Initiated: tags box')
		var url = '';
		// hopefully we'll be able to get the Autocomplete object working. It posts in the select listener.
	},
	sort: function(){
		console.log('Initiated: sort')

		var self = this;

		$('#sort-wrapper').off().on({
			click: function(){
				$(this).toggleClass('filter-expanded');
			}
		});

		$('#sort-options').on('click', 'li', function(){
			console.log(this)
			var oldVal = $('#filter-sort').text();
			var newVal = $(this).text();
			$('#filter-sort').text(newVal);
			$(this).text(oldVal)
		});
	},
	init: function(){
		this.entity();
		this.query();
		this.location();
		this.tags();
		this.sort();
		var self = this;

		$('#search-go').on({
			click: function(){
				console.log("Searching...")	
				self.search(self.getAllValues());
			}
		});
	} // end init
}