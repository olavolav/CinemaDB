CinemaDB::Application.routes.draw do
  
  get "logout" => "sessions#destroy", :as => :logout
  get "login" => "sessions#new", :as => :login
  get "signup" => "users#new", :as => :signup
  resources :sessions, :only => [:new, :create, :destroy]
  resources :users, :only => [:show, :new, :create]
  
  get "movies/search"
  resources :movies
  
  put "ratings/update"
  
  root :to => 'movies#index', :as => :home
  
end
