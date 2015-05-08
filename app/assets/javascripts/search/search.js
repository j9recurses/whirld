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

	this.resultsCount = $('#search-results-count');
	this.searchResultsContainer = $('#search-results-list');
}

FilterBar.prototype = {
	// functions for form interactions
	locationAC: function(){
		// only works for projects right now
    var locAC = new AutoComp({
      inputId: 'search-page-location',
      mapknitter: false
    });
    locAC.location();
	},
	keywordAC: function(){
		// only works for projects right now
		console.log('initiated keywordAC')
    var kwAC = new AutoComp({
      inputId: 'search-page-keyword'
    });
    kwAC.keyword();
	},
	// functions for getting values from dom
	getAllValues: function(){
		var data = {
			query: $('#search-page-keyword').val(),
			location: $('#search-page-location').val(),
			entity: $('#search-page-entity').find('.selected').text()
		}
		console.log(data)
		return data;
	},
	// functions for posting to DOM
	htmlCreatedAt: function(item){
		var a = new Date(item.created_at)
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var d = new Date(item.created_at)
		var date = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
		return date;
	},
	htmlProjectResult: function(item){
		var tagList = "";
		$.each(item.taglist, function(i, tag){
			var tagText = "<li class='project-tag item push-down gray'>" + tag + ", </li>"
			tagList += tagText;
		});
		var commentCount = 100; 
		var voteCount = 4000;
		// return "<article class='search-card mix' data-map-id='" +  + "' data-updated='2' data-relevant='1'>";
	},
	appendProjectResults: function(data){
		var self = this;
		var count = 0;
		$.each(data, function(i, result){
			var html = self.htmlProjectResult(result);
			self.searchResultsContainer.append($(html))
		});
		if(data.length %3 != 0){ self.searchResultsContainer.append($("<div class='gap'></div>")); }
	},
	// functions for posting queries to server
	search: function(data){
		var self = this;
				self.searchResultsContainer.empty();
		$.ajax({
			url: '/search',
			data: data,
			type: 'get',
			success: function(data){
				console.log(data)
				console.log('Success: user results are returning');
				self.resultsCount.text(data.length);
				self.appendProjectResults(data);
				self.searchResultsContainer.mixItUp({
					load: {
						sort: 'relevant:asc'
					}
				});
			},
			error: function(){
				console.log('Oops something went wrong.')
			}
		});
	},
	entity: function(){
		console.log('Initiated: entity box')

		var self = this;

	},
	sort: function(byOrder){
		console.log('Initiated: sort')
		console.log(byOrder)

		var self = this;

		self.searchResultsContainer.find('.search-card').sort(function (a, b) {
			console.log(a.dataset.createdAt)

		})
		.appendTo( self.searchResultsContainer );

	},
	init: function(){
		this.entity();
		this.keywordAC();
		this.locationAC();
		// this.sort();
		var self = this;

		$('#search-page-location').on({
			keyup:function(e){
				if(e.which == 13){
					self.search(self.getAllValues());
					$('#search-page-location').autocomplete( "close" );
				}
			}
		});

		$('#search-page-query').on({
			keyup:function(e){
				if(e.which == 13){
					self.search(self.getAllValues());
					$('#search-page-query').autocomplete( "close" );
				}
			}
		});
		
		$('#search-go').on({
			click: function(e){
				e.preventDefault();
				console.log("Searching...")
				self.search(self.getAllValues());
				$('#filter-query').autocomplete( "close" );
				$('#filter-location').autocomplete( "close" );
			}
		});
	} // end init
}
