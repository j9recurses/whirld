$(document).ready(function(){
		
		var tagWrapper = $('#project-tag-wrapper');
		var projDesc = $('#project-description');
		$('#project-tags-more').off().on({
			click: function(){
				$(this).find('i').toggleClass('fa-angle-double-right').toggleClass('fa-angle-double-down');
				
				projDesc.addClass('invisible');

				setTimeout(function(){
					tagWrapper.toggleClass('expanded');
		
					var actionBarTop = $('#project-action-bar').offset().top;
					setTimeout(function(){
						var descTop = tagWrapper.height();
						var descBottom = tagWrapper.offset().top + descTop;
						var descHeight = actionBarTop - descBottom;

						projDesc.css('top', descTop)
										.css('height', descHeight - 16);
						projDesc.removeClass('invisible');
					}, 300);

				}, 100);
			}
		});

		// Packery
	  // $('.module-grid-wrapper').isotope({
			// layoutMode: 'packery',
			// packery: {
			//   columnWidth: '.grid-sizer',
			//   grid: 0
			// },
			// itemSelector: '.grid-photo',
			// percentPosition: true
	  // });

	  // Action bar
	  var self = $(this);
	  var bar = $('#project-action-bar');

		bar.removeClass('invisible');
		toggleActionBar(bar);

	  self.on('scroll', function(e){
	  	console.log(e)
	  	toggleActionBar(bar);
	  })

		function toggleActionBar(bar){
			if(self.scrollTop() > 300){
				collapseActionBar(bar);
			}
			else{
				openActionBar(bar);
			}
		}

		function collapseActionBar(bar){
			$('#project-edit').addClass('hidden');
			$('#project-like-share').addClass('hidden');
			bar.addClass('after-scroll');
		}
		function openActionBar(bar){
			bar.removeClass('after-scroll');
			$('#project-edit').removeClass('hidden');
			$('#project-like-share').removeClass('hidden');	
		}

}); // end document.ready