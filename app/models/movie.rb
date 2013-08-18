class Movie < ActiveRecord::Base
  attr_accessible :description, :image_url, :title, :year
  
  validates_presence_of :title, :year, :image_url
  validates_uniqueness_of :title
  validate :year_is_not_in_the_future
  
  private
  
  def year_is_not_in_the_future
    # Let's say we only accept movies that are already in cinemas, i.e. the year
    # cannot be in the future.
    if year > Time.now.year
      errors.add(:year, "cannot be in the future")
    end
  end
  
end
