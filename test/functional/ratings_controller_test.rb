require 'test_helper'

class RatingsControllerTest < ActionController::TestCase
  
  setup do
    @rating = ratings(:DavidHatesLifeOfPi)
  end
    
  # teardown :reset_elasticsearch_db
  
  test "should create a rating" do
    login_as :Charlie
    
    assert_difference('Rating.count', 1) do
      post :update, :movie => movies(:StarWars).id, :score => 3
    end
  end
  
  test "should refuse to create a rating when not logged in" do
    # do not: login_as :Charlie
    assert_no_difference('Rating.count') do
      post :update, :movie => movies(:StarWars).id, :score => 3
    end
    assert_response :forbidden
  end
  
  test "should refuse to create an invalid rating (id)" do
    login_as :Charlie
    assert_no_difference('Rating.count') do
      post :update, :movie => -1, :score => 3
    end
    assert_response :bad_request
  end
  
  test "should refuse to create an invalid rating (score)" do
    login_as :Charlie
    assert_no_difference('Rating.count') do
      post :update, :movie => movies(:StarWars).id, :score => 10
    end
    assert_response :bad_request
  end
  
  test "should not create a duplicate rating" do
    login_as :Charlie
    rating = ratings :CharlieLikedLifeOfPi
    assert_no_difference('Rating.count') do
      post :update, :movie => rating.movie_id, :score => rating.score - 1
    end
    assert_response :success
  end
  
end
