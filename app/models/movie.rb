class Movie < ActiveRecord::Base
  attr_accessible :description, :image_url, :title, :year
  
  validates_presence_of :title, :image_url
  validates_uniqueness_of :title
  validate :year_is_valid
  
  private
  
  def year_is_valid
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
  
end