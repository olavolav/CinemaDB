// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


// helper method
function star_display(score_class) {
  var result = "";
  for (var i=0; i<5; i++) {
    if(score_class > i) { result += "\u2605" }
    else { result += "\u2606" };
  }
  return result;
}


$(document).ready(function(){
  // alert("document ready.");
  
  // Use extended Mustache.js style templating so as not to conflict with ERB
  _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate : /\{\{=(.+?)\}\}/g
  };
  
  var Movie = Backbone.Model.extend({
    
    initialize: function(settings) {
      this.view = new MovieView({model: this});
      // movies.add(this);
    }
    
  });
  
  var MovieList = Backbone.Collection.extend({
    model: Movie,
    url: 'http://localhost:3000/movies/search.json',
    
    show_count: function() {
      alert("length of collection: "+this.length);
    }
  });
  
  // create list of movies
  var movies = new MovieList();
  
  var MovieView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#movie_template').html()),
    
    initialize: function() {
      // alert("initializing view for method: "+this.model.get("name"));
      this.render();
    },
    
    // events: {
    //   'mouseenter': 'hover_on',
    //   'mouseleave': 'hover_off'
    // },
    
    render: function() {
      alert('rendering movie '+this.model.get('name'));
    }
    
  });
  
  var AppView = Backbone.View.extend({
    el: $("#movie_index")
  });
  
  var app = new AppView;
  movies.fetch();
  movies.show_count();

});
