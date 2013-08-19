require 'test_helper'

class MovieTest < ActiveSupport::TestCase
  
  test "should create a valid movie object" do
    m = movies(:LifeOfPi)
    assert m.valid?
  end

  test "should refuse to create a movie of the future" do
    life_of_pi_2 = movies(:LifeOfPi)
    life_of_pi_2.year = Time.now.year + 1
    assert life_of_pi_2.invalid?
  end
  
  test "should refuse to create a movie with invalid category" do
    m = movies(:LifeOfPi)
    m.category_id = -2
    assert m.invalid?
    
    m.category_id = Category.possible_categories.length
    assert m.invalid?
  end
  
end
