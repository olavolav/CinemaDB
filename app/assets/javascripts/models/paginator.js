app.Paginator = Backbone.Model.extend({
  defaults: function() {
    return {
      number_of_pages: 0,
      current_page: 0
    }
  },
  
  initialize: function() {
    _.bindAll(this, 'new_total_hits_count');
    app.bind('got_new_total_hits_count', this.new_total_hits_count);
  },
  
  new_total_hits_count: function(nr_of_hits) {
    // alert("DEBUG: new_total_hits_count = "+nr_of_hits);
    this.set("number_of_pages", Math.floor(nr_of_hits / 10) + 1);
    if(this.get("current_page") >= this.get("number_of_pages")) {
      this.set("current_page", 0); // slight HACK
    }
  }
});
