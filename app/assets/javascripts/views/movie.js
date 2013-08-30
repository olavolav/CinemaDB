app.MovieView = Backbone.View.extend({
  tagName: 'div',
  className: 'movie',
  template: _.template( $( '#movie_template' ).html() ),
  
  initialize: function() {
    // this.bind('change', this.render);
    _.bindAll(this, 'render', 'remove');
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'remove', this.remove);
  },
  
  render: function() {
    console.log("DEBUG: rendering '"+this.model.get('title')+"' ...");
    //this.el is what we defined in tagName. use $el to get access to jQuery html() function
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  },
  
  remove: function() {
    console.log("DEBUG: removing '"+this.model.get('title')+"' ...");
    this.$el.html("");
    return this;
  }
});
