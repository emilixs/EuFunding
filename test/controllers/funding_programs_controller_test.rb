require "test_helper"

class FundingProgramsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get funding_programs_show_url
    assert_response :success
  end
end
