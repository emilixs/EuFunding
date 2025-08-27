Rails.application.routes.draw do
  root "home#index"

  post "check", to: "companies#create"
  get "companies/:id", to: "companies#show", as: :company

  resources :funding_programs, only: [ :show ] do
    member do
      get "chat", to: "chats#show"
      post "chat", to: "chats#create"
    end
  end

  namespace :admin do
    # Admin root - redirect to funding programs or login
    root "funding_programs#index"

    # Authentication routes
    get "login", to: "sessions#new"
    post "login", to: "sessions#create"
    delete "logout", to: "sessions#destroy"

    resources :funding_programs do
      member do
        delete :destroy
      end
    end

    # AI-powered eligibility rules extraction
    post "extract_eligibility_rules", to: "funding_programs#extract_eligibility_rules"
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check
end
