app.FilterSectionView = Backbone.View.extend({
  el: $('#movie_filters'),
  
  initialize: function(list) {
    this.collection = list;
    this.render();
    
    this.collection.bind("change:active_value", this.filters_have_changed, this);
    _.bindAll(this, 'filters_have_changed');
  },

  // render library by rendering each book in its collection
  render: function() {
    this.collection.each(function( item ) {
      this.renderFilter( item );
    }, this );
  },

  // render a book by creating a BookView and appending the
  // element it renders to the library's element
  renderFilter: function( item ) {
    var filter_view = new app.FilterView({
      model: item
    });
    this.$el.append( filter_view.render().el );
  },
  
  filters_have_changed: function() {
    // alert("DEBUG: new filter parameters: "+JSON.stringify(this.collection.filter_parameters()));
    app.trigger('filter_update', true);
  }

});
