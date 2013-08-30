app.PaginatorView = Backbone.View.extend({
  el: $('#pagination-list'),
  template: _.template( $( '#paginator_template' ).html() ),
  
  initialize: function(mod) {
    this.model = new app.Paginator;
    _.bindAll(this, 'click_in_paginator', 'render', 'filter_parameters');
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  
  events: {"click li" : "click_in_paginator"},
  
  click_in_paginator: function(e) {
    e.preventDefault();
    var a_change_occurred = false;
    // get value (= DOM id) of clicked filter
    var id = $(e.currentTarget).data("id");
    // alert("DEBUG: id = "+id);
    if(id === "previous") {
      this.model.set('current_page', this.model.get('current_page') - 1);
      a_change_occurred = true;
    } else if(id === "next") {
      this.model.set('current_page', this.model.get('current_page') + 1);
      a_change_occurred = true;
    } else if(parseInt(id) != this.model.get('current_page')) {
      this.model.set('current_page', parseInt(id));
      a_change_occurred = true;
    }
    
    if(a_change_occurred) {
      app.trigger('filter_update', false);
    }
  },
  
  render: function() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  },
  
  filter_parameters: function() {
    return { 'page': this.model.get('current_page') };
  }
});
