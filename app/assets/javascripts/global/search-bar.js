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
		console.log(item.taglist)
		$.each(item.taglist, function(i, tag){
			console.log(i)
			console.log(tag)
			var tagText = "<a class='uk-text-muted' href='search/" + tag.name + "'>" + tag.name + "</a>";
			tagList += tagText;
		});
		if(tagList != ""){ return "<span class='uk-text-small'><i class='fa fa-tag uk-text-muted'></i></span>" + tagList }
			else{ return "" }
	},
	htmlCollaboList: function(item){
		var collabList = "";
		$.each(item.collaborator_list, function(id, collabo){
			collabList += "<a href='/users_profiles/" + id + "' class='uk-text-small'>" + collabo + "</a>   ";
		});
		if(collabList != ""){ return "<i class='fa fa-users uk-text-muted uk-text-small' data-uk-tooltip title='Project collaborators'></i> " + collabList }
			else{ return "" } 
	},
	htmlProjectResult: function(item){
		var commentCount = 100; 
		var voteCount = 4000;
		var thumb = "<a href='/maps/" + item.id + "' class='sc-cover uk-cover-background uk-overlay' style=\"background-image: url('" + item.coverphoto_name + "');\"><img class='uk-invisible' src='" + item.coverphoto_name + "' alt='" + item.name + "'/></a>";
		var activity = "<div class='sc-activity uk-width-2-10 uk-text-center'><p><i class='fa fa-users wh-text-green' data-uk-tooltip title='No. of colaborators'></i><br><span id='sc-collabo-count' class='uk-text-small uk-text-muted'>" + Object.keys(item.collaborator_list).length + "</span></p><p><i class='fa fa-comment wh-text-green'></i><br><span id='sc-comment-count' class='uk-text-small uk-text-muted'>" + item.comment_count + "</span></p><p><i class='fa fa-heart wh-text-green' data-uk-tooltip title='No. of colaborators'></i><br><span id='sc-whirl-count' class='uk-text-small uk-text-muted' data-uk-tooltip title='No. of Whirls'>" + item.whirls + "</span></p></div>"
		var header = "<div class='sc-header'><h1 class='sc-title uk-h4 wh-caps uk-text-bold'><a href='/maps/" + item.name + "'>" + item.name + "</a></h1></div>"
		var meta = "<div class='sc-meta uk-text-muted uk-margin-bottom'><span class='sc-location'>" + item.location + "</span>  |  <span> " + item.updated_at + "</span><br><span class='sc-collabos'>" + this.htmlCollaboList(item) + "</span></div>";
		var tags = "<div class='sc-tags uk-subnav uk-text-small uk-width-6-10 uk-float-left uk-text-nowrap'>" + this.htmlTagList(item) + "</div>";
		return "<article class='search-card mix' data-map-id='" + item.id + "' data-updated='" + this.updatedInt(item) + "' data-relevant='" + item.search_order + "'>" + thumb + "<div class='uk-grid uk-grid-collapse'>" + activity + "<div class='sc-main uk-width-8-10'>" + header + meta + tags + "</div></article>";
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
				e.preventDefault();
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
				console.log('Success: results are returning');

				self.resultsCount.text(data.length);
				self.searchResultsContainer.empty();
				self.appendProjectResults(data);
			},
			error: function(){
				console.log('Oops something went wrong.')
			}
		});
	},
	initTopBar: function(){
		this.keywordAC('search-bar-keyword');
		this.locationAC('search-bar-location');
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
