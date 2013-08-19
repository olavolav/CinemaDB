class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to :home, :notice => "Logged in!"
    else
      # flash[:notice] = "Invalid email or password"
      # redirect_to new
      redirect_to :login, :notice => "Invalid email or password"
    end
  end
  
  def destroy
    session[:user_id] = nil
    redirect_to root_url, :notice => "Logged out!"
  end
end