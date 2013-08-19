class User < ActiveRecord::Base
  attr_accessible :email, :password, :password_confirmation
  
  has_secure_password
  
  has_many :ratings, :dependent => :destroy
  has_many :rated_movies, :through => :ratings, :source => :movie
  
  validates_presence_of :password, :on => :create
  validates_uniqueness_of :email
end
