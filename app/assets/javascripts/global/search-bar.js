var SearchBar = function(options){
	this.options = $.extend({

	}, options);

	this.resultsCount = $('#search-results-count');
	this.searchResultsContainer = $('#search-results-list');
}

SearchBar.prototype = {
	dropDowns: function(){
		console.log('Initiated: entity box')

		var self = this;
		$('.wh-select').on('click', 'a', function(){
			var container = $(this).closest('.wh-select')
			if($(this).hasClass('selected')){
				console.log('nothing happens')
			}
			else{
				$(container.find('.selected')).removeClass('selected')
				$(this).addClass('selected');
				container.find('.selected-show').text($(this).text());
			}
		})
	},
	viewSwitch: function(){
		var self = this;
		$('#view-switch').on('click', function(){
			console.log(this)
			var icon = $(this).find('i');
			if(icon.hasClass('fa-th-large')){
				icon.removeClass('fa-th-large');
				icon.addClass('fa-map-marker');
				
				//Temp
				$('.search-card').addClass('uk-hidden');
				self.searchResultsContainer.append($("<h1 id='placeholder'>A Map Will Go Here</h1>"))
			}
			else{
				icon.addClass('fa-th-large');
				icon.removeClass('fa-map-marker');

				$('#placeholder').remove()
				$('.search-card').removeClass('uk-hidden')
			}
		})
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
			self.searchResultsContainer.mixItUp('prepend', $(html), {filter: 'all'})
		});
		if(data.length %3 != 0){ self.searchResultsContainer.append($("<div class='gap'></div>")); }
	},

	// Search functions

	// functions for autocomplete inits
	locationAC: function(id){
		// only works for projects right now
		console.log('initiated locationAC')
    var locAC = new AutoComp({
      inputId: id,
      mapknitter: false
    });
    locAC.location();
	},
	keywordAC: function(id){
		// only works for projects right now
		console.log('initiated keywordAC')
    var kwAC = new AutoComp({
      inputId: id
    });
    kwAC.keyword();
	},

	// functions for getting values from dom
	getPageValues: function(){
		var data = {
			query: $('#search-page-keyword').val(),
			location: $('#search-page-location').val(),
			entity: $('#search-page-entity').find('.selected').text()
		}
		console.log(data)
		return data;
	},
	// functions for posting queries to server
	pageGo: function(){
		var self = this;
		$('#search-page-go').on({
			click: function(e){
				console.log(this)
				e.preventDefault();
				console.log("Searching...")
				self.pageSearch(self.getPageValues());
				$('#search-page-keyword').autocomplete( "close" );
				$('#search-page-location').autocomplete( "close" );
			}
		});
	},
	pageSearch: function(data){
		var self = this;
		$.ajax({
			url: '/search',
			data: data,
			type: 'get',
			success: function(data){
				console.log(data)
				console.log('Success: user results are returning');

				self.resultsCount.text(data.length);
				self.searchResultsContainer.empty();
				self.appendProjectResults(data);
			},
			error: function(){
				console.log('Oops something went wrong.')
			}
		});
	},
	initFilterBar: function(){
		this.keywordAC('search-page-keyword');
		this.locationAC('search-page-location');
		this.dropDowns();
		this.viewSwitch();
		this.pageGo();

		// $('#search-page-location').on({
		// 	keyup:function(e){
		// 		if(e.which == 13){
		// 			self.search(self.getPageValues());
		// 			$('#search-page-location').autocomplete( "close" );
		// 		}
		// 	}
		// });

		// $('#search-page-keyword').on({
		// 	keyup:function(e){
		// 		if(e.which == 13){
		// 			self.search(self.getPageValues());
		// 			$('#search-page-keyword').autocomplete( "close" );
		// 		}
		// 	}
		// });
		
	} // end init
}
