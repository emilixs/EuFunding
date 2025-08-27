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

    # Check eligibility for all active programs (no caching - always fresh results)
    @eligible_programs = []
    @ineligible_programs = []

    FundingProgram.active.each do |program|
      # Always run fresh eligibility check
      Rails.logger.info "[CompaniesController] Running fresh eligibility check for company #{@company.id}, program #{program.id}"
      result = EligibilityChecker.check(@company, program)

      # Remove any existing check for this company-program combination
      CompanyProgramCheck.where(company: @company, funding_program: program).destroy_all

      # Create a new check record for this request
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

    redirect_to company_path(@company)
  end

  def show
    @company = Company.find(params[:id])

    # Get the most recent eligibility check for each program
    checks = CompanyProgramCheck.includes(:funding_program)
                               .where(company: @company)
                               .order(created_at: :desc)
                               .group_by(&:funding_program_id)
                               .map { |_, program_checks| program_checks.first }

    @eligible_programs = checks.select(&:eligible).map { |check|
      { program: check.funding_program, check: check }
    }

    @ineligible_programs = checks.reject(&:eligible).map { |check|
      { program: check.funding_program, check: check }
    }
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "Company not found"
    redirect_to root_path
  end
end
