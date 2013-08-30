app.Filter = Backbone.Model.extend({
  defaults: function() {
    return {
      'query_key': '(key)',
      'labels': [{'name': '(undefined)', 'value': 0, 'facet_count': 0}],
      'active_value': -1
    };
  },
  
  initialize: function(attr) {
    this.set(attr);
    _.bindAll(this, 'filter_parameters');
  },
  
  filter_parameters: function() {
    // return [this.get('query_key'), this.get('active_value')];
    var dict = {};
    dict[this.get('query_key')] = this.get('active_value');
    return dict;
  }  
});
