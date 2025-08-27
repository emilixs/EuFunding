class ChatsController < ApplicationController
  def show
    @program = FundingProgram.find(params[:id])
    @company = Company.find(params[:company_id])

    # Initialize empty chat history for display
    @messages = []
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "Program or company not found"
    redirect_to root_path
  end

  def create
    @program = FundingProgram.find(params[:id])
    @company = Company.find(params[:company_id])
    message = params[:message]&.strip

    if message.blank?
      render json: { error: "Message cannot be empty" }, status: 422
      return
    end

    # Get AI response
    ai_response = ChatService.ask(@program, @company, message)

    # For MVP, we'll just return the response without storing chat history
    render json: {
      user_message: message,
      ai_response: ai_response,
      timestamp: Time.current.strftime("%H:%M")
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Program or company not found" }, status: 404
  rescue => e
    render json: { error: "Something went wrong: #{e.message}" }, status: 500
  end
end
