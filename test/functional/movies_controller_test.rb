require 'test_helper'

class MoviesControllerTest < ActionController::TestCase
  setup do
    @movie = movies(:LifeOfPi)
  end
  
  # teardown :reset_elasticsearch_db
  
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
end
