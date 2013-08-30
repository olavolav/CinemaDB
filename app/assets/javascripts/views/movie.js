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
    // alert("DEBUG: A new rating of "+score+" stars for '"+this.model.get('title')+"'");
    this.model.set("your_score_class", score);
  }
});
