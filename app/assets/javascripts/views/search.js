app.Search = Backbone.View.extend({
  el: $('#filter_search_form'),
  tagName: 'ul',
  className: 'filter-group',
  template: _.template( $( '#filter_template' ).html() ),
  
  initialize: function() {
    _.bindAll(this, 'trigger_on_enter', 'filter_parameters');
  },
  
  events: {"keypress": "trigger_on_enter"},
  
  trigger_on_enter: function(e) {
    if(e.which === ENTER_KEY) {
      e.preventDefault();
      this.$el.find('input').blur();
      app.trigger('filter_update', true);
    }
  },
  
  filter_parameters: function() {
    return { 'string': this.$el.find('input').val() };
  }
});
