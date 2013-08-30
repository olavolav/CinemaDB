app.MovieList = Backbone.Collection.extend({
  model: app.Movie,
  url: 'http://localhost:3000/movies/search.json',
  
  initialize: function() {
    _.bindAll(this, 'fetch_using_filters');
  },

  fetch_using_filters: function(query_obj) {
    var AJAXquery = this.fetch({ 'async': false, 'reset': false, 'data': (query_obj || {}) });
    // console.log("DEBUG: AJAX response: "+res);

    // Updating listed movies
    var results = AJAXquery.responseJSON['results'];
    console.log("Recieved "+results.length+" movies via AJAX.");
    this.reset(results);
    
    // Updating facet counts
    var facets = AJAXquery.responseJSON['facets'];
    console.log("Recieved "+facets.length+" facet section via AJAX.");
    app.trigger('got_new_facet_counts', facets);
  }
});
