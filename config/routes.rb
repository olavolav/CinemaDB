CinemaDB::Application.routes.draw do
  
  get "logout" => "sessions#destroy", :as => :logout
  get "login" => "sessions#new", :as => :login
  get "signup" => "users#new", :as => :signup
  
  resources :sessions
  
  resources :movies, :users
  
  root :to => 'movies#index', :as => :home
  
end
