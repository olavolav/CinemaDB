require 'test_helper'

class UserTest < ActiveSupport::TestCase
  
  # teardown :reset_elasticsearch_db

  test "should create a user object" do
    user = users(:David)
    assert user.valid?
  end

  test "should refuse to create a duplicate user object" do
    user = users(:David).dup
    user.password_digest = 'something else than what David had'
    assert user.invalid?
  end

end
