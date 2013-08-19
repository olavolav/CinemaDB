class RatingsController < ApplicationController
  
  before_filter :you_need_to_be_logged_in
  
  def change
    movie_id = params[:movie].to_i
    score = params[:score].to_i
    
    # See if such a Rating already exists (can be only 1)
    rating = Rating.where(:user_id => current_user.id, :movie_id => movie_id).first
    if rating.nil?
      # If no such rating exists, create it
      rating = Rating.new
      rating.user = current_user
      rating.movie_id = movie_id
    end
    rating.score = score
    
    unless rating.save
      logger.warn "Invalid change rating request."
    end
    
    # Here we do not give a response, since doing so would reveal which user ids exist
    render :nothing => true, :status => :ok
  end
  
end
