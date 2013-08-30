class UsersController < ApplicationController
  
  before_filter :you_need_to_be_logged_in, :only => :show
  
  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user }
    end
  end
  
  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      # When creating a valid user, we have you logged in automatically
      session[:user_id] = @user.id
      redirect_to :home #, :notice => "Signed up!"
    else
      render "new"
    end
  end
  
end
