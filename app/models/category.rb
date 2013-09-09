class Category
  # Category is a value object for the gernre of a movie. It is persisted only using
  # the category_id object of a Movie object.
  
  attr_reader :index
  
  def initialize(i)
    # We will accept invalid arguments here and only test the index when validating
    # the associated Movie object to mirror ActiveRecord behavior for persisted
    # objects.
    # unless Category.possible_category_ids.include? i.to_i
    #   raise ArgumentError, "#{i} is an invalid category."
    # end
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
    return self.to_i == other.to_i
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