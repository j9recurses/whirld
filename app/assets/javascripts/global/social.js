var Whirl = function(options){
  this.options = $.extend({
  	button: null,
  	ownerId: null,
  	ownerType: null,
  	countSpanClassName: 'wh-js-whirl-count'
  }, options);

  this.icon = $(this.options.button.find('i'));
  this.countContainer = $(this.options.button.parent().find('.' + this.options.countSpanClassName));
  this.count = parseInt(this.countContainer.text());
}

Whirl.prototype = {
	isWhirled: function(){
		if(this.options.button.hasClass('unwhirled')){
			return true
		}
		else{
			return false
		}
	},
	htmlWhirl: function(){
		this.icon.removeClass('fa-heart-o');
		this.icon.addClass('fa-heart');
		this.options.button.toggleClass('unwhirled');
		this.count += 1;
		this.countContainer.text(this.count);
	},
	htmlUnWhirl: function(){
		this.icon.addClass('fa-heart-o');
		this.icon.removeClass('fa-heart');
		this.options.button.toggleClass('unwhirled');
		this.count -= 1;
		this.countContainer.text(this.count);
	},
	create: function(){

		var data = {
         //module object
         klass_id: this.options.ownerId,
         ////module class
         klass_type: this.options.ownerType};
	  console.log(data);
		$.ajax({
		  // at some point will need to differentiate between projects, users, etc.
		  url: "/whirl",
		  type: 'post',
		  dataType: "json",
		  data: data,
		  success: function(data) {
		    console.log('Success: whirling');
		   // console.log(data)
		  },
		  error: function() {
		    console.log("Something went wrong!");
		  }
		});
	},
	init: function(){
		if(this.isWhirled()){
			this.htmlUnWhirl();
		}
		else{
			this.htmlWhirl();
			this.create();
		}
	}
}