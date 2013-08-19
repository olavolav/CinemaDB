class Movie < ActiveRecord::Base
  attr_accessible :description, :image_url, :title, :year, :category_id
  
  has_many :ratings, :dependent => :destroy
  has_many :users_that_rated, :through => :ratings, :source => :user
  
  validates_presence_of :title, :image_url
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
