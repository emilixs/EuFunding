require "test_helper"

class Admin::FundingProgramsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_funding_programs_index_url
    assert_response :success
  end

  test "should get new" do
    get admin_funding_programs_new_url
    assert_response :success
  end

  test "should get create" do
    get admin_funding_programs_create_url
    assert_response :success
  end

  test "should get edit" do
    get admin_funding_programs_edit_url
    assert_response :success
  end

  test "should get update" do
    get admin_funding_programs_update_url
    assert_response :success
  end

  test "should get show" do
    get admin_funding_programs_show_url
    assert_response :success
  end
end
