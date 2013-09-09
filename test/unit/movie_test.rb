require 'test_helper'

class MovieTest < ActiveSupport::TestCase
  
  fixtures :movies
  
  setup :reset_elasticsearch_db
  
  test "should create a valid movie object" do
    m = movies(:LifeOfPi)
    assert m.valid?
  end

  test "should refuse to create a movie of the future" do
    life_of_pi_2 = movies(:LifeOfPi)
    life_of_pi_2.year = Time.now.year + 1
    assert life_of_pi_2.invalid?
  end
  
  test "should refuse to create a movie with invalid category id" do
    m = movies(:LifeOfPi)
    m.category_id = -2
    assert m.invalid?
    
    m.category_id = Category.possible_categories.length
    assert m.invalid?
  end
  
  test "should refuse to create a movie with invalid category object" do
    m = movies(:LifeOfPi)
    m.category_id = Category.new(-2)
    assert m.invalid?
  end
  
  test "should search using elasticsearch" do
    s = Movie.search("tiger") # should only yield 'Life of Pi'
    assert_equal 1, s.results.length
  end
  
  test "should change category correctly when changing id" do
    m = movies(:LifeOfPi)
    new_category_id = (m.category_id + 1) % Category.possible_categories.length
    m.category_id = new_category_id
    assert_equal Category.new(new_category_id), m.category
    
    # Repeat the whole process, since now a cat. object is cached
    new_category_id = (m.category_id + 1) % Category.possible_categories.length
    m.category_id = new_category_id
    assert_equal Category.new(new_category_id), m.category
  end
  
  test "should change category correctly when changing object" do
    m = movies(:LifeOfPi)
    new_category_id = (m.category_id + 1) % Category.possible_categories.length
    cat = Category.new(new_category_id)
    m.category = cat
    assert_equal new_category_id, m.category_id
    
    # Repeat the whole process, since now a cat. object is cached
    new_category_id = (m.category_id + 1) % Category.possible_categories.length
    cat = Category.new(new_category_id)
    m.category = cat
    assert_equal new_category_id, m.category_id
  end
  
end
