app.MovieList = Backbone.Collection.extend({
  model: app.Movie,
  url: 'http://localhost:3000/movies/search.json',
  
  initialize: function() {
    _.bindAll(this, 'fetch_using_filters');
  },

  fetch_using_filters: function(query_obj) {
    // Fetch list of movies and meta info from server
    var AJAXquery = this.fetch({ 'async': false, 'reset': false, 'data': (query_obj || {}) });

    // Updating listed movies
    var results = AJAXquery.responseJSON['results'];
    console.log("Recieved "+results.length+" movie(s) via AJAX.");
    this.reset(results);
    
    // Updating personal scores
    var your_scores = AJAXquery.responseJSON['your_scores'];
    if(your_scores != undefined) {
      console.log("Recieved "+your_scores.length+" personal score(s) via AJAX.");
      for(var i=0; i<your_scores.length; i++) {
        var movie = this.findWhere({'id': your_scores[i]['movie_id']});
        // alert("DEBUG: Found a score for movie '"+movie.get('title')+"': "+your_scores[i]['score']);
        movie.set('your_score_class', your_scores[i]['score']);
      }
    }
    
    // Updating facet counts
    var facets = AJAXquery.responseJSON['facets'];
    console.log("Recieved "+facets.length+" facet section(s) via AJAX.");
    app.trigger('got_new_facet_counts', facets);
  }
});
