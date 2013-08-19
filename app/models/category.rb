class Category
  
  attr_reader :index
  
  def initialize(i)
    @index = i.to_i
  end
  
  def to_s
    return @@MOVIE_CATEGORIES[@index] || 'undefined'
  end
  
  def to_i
    return @index
  end
  
  def self.possible_categories
    return self.possible_category_ids.collect { |i| Category.new(i) }
  end
  
  def is_valid?
    return Category.possible_category_ids.include?(@index)
  end
  
  def ==(other)
    return self.to_s == other.to_s
  end
  
  private
  
  @@MOVIE_CATEGORIES = ['Action', 'Drama', 'Fantasy & Sci-Fi', 'Comedy', 'Horror']
  
  def self.possible_category_names
    return @@MOVIE_CATEGORIES
  end
  
  def self.possible_category_ids
    return (0...@@MOVIE_CATEGORIES.length).to_a
  end
  
end