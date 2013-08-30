app.FilterView = Backbone.View.extend({
  tagName: 'ul',
  className: 'filter-group',
  template: _.template( $( '#filter_template' ).html() ),
  
  initialize: function(mod) {
    this.listenTo(this.model, 'change', this.render);
    
    _.bindAll(this, 'render', 'click_in_filters');
  },
  
  render: function() {
    // alert("rendering filter "+this.model.get('query_key')+" ...");
    this.$el.html( this.template(this.model.toJSON()) );
    return this;
  },
  
  events: {
    "click li" : "click_in_filters"
  },
  
  click_in_filters: function(e) {
    // get value (= DOM id) of clicked filter
    var id = $(e.currentTarget).data("id");
    // alert("click! value = "+id+" and previously it was "+this.model.get('active_value'));
    if(this.model.get('active_value') != id) {
      this.model.set('active_value', id);
    }
  }
});
