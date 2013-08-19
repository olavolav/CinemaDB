require 'test_helper'

class RatingTest < ActiveSupport::TestCase
  
  test "should create a valid rating" do
    r = Rating.new
    r.movie = movies(:StarWars)
    r.user = users(:Charlie)
    r.score = 4
    assert r.save
  end
  
end
