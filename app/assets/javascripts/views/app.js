app.AppView = Backbone.View.extend({
  el: $("#movie_index"),

  initialize: function(f) {
    // this.filters = f;
    this.collection = new app.MovieList;
    this.collection.fetch_using_filters();
    
    
    _.bindAll(this, 'render_movie', 'render');
    this.collection.bind('reset', this.render);
    // Don't render here
  },

  goto_next_page: function() {
    // movies.fetch_using_current_filter(1);
  },

  render: function() {
    console.log("Collection reset, render function of app view called.");
    this.$el.html("");
    if(this.collection.length > 0) {
      this.collection.each(this.render_movie);
    } else {
      this.$el.html("No movies found.");
    }
    return this;
  },

  render_movie: function(item){
    // alert('call to render_movie for movie: '+item.get('title'));
    var m_view = new app.MovieView({model: item});
    this.$el.append( m_view.render().el );
  }
});
