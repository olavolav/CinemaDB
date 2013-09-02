ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'capybara/rails'
# require 'capybara/poltergeist'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all
  
  
  def login_as(username)
    session[:user_id] = users(username).id
  end
  
  def reset_elasticsearch_db
    Movie.index.delete
    Movie.tire.index.create(:mappings => Movie.tire.mapping_to_hash, :settings => Movie.tire.settings)
    # Update all movies in fixtures such that they are actually in elasticsearch
    Movie.all.each do |m|
      m.touch
      m.save
    end
    Movie.tire.index.refresh
  end
  
end

class ActionDispatch::IntegrationTest
  # Make the Capybara DSL available in all integration tests
  include Capybara::DSL
end
