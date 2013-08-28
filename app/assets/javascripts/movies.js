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
      var AJAXquery = this.fetch({ 'async': false, 'reset': false, 'data': (query_obj || {}) });
      // console.log("DEBUG: AJAX response: "+res);

      // Updating listed movies
      var results = AJAXquery.responseJSON['results'];
      console.log("Recieved "+results.length+" movies via AJAX.");
      this.reset(results);
      
      // Updating facet counts
      var facets = AJAXquery.responseJSON['facets'];
      console.log("Recieved "+facets.length+" facet section via AJAX.");
      app.trigger('got_new_facet_counts', facets);
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
      app.trigger('filter_update', true);
    }

  });
  
  // ------------------------ define application view ------------------------
  
  app.AppView = Backbone.View.extend({
    el: $("#movie_index"),
  
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

  // ------------------------ define pagination bar ------------------------
  
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
  })
  
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
  })
  
  // ------------------------ define query dispatcher ------------------------
  
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
      {'name': 'Fantasy/Sci-Fi', 'value': 2},
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
  var PageBar = new app.PaginatorView();
  var CinemaFilters = new app.FilterSectionView(filters);
    
  var CinemaDB = new app.AppView();
  var SearchBar = new app.Search();
  var dispatcher = new app.EventDispatcher(CinemaDB, CinemaFilters, SearchBar, PageBar);
  CinemaDB.render();
});
