ENTER_KEY = 13;
ITEMS_PER_PAGE = 10;

// helper method to display rating
function star_display_reverse(score_class) {
  var result = "";
  // for (var i=0; i<5; i++) {
  for (var i=5; i>0; i--) {
    result += "<span class='rating_star' data-id='"+i+"'>";
    if(score_class >= i) {
      result += "\u2605"; // filled star
    } else {
      result += "\u2606"; // empty star
    }
    result += "</span>";
  }
  return result;
}


// Use extended Mustache.js style templating so as not to conflict with ERB
_.templateSettings = {
  evaluate:     /\{\{(.+?)\}\}/g,           // {{ console.log('message') }}
  interpolate : /\{\{=(.+?)\}\}/g,          // {{= name }}
  escape:       /\{\{\{=([\s\S]+?)\}\}\}/g  // {{{= unsafe_name }}}
};

var app = app || {};
_.extend(app, Backbone.Events); // to enable observer role of EventDispatcher
