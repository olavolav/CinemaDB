class UsersController < ApplicationController
  
  before_filter :you_need_to_be_logged_in, :only => :show
  
  def add
    
  end
  
end
