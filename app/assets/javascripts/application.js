// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

//= require jquery/dist/jquery.js
//= require jquery-ujs/src/rails.js

//= require bootstrap/dist/js/bootstrap.js

//= require leaflet/dist/leaflet
//= require leaflet-providers/leaflet-providers.js
//= require leaflet-draw/dist/leaflet.draw-src.js
//= require leaflet-illustrate/dist/Leaflet.Illustrate.js
//= require leaflet-toolbar/dist/leaflet.toolbar.js
//= require leaflet-distortableimage/dist/leaflet.distortableimage.js
//= require leaflet-easybutton/easy-button.js
//= require leaflet-google/index.js
//= require sparklines/source/sparkline.js

// Katey's part
//= autosize/dest/autosize.min

//for videos
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require jquery.placeholder
//= require_tree .

$(document).ready(function() {
  var submit_button = $('#submit_pre_upload_form');
     var video_upload = $('#video_upload');
     submit_button.click(function () {
       $.ajax({
         type: 'POST',
         url: "/videos/videos_get_upload_token",
         data: $('#video_pre_upload').serialize(),
         dataType: 'json',
         success: function(response) {
           video_upload.find('#token').val(response.token);
          window.alert(response.token)
           video_upload.attr('action', response.url.replace(/^http:/i, window.location.protocol)).submit();
           submit_button.unbind('click').hide();
           $('.preloader').css('display', 'block');
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert(errorThrown);
         }
       });
     });
});
