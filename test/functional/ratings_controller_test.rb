require 'test_helper'

class RatingsControllerTest < ActionController::TestCase
  
  setup do
    @rating = ratings(:DavidHatesLifeOfPi)
  end
  
  
  test "should create a rating" do
    login_as :Charlie
    
    assert_difference('Rating.count', 1) do
      post :change, :movie => movies(:StarWars).id, :score => 3
    end
  end
  
end
