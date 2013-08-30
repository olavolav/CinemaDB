app.Movie = Backbone.Model.extend({
  defaults: function() {
    return {
      title: "(title)",
      year: "(year)",
      description: "(description)",
      score_class: 0,
      your_score_class: 0,
      category_id: 0,
      image_url: ""
    };
  }
  
  // initialize: function() {
  //   this.on('change', console.log("DEBUG: Change in model '"+this.get('title')+"' has occurred."));
  // }
});
