class Admin::SessionsController < ApplicationController
  def new
    # Show login form
    redirect_to admin_funding_programs_path if session[:admin_authenticated]
  end

  def create
    username = params[:username]
    password = params[:password]

    # Check credentials
    if username == "admin" && password == (Rails.application.credentials.admin_password || "admin123")
      session[:admin_authenticated] = true
      flash[:success] = "Successfully logged in as admin"
      redirect_to admin_funding_programs_path
    else
      flash.now[:error] = "Invalid username or password"
      render :new
    end
  end

  def destroy
    session[:admin_authenticated] = nil
    flash[:success] = "Successfully logged out"
    redirect_to root_path
  end
end
