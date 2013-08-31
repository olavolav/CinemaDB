require 'test_helper'

class RatingTest < ActiveSupport::TestCase
  
  # teardown :reset_elasticsearch_db
  
  test "should create a valid rating" do
    r = Rating.new
    r.movie = movies(:StarWars)
    r.user = users(:Charlie)
    r.score = 4
    assert r.save
  end
  
  test "should compute and save a cached score_class variable" do
    movie = movies(:LifeOfPi)
    assert_nil movie.score_class, "Should not have a cached score_class initially (depends on fixtures)"
    
    ratings = Rating.where(:movie_id => movie)
    # update one of the ratings
    r1 = ratings.first
    r1.touch
    r1.save
    movie.reload # refresh movie from db
    sum = ratings.inject(0.0) { |result, r| result + r.to_f }
    supposed_rating = (sum / ratings.size).round
    assert_equal supposed_rating, movie.dynamical_score_class, "Should yield dynamical score_class"
    assert_equal supposed_rating, movie.score_class, "Should have computed the score_class"
  end
  
  
end
