// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function(){
  alert("document ready.");
  
  // Use Mustache.js style templating such as not to conflict with ERB
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
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
