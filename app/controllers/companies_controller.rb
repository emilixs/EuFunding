class CompaniesController < ApplicationController
  def create
    cui = params[:cui]&.strip

    if cui.blank?
      flash[:error] = "Please enter a valid CUI"
      redirect_to root_path and return
    end

    # Always fetch fresh API data to ensure we have the latest information
    Rails.logger.info "[CompaniesController] Fetching fresh API data for CUI: #{cui}"

    api_response = ListaFirmeClient.fetch(cui)

    if api_response["error"]
      flash[:error] = "Could not fetch company data: #{api_response['error']}"
      redirect_to root_path and return
    end

    # Find existing company or create new one, but always update with fresh API data
    @company = Company.find_by(cui: cui)

    if @company
      Rails.logger.info "[CompaniesController] Updating existing company #{@company.id} with fresh API data"
      @company.update!(api_response: api_response)
    else
      Rails.logger.info "[CompaniesController] Creating new company with fresh API data"
      @company = Company.create!(cui: cui, api_response: api_response)
    end

    # One-time cleanup: Clear all cached results with old model errors
    old_model_checks = CompanyProgramCheck.where("ai_response LIKE ?", "%claude-3-sonnet-20240229%")
    if old_model_checks.exists?
      Rails.logger.info "[CompaniesController] Clearing #{old_model_checks.count} cached results with old model errors"
      old_model_checks.destroy_all
    end

    # Check eligibility for all active programs
    @eligible_programs = []
    @ineligible_programs = []

    FundingProgram.active.each do |program|
      # Check if we already have a result for this company-program combination
      existing_check = CompanyProgramCheck.find_by(company: @company, funding_program: program)

      # Clear cached results that contain the old model error
      if existing_check&.ai_response&.include?("claude-3-sonnet-20240229")
        Rails.logger.info "[CompaniesController] Clearing cached result with old model error for company #{@company.id}, program #{program.id}"
        existing_check.destroy!
        existing_check = nil
      end

      if existing_check
        if existing_check.eligible?
          @eligible_programs << { program: program, check: existing_check }
        else
          @ineligible_programs << { program: program, check: existing_check }
        end
      else
        # Run eligibility check
        result = EligibilityChecker.check(@company, program)

        check = CompanyProgramCheck.create!(
          company: @company,
          funding_program: program,
          eligible: result[:eligible],
          ai_response: result[:reason]
        )

        if result[:eligible]
          @eligible_programs << { program: program, check: check }
        else
          @ineligible_programs << { program: program, check: check }
        end
      end
    end

    redirect_to company_path(@company)
  end

  def show
    @company = Company.find(params[:id])

    # Get all eligibility checks for this company
    checks = CompanyProgramCheck.includes(:funding_program).where(company: @company)

    @eligible_programs = checks.where(eligible: true).map { |check|
      { program: check.funding_program, check: check }
    }

    @ineligible_programs = checks.where(eligible: false).map { |check|
      { program: check.funding_program, check: check }
    }
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "Company not found"
    redirect_to root_path
  end
end
