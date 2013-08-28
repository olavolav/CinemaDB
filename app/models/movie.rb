class Movie < ActiveRecord::Base
  include Tire::Model::Search
  include Tire::Model::Callbacks
  index_name "#{Tire::Model::Search.index_prefix}movies"
  
  # Use dynamic mapping, for now
  # mapping do
  #   indexes :id,           :index    => :not_analyzed
  #   indexes :title,        :analyzer => 'snowball', :boost => 100
  #   indexes :description,  :analyzer => 'snowball'
  #   indexes :year
  #   indexes :score_class
  # end
  
  attr_accessible :description, :image_url, :title, :year, :category_id
  
  has_many :ratings, :dependent => :destroy
  has_many :users_that_rated, :through => :ratings, :source => :user
  
  validates_presence_of :title
  validates_uniqueness_of :title
  validate :year_is_valid?
  validate :category_is_valid?
  
  
  def category
    return Category.new(category_id)
  end
  
  def average_score
    # Since the ratings are between 1 and 5, and average of zero indicates
    # no ratings yet for this movie.
    avg = self.ratings.average(:score).to_f
    return nil if avg < 0.5
    return avg
  end
  
  def dynamical_score_class
    avg = average_score
    return ( avg.nil? ? nil : avg.round )
  end
  
  # With score_class we mean the rounded average rating between 1 and 5 (or nil for no ratings)
  # The fn. dynamical_score_class calculates the current value, but to be able to search for
  # this value efficiently, we need to store the consolidated integer value in the database.
  # Effectively this also serves as a caching mechanism, which would be needed anyway as the
  # database grows.
  def bring_score_class_up_to_date
    score_class_right_now = self.dynamical_score_class
    if score_class_right_now != self.score_class
      logger.debug("Updating score class of Movie '#{title}' to: #{score_class_right_now}")
      self.score_class = score_class_right_now
      self.save
    end
  end
  
  def self.search(contains_string="", in_year=-1, in_category=-1, in_score_class=-1, page=0)
    tire.search(:load => true) do
      size 10 # Limit number of records retrieved
      from page.to_i*10 # Start offset
      
      # Convert to usable format
      t = contains_string.to_s.strip
      y = in_year.to_i
      c = in_category.to_i
      s = in_score_class.to_i
      
      # Look for query string
      unless t.blank?
        query do
          string t
        end
      end
      
      # Apply filters to search query, if corresponding values were supplied
      filter :query, :match => {:year => y}         if y > 0
      filter :query, :match => {:category_id => c}  if c >= 0
      filter :query, :match => {:score_class => s}  if s > 0
      
      # Define facet counts that we are interested in for the front-end
      facet 'current_years' do
        terms :year
      end
      facet 'current_categories' do
        terms :category_id
      end
      facet 'current_scores' do
        terms :score_class
      end
    end
  end
  
  private
  
  def year_is_valid?
    if year.nil? or year.to_s.strip.blank?
      errors.add(:year, "is empty or invalid")
    elsif year.to_i < 1888
      # Source for the beginning of movie history: http://en.wikipedia.org/wiki/History_of_film
      errors.add(:year, "is too early, movies did not even exist back then :-)")
    elsif year.to_i > Time.now.year
      # Let's say we only accept movies that are already in cinemas, i.e. the year
      # cannot be in the future.
      errors.add(:year, "cannot be in the future")
    end
  end
  
  def category_is_valid?
    unless category.is_valid?
      errors.add(:category_id, "is not a valid category")
    end
  end
    
end
