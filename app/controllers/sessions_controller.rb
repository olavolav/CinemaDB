class SessionsController < ApplicationController
  
  before_filter :you_need_to_be_logged_in, :only => :destroy
  
  
  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to :home #, :notice => "Logged in!"
    else
      redirect_to :login, :notice => "Invalid email or password"
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to :home
  end
end