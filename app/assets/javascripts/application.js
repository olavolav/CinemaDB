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
//= require jquery
//= require jquery_ujs
//= require ./lib/underscore
//= require ./lib/backbone
//= require movies



ENTER_KEY = 13;

// helper method to display rating
function star_display(score_class) {
  var result = "";
  for (var i=0; i<5; i++) {
    if(score_class > i) { result += "\u2605" }
    else { result += "\u2606" };
  }
  return result;
}


// Use extended Mustache.js style templating so as not to conflict with ERB
_.templateSettings = {
  evaluate:     /\{\{(.+?)\}\}/g,           // {{ console.log('message') }}
  interpolate : /\{\{=(.+?)\}\}/g,          // {{= name }}
  escape:       /\{\{\{=([\s\S]+?)\}\}\}/g  // {{{= unsafe_name }}}
};
