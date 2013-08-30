app.EventDispatcher = Backbone.Model.extend({
  
  initialize: function(app_view, filter_section_view, search_view, pagination_view) {
    this.app_section = app_view;
    this.filter_section = filter_section_view;
    this.search_section = search_view;
    this.pagination_section = pagination_view;
    _.bindAll(this, 'launch_new_query');

    app.bind('filter_update', this.launch_new_query);
  },
  
  launch_new_query: function(reset_page_count) {
    // alert("call to launch_new_query!");
    // Get parameters from filter section
    var query_search_data = this.filter_section.collection.filter_parameters();
    // Get parameters from search field
    query_search_data = $.extend(query_search_data, this.search_section.filter_parameters());
    // Get parameters from pagination
    if(!reset_page_count) {
      query_search_data = $.extend(query_search_data, this.pagination_section.filter_parameters());
    }
    
    console.log("DEBUG: JSON query = "+JSON.stringify(query_search_data));
    this.app_section.collection.fetch_using_filters( query_search_data );
  }
  
});
