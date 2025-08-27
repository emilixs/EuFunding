require "test_helper"

class CompaniesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get companies_create_url
    assert_response :success
  end

  test "should get show" do
    get companies_show_url
    assert_response :success
  end
end
