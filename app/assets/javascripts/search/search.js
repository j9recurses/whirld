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
	updatedInt: function(item){
		var d = new Date(item.updated_at);
		return d.getTime();
	},
	htmlUpdatedPretty: function(item){
		var a = new Date(item.created_at)
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var d = new Date(item.created_at)
		var date = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
		return date;
	},
	htmlTagList: function(item){
		var tagList = "";
		$.each(item.taglist, function(i, tag){
			var tagText = "<a class='uk-text-muted' href='maps/tagged/" + tag + "'>" + tag + "</a>";
			tagList += tagText;
		});
		if(tagList != ""){ return "<span class='uk-text-small'><i class='fa fa-tag uk-text-muted'></i></span>" + tagList }
			else{ return "" }
	},
	htmlProjectResult: function(item){
		var commentCount = 100; 
		var voteCount = 4000;
		var thumb = "<a href='/maps/" + item.id + "' class='sc-cover uk-cover-background uk-overlay' style=\"background-image: url('/uploads/photo/13/31/NorthBerkeley.jpg');\"><img class='uk-invisible' src='/uploads/photo/13/31/NorthBerkeley.jpg' alt='" + item.name + "'><div class='sc-location uk-text-contrast wh-caps uk-overlay-panel uk-overlay-bottom uk-overlay-background'><div class='uk-container '>" + item.location + "</div></div></a>";
		var title = "<div class='uk-container uk-margin-top'><div class='sc-header'><h1 class='sc-title uk-h4 wh-caps uk-text-bold'><a href='/maps/" + item.id + "'>" + item.name + "</a></h1></div><div class='sc-meta uk-text-muted uk-text-small'><ul class='uk-subnav uk-subnav-line'><li class='uk-active'>Posted by <a href='/users_profiles/" + item.user_id + "'>kbasye</a></li><li>Updated on " + this.htmlUpdatedPretty(item) + "</li></ul></div></div>";
		var activity = "<ul class='uk-subnav uk-text-small uk-float-right uk-width-4-10'><li class='uk-width-1-2 uk-text-muted'><i class='fa fa-comment uk-text-muted'></i> <span id='sc-comment-count' class='uk-text-muted'>" + commentCount + "</span></li><li class='uk-width-1-2 uk-text-muted'><i class='fa fa-heart uk-text-muted'></i> <span id='sc-whirl-count' class='uk-text-muted'>" + voteCount + "</span></li></ul>";
		var footer = "<div class='sc-footer uk-container'><div class='sc-tags uk-subnav uk-text-small uk-width-6-10 uk-float-left uk-text-nowrap'>" + this.htmlTagList(item) + "</div>" + activity + "</div>"
		return "<article class='search-card mix' data-map-id='" + item.id + "' data-updated='" + this.updatedInt(item) + "' data-relevant='" + item.search_order + "'>" + thumb + title + "<hr>" + footer + "</article>";
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

		// $('#search-page-location').on({
		// 	keyup:function(e){
		// 		if(e.which == 13){
		// 			self.search(self.getAllValues());
		// 			$('#search-page-location').autocomplete( "close" );
		// 		}
		// 	}
		// });

		// $('#search-page-keyword').on({
		// 	keyup:function(e){
		// 		if(e.which == 13){
		// 			self.search(self.getAllValues());
		// 			$('#search-page-keyword').autocomplete( "close" );
		// 		}
		// 	}
		// });
		
		$('#search-go').on({
			click: function(e){
				e.preventDefault();
				console.log("Searching...")
				self.search(self.getAllValues());
				$('#search-page-keyword').autocomplete( "close" );
				$('#search-page-location').autocomplete( "close" );
			}
		});
	} // end init
}
