# EU Funding Platform MVP - Task List

## Phase 1: Project Setup ✅

### Task 1: Install Dependencies
- [ ] Add `ruby_llm` gem to Gemfile
- [ ] Add `faraday` gem to Gemfile  
- [ ] Add `tailwindcss-rails` gem to Gemfile
- [ ] Run `bundle install`
- [ ] Run `rails tailwindcss:install`
- [ ] Install DaisyUI via npm: `npm install daisyui`
- [ ] Configure DaisyUI in tailwind.config.js

### Task 2: Configure Credentials
- [ ] Run `EDITOR=nano rails credentials:edit`
- [ ] Add `lista_firme_key: "your-api-key"`
- [ ] Add `anthropic_api_key: "your-claude-key"`  
- [ ] Add `admin_password: "simple-password"`
- [ ] Save and close

## Phase 2: Database & Models 📊

### Task 3: Generate Models
- [ ] Run `rails g model Company cui:string api_response:json`
- [ ] Run `rails g model FundingProgram title:string description:text pdf_content:text eligibility_rules:text active:boolean`
- [ ] Run `rails g model CompanyProgramCheck company:references funding_program:references eligible:boolean ai_response:text`
- [ ] Run `rails db:create`
- [ ] Run `rails db:migrate`

### Task 4: Add Model Validations
- [ ] Add `validates :cui, presence: true, uniqueness: true` to Company model
- [ ] Add `validates :title, presence: true` to FundingProgram model
- [ ] Add associations between models

## Phase 3: External API Integration 🔌

### Task 5: Create ListaFirme Service
- [ ] Create `app/services/lista_firme_client.rb`
- [ ] Implement `fetch(cui)` method with Faraday POST request
- [ ] Add error handling for API failures
- [ ] Test with a real CUI in rails console

### Task 6: Configure RubyLLM
- [ ] Create initializer `config/initializers/ruby_llm.rb`
- [ ] Configure with Anthropic API key
- [ ] Test connection in rails console

## Phase 4: Core Business Logic 🧠

### Task 7: Create Eligibility Checker Service
- [ ] Create `app/services/eligibility_checker.rb`
- [ ] Implement `check(company, program)` method
- [ ] Write simple prompt template for eligibility checking
- [ ] Return YES/NO with explanation

### Task 8: Create Chat Service
- [ ] Create `app/services/chat_service.rb`
- [ ] Implement context building from program PDF and company data
- [ ] Setup conversation handling with RubyLLM

## Phase 5: Controllers 🎮

### Task 9: Create Home Controller
- [ ] Run `rails g controller Home index`
- [ ] Set root route to `home#index`
- [ ] Add CUI input form

### Task 10: Create Companies Controller
- [ ] Run `rails g controller Companies create show`
- [ ] Implement `create` action to fetch company data
- [ ] Check eligibility for all active programs
- [ ] Display results in `show` view

### Task 11: Create Chats Controller
- [ ] Run `rails g controller Chats show create`
- [ ] Implement chat interface for program consultation
- [ ] Handle AJAX requests for chat messages

### Task 12: Create Admin Controllers
- [ ] Run `rails g controller Admin::FundingPrograms index new create edit update`
- [ ] Add HTTP basic authentication
- [ ] Implement CRUD for funding programs
- [ ] Add simple PDF upload and text extraction

## Phase 6: Views & UI 🎨

### Task 13: Create Layout
- [ ] Update `app/views/layouts/application.html.erb`
- [ ] Add DaisyUI navbar component
- [ ] Add footer with basic info
- [ ] Setup responsive container

### Task 14: Build Home Page
- [ ] Create hero section with title
- [ ] Add CUI input form with DaisyUI styling
- [ ] Add submit button
- [ ] Add loading state indicator

### Task 15: Build Results Page
- [ ] Display company name and basic info
- [ ] Show eligible programs as cards
- [ ] Add "Chat with AI" button for each program
- [ ] Show "No eligible programs" message when empty

### Task 16: Build Chat Interface
- [ ] Create chat container with messages area
- [ ] Add message input field
- [ ] Implement Stimulus controller for chat functionality
- [ ] Style messages with DaisyUI chat bubbles

### Task 17: Build Admin Pages
- [ ] Create funding programs list page
- [ ] Add "New Program" form with file upload
- [ ] Style with DaisyUI table and form components
- [ ] Add edit/delete actions

## Phase 7: Routes Configuration 🛤️

### Task 18: Setup Routes
- [ ] Configure root route
- [ ] Add company check route
- [ ] Add chat routes (show/create)
- [ ] Add admin namespace with funding programs resources
- [ ] Add admin login route

## Phase 8: Stimulus Controllers (Interactive UI) ⚡

### Task 19: Create Chat Controller
- [ ] Generate Stimulus controller: `rails g stimulus chat`
- [ ] Implement message sending via AJAX
- [ ] Handle response display
- [ ] Add loading states

### Task 20: Create Form Controller
- [ ] Generate Stimulus controller: `rails g stimulus form`
- [ ] Add CUI validation (Romanian format)
- [ ] Show loading spinner during API call
- [ ] Handle errors gracefully

## Phase 9: Basic Styling 🎨

### Task 21: Apply DaisyUI Theme
- [insky: Set theme in tailwind.config.js
- [ ] Apply consistent spacing and typography
- [ ] Ensure mobile responsiveness
- [ ] Add loading skeletons

## Phase 10: Testing & Polish 🧪

### Task 22: Manual Testing
- [ ] Test CUI lookup with valid/invalid CUIs
- [ ] Test eligibility checking for multiple programs
- [ ] Test chat functionality
- [ ] Test admin CRUD operations

### Task 23: Error Handling
- [ ] Add error pages (404, 500)
- [ ] Handle API timeout/failures
- [ ] Show user-friendly error messages
- [ ] Add form validations

### Task 24: Data Seeding
- [ ] Create `db/seeds.rb` with sample funding programs
- [ ] Add example eligibility rules
- [ ] Run `rails db:seed`

## Phase 11: Deployment Prep 🚀

### Task 25: Environment Setup
- [ ] Update `config/database.yml` for production
- [ ] Configure production credentials
- [ ] Test in production mode locally
- [ ] Add `Procfile` if deploying to Heroku/Render

### Task 26: Final Checks
- [ ] Run `bundle exec rubocop` and fix issues
- [ ] Check all environment variables are set
- [ ] Verify API keys are working
- [ ] Test full user flow end-to-end

## Quick Reference Commands 📝

```bash
# Start development
rails server

# Rails console for testing
rails console

# View routes
rails routes

# Reset database
rails db:reset

# Check logs
tail -f log/development.log
```

## Time Estimates ⏱️

- **Phase 1-2:** 2-3 hours (Setup)
- **Phase 3-4:** 3-4 hours (APIs)
- **Phase 5-6:** 4-5 hours (Controllers & Views)
- **Phase 7-9:** 3-4 hours (Routes & UI)
- **Phase 10-11:** 2-3 hours (Testing & Deploy)

**Total: ~15-20 hours of focused work**

## Priority Order 🎯

1. **Must Have** (Day 1-2)
   - Tasks 1-10: Basic functionality working

2. **Should Have** (Day 3-4)
   - Tasks 11-17: UI and Admin

3. **Nice to Have** (Day 5)
   - Tasks 18-26: Polish and deployment

---

✅ Check off tasks as you complete them!