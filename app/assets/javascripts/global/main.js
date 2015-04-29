$(document).ready(function(){
  new SearchBar();
  console.log('main?')
});

var SearchBar = function(){
  $('#search-input-wrapper').off().on('click', '#search-icon-wrapper', function(){
    var wrapper = $(this).closest('#search-input-wrapper');
    if(wrapper.hasClass('search-expanded')){
      wrapper.removeClass('search-expanded');
    }
    else{
      wrapper.addClass('search-expanded');
      var input = $('#search-input');
          input[0].selectionStart = input[0].selectionEnd = input.val().length;
    }
  });
}