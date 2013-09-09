require 'test_helper'
# require 'helpers/movies_integration_test_helper.rb'
# require 'integration_test_helper' 

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
    page.execute_script submit_search_form_script
  
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal 1, page.all('.movie').length, "Should display only one movie"
  end
  
  test 'should apply a filter to the movie selection' do
    visit('/')
    page.execute_script click_on_filter_script('year', 2012)
    
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal 1, page.all('.movie').length, "Should display only one movie"
  end
  
  test 'should apply multiple filters to the movie selection' do
    visit('/')
    page.execute_script click_on_filter_script('year', 2013)
    page.execute_script click_on_filter_script('category', 4)
    
    assert_equal 0, page.all('.movie').length, "Should display only one movie"
  end
  
  test 'should use pagination' do
    visit('/')
    # 1. Go forward
    page.execute_script click_on_pagination_script('next')
    assert page.has_selector?('.movie'), "Should display at least one movie"
    # Here we assume that we have some movies on the second page, but that it is not full
    assert_equal (Movie.count - 10), page.all('.movie').length, "Should display movies on second page"

    # 1. Go backward
    page.execute_script click_on_pagination_script(0)
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal [Movie.count, 10].min, page.all('.movie').length, "Should display movies on first page again"
  end
  
  test 'should reset pagaination when using new filters' do
    visit('/')
    page.execute_script click_on_pagination_script('next')
    page.execute_script click_on_filter_script('year', 2013)
    page.execute_script click_on_filter_script('year', -1)
    assert page.has_selector?('.movie'), "Should display at least one movie"
    assert_equal [Movie.count, 10].min, page.all('.movie').length, "Should display all movies again (first page)"
  end
  
  
  
  # --- helper methods ---
  
  def click_on_filter_script(type,id)
    return "$('#movie_filters li[data-key=#{type}][data-id=#{id}]').trigger('click');"
  end

  def submit_search_form_script
    return "$('#search_filter_input').submit();"
  end
  
  def click_on_pagination_script(id)
    return "$('#pagination-list li[data-id=#{id}]').trigger('click');"
  end
  
  
end