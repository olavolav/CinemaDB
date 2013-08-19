require 'test_helper'

class UserTest < ActiveSupport::TestCase

  test "should create a user object" do
    user = users(:David)
    assert user.valid?
  end

  test "should refuse to create a duplicate user object" do
    user = users(:David).dup
    user.password_digest = 'something else than what David had'
    assert_equal false, user.valid?
  end

end
