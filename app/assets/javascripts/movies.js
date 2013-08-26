$(document).ready(function(){
  // alert("document ready.");
  var app = app || {};
  
  
  // ------------------------ define Movie object ------------------------
  
  app.Movie = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "(title)",
        year: "(year)",
        description: "(description)",
        score_class: 0,
        category_id: 0,
        image_url: ""
      };
    }
  
  });
  
  
  app.MovieList = Backbone.Collection.extend({
    model: app.Movie,
    url: 'http://localhost:3000/movies/search.json',
    
    show_count: function() {
      alert("length of collection: "+this.length);
    },
  
    fetch_using_current_filter: function() {
      this.fetch({'async' : false, 'reset' : true, 'data' :
        { 'year' : 0, 'page' : 0 }
      });
    }
  });


  app.MovieView = Backbone.View.extend({
    tagName: 'div',
    className: 'movie',
    template: _.template( $( '#movie_template' ).html() ),
  
    render: function() {
      //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }
  });
  
  
  // ------------------------ define Filter object ------------------------
  
  app.Filter = Backbone.Model.extend({
    defaults: function() {
      return {
        'query_key': '(key)',
        'labels': [{'name': '(undefined)', 'value': 0}],
        'active_value': -1
      };
    },
    number_of_options: function() {
      return this.get('labels').length;
    }// ,
    //     active_label: function() {
    //       for(int i=0; i<this.number_of_options(); i++) {
    //         var item = this.get('labels')[i];
    //         if(item.value == this.get('active')) {
    //           return item.name;
    //         }
    //       }
    //       return '(invalid)';
    //     }
  });
  
  app.FilterList = Backbone.Collection.extend({
    model: app.Filter,
    initialize: function(list) {
      this.collection = list;
    }
  });
  
  app.FilterView = Backbone.View.extend({
    tagName: 'ul',
    className: 'filter-group',
    template: _.template( $( '#filter_template' ).html() ),
    
    render: function() {
      this.$el.html( this.template(this.model.toJSON()) );
      return this;
    },
    
    events: {
      "click a" : "click_in_filters"
    },
    
    click_in_filters: function(e) {
      // get value (= DOM id) of clicked filter
      var id = $(e.currentTarget).data("id");
      // alert("click! value = "+id+" and previously it was "+this.model.get('active_value'));
      if(this.model.get('active_value') != id) {
        alert("launch new filter! (t.b.c.)");
      }
    }
  });
  
  app.FilterSectionView = Backbone.View.extend({
    el: $('#movie_filters'),
    initialize: function(list) {
      this.collection = list;
      this.render();
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
    }

  });
  
  // ------------------------ define application view ------------------------
  
  app.AppView = Backbone.View.extend({
    el: $("#movie_index"),
  
    events: {
      "click #btn-next-page": "goto_next_page",
      "click #btn-prev-page": "goto_next_page"
    },
  
    initialize: function(f) {
      // this.filters = f;
      this.collection = new app.MovieList;
      this.collection.fetch_using_current_filter();
      
      
      _.bindAll(this, 'render_movie', 'render');
      // this.collection.bind('add', this.renderTreeItem);
      // Don't render here
    },
  
    goto_next_page: function() {
      // movies.fetch_using_current_filter(1);
    },
  
    render: function() {
      this.collection.each(this.render_movie);
      return this;
    },
  
    render_movie: function(item){
      // alert('call to render_movie for movie: '+item.get('title'));
      var m_view = new app.MovieView({model: item});
      this.$el.append( m_view.render().el );
    }
  });
  
  
  
  
  // ------------------------ launch application ------------------------
  
  // set up filters (since they are fixed)
  var filters = new app.FilterList();
  // Add category filter
  filters.add( new app.Filter({
    'query_key': 'category_id',
    'labels': [
      {'name': 'All genres', 'value': -1},
      {'name': 'Action', 'value': 0},
      {'name': 'Drama', 'value': 1},
      {'name': 'Fantasy & Sci-Fi', 'value': 2},
      {'name': 'Comedy', 'value': 3},
      {'name': 'Horror', 'value': 4}
    ]
    })
  );
  // Add filter according to year of release
  filters.add( new app.Filter({
    'query_key': 'year',
    'labels': [
      {'name': 'All years', 'value': -1},
      {'name': '2011', 'value': 2011},
      {'name': '2012', 'value': 2012},
      {'name': '2013', 'value': 2013}
    ]
    })
  );
  // Add filter according to score class
  filters.add( new app.Filter({
    'query_key': 'score_class',
    'labels': [
      {'name': 'All scores', 'value': -1},
      {'name': '4 stars only', 'value': 4},
      {'name': '5 stars only', 'value': 5}
    ]
    })
  );
  var CinemaFilters = new app.FilterSectionView(filters);
  
  // create list of movies
  // var movies = new app.MovieList;
  // movies.fetch_using_current_filter();
  
  var CinemaDB = new app.AppView();
  CinemaDB.render();
});
