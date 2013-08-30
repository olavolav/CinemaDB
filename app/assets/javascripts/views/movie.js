app.MovieView = Backbone.View.extend({
  tagName: 'div',
  className: 'movie',
  template: _.template( $( '#movie_template' ).html() ),
  
  initialize: function() {
    _.bindAll(this, 'render');
    this.listenTo(this.model, 'change', this.render);
  },
  
  render: function() {
    // console.log("DEBUG: rendering '"+this.model.get('title')+"' ...");
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
});
