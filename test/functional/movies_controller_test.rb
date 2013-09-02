require 'test_helper'

class MoviesControllerTest < ActionController::TestCase
  
  setup do
    @movie = movies(:LifeOfPi)
  end
  
  teardown :reset_elasticsearch_db
  
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:movies)
  end

  test "should get new" do
    login_as :Charlie
    get :new
    assert_response :success
  end

  test "should create movie" do
    login_as :Charlie
    assert_difference('Movie.count') do
      post :create, movie: { description: @movie.description, image_url: @movie.image_url, title: @movie.title+" Extended", year: @movie.year }
    end

    assert_redirected_to movie_path(assigns(:movie))
  end

  test "should show movie" do
    get :show, id: @movie
    assert_response :success
  end

  test "should get edit" do
    login_as :Charlie
    get :edit, id: @movie
    assert_response :success
  end

  test "should update movie" do
    login_as :Charlie
    put :update, id: @movie, movie: { description: @movie.description, image_url: @movie.image_url, title: @movie.title, year: @movie.year }
    assert_redirected_to movie_path(assigns(:movie))
  end

  test "should destroy movie" do
    login_as :Charlie
    assert_difference('Movie.count', -1) do
      delete :destroy, id: @movie
    end
    
    assert_redirected_to movies_path
  end

  test "should get list of movies using elasticsearch via HTML" do
    get :search
    assert assigns(:movies)
    assert_response :success
  end

  test "should get list of movies using elasticsearch via JSON" do
    get :search, :format => :json
    response = JSON.parse(@response.body)
    
    assert_equal [10, Movie.count].min, response['results'].length, "Should return all movies"
    assert_response :success
  end
  
  test "should search for movies using elasticsearch" do
    get :search, {:string => "Life", :year => 2012, :format => :json}
    response = JSON.parse(@response.body)
    assert_equal 1, response['results'].length, "Should return only 'Life of Pi'"
    assert_response :success
  end

  test "should search for movies and ignore invalid arguments" do
    get :search, {:string => "Life", :year => '-12dsade', :category => 'hello', :format => :json}
    response = JSON.parse(@response.body)
    assert_equal 1, response['results'].length, "Should return only 'Life of Pi'"
    assert_response :success
  end
  
end
