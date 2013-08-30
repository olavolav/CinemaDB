app.FilterList = Backbone.Collection.extend({
  model: app.Filter,
  
  initialize: function(list) {
    this.collection = list;
    
    _.bindAll(this, 'filter_parameters', 'update_facet_counts');
    app.bind('got_new_facet_counts', this.update_facet_counts);
  },
  
  filter_parameters: function() {
    // collect parameters of all filters for AJAX call later
    var parameters_list = {};
    this.each(function(mod) {
      parameters_list = $.extend(parameters_list, mod.filter_parameters());
    });
    // alert("DEBUG: parameters_list = "+JSON.stringify(parameters_list));
    return parameters_list;
  },
  
  update_facet_counts: function(facets) {
    var query_keys = this.pluck('query_key');
    for(var i=0; i<query_keys.length; i++) {
      var query_key = query_keys[i];
      var f_here = facets['current_'+query_key];
      var filter = this.findWhere({'query_key': query_key});
      if(f_here != undefined) {
        // First, update page count for paginator
        if(query_key === 'category') { // since we do not allow an unset category
          var total_hits = f_here['total'];
          app.trigger('got_new_total_hits_count', total_hits);
        }
        
        var labels = filter.get("labels");
        // First reset all labels (since facets with count 0 are not included in the response
        for(var k=0; k<labels.length; k++) {
          labels[k]['facet_count'] = 0;
        }
        // Then, update the facet counts
        var local_counts = f_here['terms'];
        for(var j=0; j<local_counts.length; j++) {
          for(var k=0; k<labels.length; k++) {
            // See if we have a filter element in the frontend for this category
            // (might not exist, for example '1982' is not shown on screen)
            if(labels[k]['value'] == local_counts[j]['term']) {
              labels[k]['facet_count'] = local_counts[j]['count'];
            }
          }            
        }
        // Manually trigger change event since we did not change the whole dict.
        filter.trigger('change');
      }
    }
  }
});
