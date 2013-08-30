class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation
  
  has_secure_password
  
  has_many :ratings, :dependent => :destroy
  has_many :rated_movies, :through => :ratings, :source => :movie
  
  validates_presence_of :password, :on => :create
  validates_uniqueness_of :email
  
  def collected_ratings(movies)
    r = Rating.where(:user_id => id, :movie_id => movies.to_a).select([:movie_id, :score])
    return r.collect{ |ra| ra.attributes }
  end
  
end
