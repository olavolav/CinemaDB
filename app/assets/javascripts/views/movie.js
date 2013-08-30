app.MovieView = Backbone.View.extend({
  tagName: 'div',
  className: 'movie',
  template: _.template( $( '#movie_template' ).html() ),
  
  initialize: function() {
    _.bindAll(this, 'render', 'click_in_ratings');
    this.listenTo(this.model, 'change', this.render);
  },
  
  events: {"click .rating_star": 'click_in_ratings'},
  
  render: function() {
    // console.log("DEBUG: rendering '"+this.model.get('title')+"' ...");
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  },
  
  click_in_ratings: function(e) {
    var score = $(e.currentTarget).data("id");
    var movie = this.model;
    // alert("DEBUG: A new rating of "+score+" stars for '"+this.model.get('title')+"'");
    if(score != movie.get("your_score_class")) {
      // Set the new score in the frontend
      movie.set("your_score_class", score);
      
      // Tell the backend about the new score using a custom AJAX request (similar to UPDATE)
      $.ajax({
        type : 'PUT',
        url  : 'ratings/update',
        cache: false,
        async: true,
        data: {
          'movie': movie.get('id'),
          'score': score
        },
        statusCode: {
          403: function() {
            alert("Sorry, please log in first.");
            movie.set("your_score_class", null);
          },
          400: function() {
            alert("Invalid request. Please reload the page and try again.");
          },
          500: function() {
            alert("Invalid request. Please reload the page and try again.");
          }
        }
      });
    }
  }
});
