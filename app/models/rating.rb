class Rating < ActiveRecord::Base
  attr_accessible :score, :user_id, :movie_id
  
  belongs_to :user
  belongs_to :movie
  
  validates_uniqueness_of :movie_id, :scope => :user_id
  validate :score_is_valid?
  validate :user_exists?
  validate :movie_exists?
  
  private
  
  def score_is_valid?
    unless (1..5).include?(score)
      errors.add(:score, "is not a valid score")
    end
  end

  def user_exists?
    unless ( user_id and User.where(:id => user_id).exists? )
      errors.add(:user_id, "is not a vailid user id")
    end
  end
  
  def movie_exists?
    unless ( movie_id and Movie.where(:id => movie_id).exists? )
      errors.add(:movie_id, "is not a vailid movie id")
    end
  end
  
end
