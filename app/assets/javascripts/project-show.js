$(document).ready(function(){
	// Packery
  $('.module-grid-wrapper').isotope({
		layoutMode: 'packery',
		packery: {
		  columnWidth: '.grid-sizer',
		  grid: 0
		},
		itemSelector: '.grid-photo',
		percentPosition: true
  });

  // Action bar
  var self = $(this);
  var bar = $('#project-action-bar');

	bar.removeClass('invisible');
	toggleActionBar(bar);

  self.on('scroll', function(e){
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

});