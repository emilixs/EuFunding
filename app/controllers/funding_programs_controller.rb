class FundingProgramsController < ApplicationController
  def show
    @funding_program = FundingProgram.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "Funding program not found"
    redirect_to root_path
  end
end
