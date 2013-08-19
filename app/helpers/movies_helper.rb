module MoviesHelper
  
  def category_options_array
    # Collect an array of names and ids of categories for the dropdown box in forms
    return Category.possible_categories.collect{ |c| [c.to_s, c.to_i] }
  end
  
  def score_class_stars(sc)
    return "\u2605"*sc.to_i + "\u2606"*(5 - sc.to_i)
  end
  
end
