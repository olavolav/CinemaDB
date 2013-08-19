CinemaDB::Application.routes.draw do
  
  get 'movies/search'
  resources :movies
  
  root :to => 'movies#index'
  
end
