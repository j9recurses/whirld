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

	this.resultsCount = $('#filter-result-count');
	this.searchResultsContainer = $('#search-results');
}

FilterBar.prototype = {
	// functions for form interactions
	locationAC: function(){
		// only works for projects right now
    var locAC = new AutoComp({
      inputId: 'filter-location'
    });
    locAC.location();
	},
	keywordAC: function(){
		// only works for projects right now
		console.log('initiated keywordAC')
    var kwAC = new AutoComp({
      inputId: 'filter-query'
    });
    kwAC.keyword();
	},
	// functions for getting values from dom
	getAllValues: function(){
		var data = {};
		$.each($('.filter'), function(i, el){
			var type = $(el).attr('id').split('-')[1];

			// grab data according to input type
			if(type == 'query' || type == 'location'){
				var val = $(el).val();
			}
			else{
				var val = $(el).text();
			}
			data[type]= val;
		});
		return data;
	},
	// functions for posting to DOM
	htmlCreatedAt: function(item){
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var d = new Date(item.created_at)
		return monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
	},
	htmlProjectResult: function(item){
		var tagList = "";
		$.each(item.taglist, function(i, tag){
			var tagText = "<li class='project-tag item push-down gray'>" + tag + ", </li>"
			tagList += tagText;
		});
		var header = "<div class='search-card-header row group wrapper gray'><div class='twenty-four'><h1 class='search-card-title h5-size caps bold'><a href='maps/" + item.id + "'>" + item.name +"</a></h1><ul class='inline-list'><li class='user-meta-item item font_small'>Posted by: <a href='/users/" + item.user_id + "'>" + item.author + "</a></li><li class='user-meta-item item'>&bull;</li><li class='user-meta-item item font_small'>" + this.htmlCreatedAt(item) + "</li></ul><ul class='project-tag-list inline-list font_small'><li class='project-tag-icon item h4-size'><i class='fa fa-tag'></i></li><li class='project-tag item pull-right'>...</li>" + tagList + "</ul></div></div>";
		var thumbnail = "<div class='search-card-thumb row group'><div class='twenty-four columns pos-rel'><div class='search-card-location twenty-four pos-abs font_small wrapper'>" + item.location + "</div><a class='img-wrapper img-wrapper-link' href='/maps/1' style=\"background-image:url('/assets/test/test1.jpg')\"></a></div></div>";
		var commentCount = 100; 
		var voteCount = 4000;
		var activity = "<div class='search-card-activity search-card-footer row group wrapper gray'><div class='twenty-four columns'><ul class='inline-list font_small'><li class='comment-count item cursor-point'><i class='fa fa-comment'></i><span class='comment-num'>" + commentCount + "</span></li><li class='vote-count item cursor-point'><i class='fa fa-thumbs-up'></i><span class='vote-num'>" + voteCount + "</span></li></ul></div></div>";
		return "<article id='search-card-" + item.id + "' class='search-card eight columns' data-map-id='" + item.id + "'>" + header + thumbnail + activity + "</article>";
	},
	appendProjectResults: function(data){
		var self = this;
		var count = 0;
		var html="<div class='row group wrapper'>"
		$.each(data, function(i, result){
			if(count%3 != 0){
				html += self.htmlProjectResult(result);
			}
			else{
				html += ("</div><div class='row group wrapper'>" + self.htmlProjectResult(result));
			}
			count += 1;
		});
		html += "</div>"
		this.searchResultsContainer.append($(html))
	},
	// functions for posting queries to server
	search: function(data){
		var self = this;
				self.searchResultsContainer.empty();
		$.ajax({
			url: 'search',
			data: data,
			type: 'get',
			success: function(data){
				console.log('Success: user results are returning');
				self.resultsCount.text(data.length);
				self.appendProjectResults(data);
			},
			error: function(){
				console.log('Oops something went wrong.')
			}
		});
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
		this.keywordAC();
		this.locationAC();
		this.sort();
		var self = this;

		$('#filter-location').on({
			keyup:function(e){
				if(e.which == 13){
					self.search(self.getAllValues());
				}
			}
		});

		$('#filter-query').on({
			keyup:function(e){
				if(e.which == 13){
					self.search(self.getAllValues());
				}
			}
		});

		$('#search-go').on({
			click: function(){
				console.log("Searching...")
				self.search(self.getAllValues());
			}
		});
	} // end init
}
