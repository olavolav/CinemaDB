ENTER_KEY = 13;
ITEMS_PER_PAGE = 10;

// helper method to display rating
function star_display(score_class) {
  var result = "";
  for (var i=0; i<5; i++) {
    result += "<span data-id='"+(i+1)+"'>";
    if(score_class > i) { result += "\u2605" }
    else { result += "\u2606" };
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
