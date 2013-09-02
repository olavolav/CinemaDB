require 'test_helper'

class MoviesIntegrationTest < ActionDispatch::IntegrationTest
  
  fixtures :all
  
  setup do
    Capybara.current_driver = :selenium
    # Capybara.javascript_driver = :poltergeist
  end
  
  teardown :reset_elasticsearch_db
  
  
  test 'shows movie index with all movies' do
    visit('/')
    assert page.has_selector? '#movie_index', "Should have movie_index class on page" 
    assert page.has_selector?('.movie'), "Should display at least one filter"
    assert page.has_selector?('.pagination li a'), "Should display at least one pagination button"
    
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal [Movie.count, 10].min, page.all('.movie').length, "Should display all movies"
  end
  
  test 'should apply search field to movie selection' do
    visit('/')
    
    fill_in 'search_filter_input', :with => 'Life'
    page.execute_script("$('#search_filter_input').submit();")
  
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal 1, page.all('.movie').length, "Should display only one movie"
  end
  
  test 'should apply a filter to the movie selection' do
    visit('/')
    
    page.execute_script("$('#movie_filters li[data-key=year][data-id=2013]').trigger('click');")
    
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal 1, page.all('.movie').length, "Should display only one movie"
  end
  
  test 'should apply multiple filters to the movie selection' do
    visit('/')
    
    page.execute_script("$('#movie_filters li[data-key=year][data-id=2013]').trigger('click'); $('#movie_filters li[data-key=category][data-id=4]').trigger('click');")
    
    assert_equal 0, page.all('.movie').length, "Should display only one movie"
  end
  
end