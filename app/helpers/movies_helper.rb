module MoviesHelper
  
  def category_options_array
    # Collect an array of names and ids of categories for the dropdown box in forms
    return Category.possible_categories.collect{ |c| [c.to_s, c.to_i] }
  end
  
end
