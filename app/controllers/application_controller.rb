class ApplicationController < ActionController::Base
  protect_from_forgery
  
  private
  
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  
  helper_method :current_user
  
  protected
  
  def you_need_to_be_logged_in
    unless current_user
      redirect_to :home, :notice => 'Sorry, for this you need to be logged in.'
    end
  end
  
end