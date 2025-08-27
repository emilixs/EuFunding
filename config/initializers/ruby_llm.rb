RubyLLM.configure do |config|
  config.anthropic_api_key = Rails.application.credentials.anthropic_api_key || ENV["ANTHROPIC_API_KEY"]
end
