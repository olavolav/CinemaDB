$(document).ready(function(){
  // alert("document ready.");
  var app = app || {};
  _.extend(app, Backbone.Events); // to enable observer role of EventDispatcher
  
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
    },
    
    initialize: function() {
      this.on('change', console.log("Debug: Change in model '"+this.get('title')+"' has occurred."));
    }
  });
  
  
  app.MovieList = Backbone.Collection.extend({
    model: app.Movie,
    url: 'http://localhost:3000/movies/search.json',
    
    initialize: function() {
      _.bindAll(this, 'fetch_using_filters');
    },
  
    fetch_using_filters: function(query_obj) {
      // alert("DEBUG: AJAX call to search inteface...");
      var res = this.fetch({ 'async': false, 'reset': true, 'data': (query_obj || {}) });
      console.log("Recieved "+res.responseJSON.length+" movies via AJAX.");
    }
  });
  
  
  app.MovieView = Backbone.View.extend({
    tagName: 'div',
    className: 'movie',
    template: _.template( $( '#movie_template' ).html() ),
    
    initialize: function() {
      // this.bind('change', this.render);
      _.bindAll(this, 'render', 'remove');
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'remove', this.remove);
    },
    
    render: function() {
      console.log("DEBUG: rendering '"+this.model.get('title')+"' ...");
      //this.el is what we defined in tagName. use $el to get access to jQuery html() function
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },
    
    remove: function() {
      console.log("DEBUG: removing '"+this.model.get('title')+"' ...");
      this.$el.html("");
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
  
  app.FilterList = Backbone.Collection.extend({
    model: app.Filter,
    initialize: function(list) {
      this.collection = list;
      _.bindAll(this, 'filter_parameters');
    },
    filter_parameters: function() {
      // collect parameters of all filters for AJAX call later
      var parameters_list = {};
      this.each(function(mod) {
        parameters_list = $.extend(parameters_list, mod.filter_parameters());
      });
      // alert("DEBUG: parameters_list = "+JSON.stringify(parameters_list));
      return parameters_list;
    }
  });
  
  app.FilterView = Backbone.View.extend({
    tagName: 'ul',
    className: 'filter-group',
    template: _.template( $( '#filter_template' ).html() ),
    
    initialize: function(mod) {
      this.listenTo(this.model, 'change', this.render);
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
      app.trigger('filter_update');
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
      this.collection.fetch_using_filters();
      
      
      _.bindAll(this, 'render_movie', 'render');
      this.collection.bind('reset', this.render);
      // Don't render here
    },
  
    goto_next_page: function() {
      // movies.fetch_using_current_filter(1);
    },
  
    render: function() {
      console.log("Collection reset, render function of app view called.");
      this.$el.html("");
      if(this.collection.length > 0) {
        this.collection.each(this.render_movie);
      } else {
        this.$el.html("No movies found.");
      }
      return this;
    },
  
    render_movie: function(item){
      // alert('call to render_movie for movie: '+item.get('title'));
      var m_view = new app.MovieView({model: item});
      this.$el.append( m_view.render().el );
    }
  });
  
  // ------------------------ define search bar ------------------------
  
  app.Search = Backbone.View.extend({
    el: $('#filter_search_form'),
    initialize: function() {
      _.bindAll(this, 'trigger_on_enter', 'filter_parameters');
    },
    events: {"keypress": "trigger_on_enter"},
    trigger_on_enter: function(e) {
      if(e.which === ENTER_KEY) {
        e.preventDefault();
        app.trigger('filter_update');
      }
    },
    filter_parameters: function() {
      return { 'string': this.$el.find('input').val() };
    }
  });
  
  // ------------------------ define query dispatcher ------------------------
  
  app.EventDispatcher = Backbone.Model.extend({
    
    initialize: function(app_view, filter_section_view, search_view) {
      this.app_section = app_view;
      this.filter_section = filter_section_view;
      this.search_section = search_view;
      // this.set("app_section", app_view);
      // this.set("filter_section", filter_section_view);
      _.bindAll(this, 'launch_new_query');

      app.bind('filter_update', this.launch_new_query);
    },
    
    launch_new_query: function() {
      // alert("call to launch_new_query!");
      var query_search_data = this.filter_section.collection.filter_parameters();
      // this.app_section.collection.fetch_using_filters( query_search_data );
      // var query_search_data = this.get("filter_section"); //.collection.filter_parameters();
      // alert(query_search_data);
      query_search_data = $.extend(query_search_data, this.search_section.filter_parameters());
      console.log("DEBUG: JSON query = "+JSON.stringify(query_search_data));
      this.app_section.collection.fetch_using_filters( query_search_data );
    }
    
  });
  
  
  // ------------------------ launch application ------------------------
  
  // set up filters (since they are fixed)
  var filters = new app.FilterList();
  // Add category filter
  filters.add( new app.Filter({
    'query_key': 'category',
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
    'query_key': 'score',
    'labels': [
      {'name': 'All scores', 'value': -1},
      {'name': '3 stars', 'value': 3},
      {'name': '4 stars', 'value': 4},
      {'name': '5 stars', 'value': 5}
    ]
    })
  );
  var CinemaFilters = new app.FilterSectionView(filters);
    
  var CinemaDB = new app.AppView();
  var SearchBar = new app.Search();
  var dispatcher = new app.EventDispatcher(CinemaDB, CinemaFilters, SearchBar);
  CinemaDB.render();
});
