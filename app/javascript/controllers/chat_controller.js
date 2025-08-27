import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chat"
export default class extends Controller {
  static targets = ["input", "sendButton", "buttonText", "spinner"]
  static values = { programId: Number, companyId: Number }

  connect() {
    console.log("Chat controller connected")
  }

  sendMessage() {
    const message = this.inputTarget.value.trim()
    
    if (!message) {
      return
    }

    this.showLoading()
    this.addUserMessage(message)
    this.inputTarget.value = ""

    // Send message to server
    fetch(`/funding_programs/${this.programIdValue}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content
      },
      body: JSON.stringify({
        message: message,
        company_id: this.companyIdValue
      })
    })
    .then(response => response.json())
    .then(data => {
      this.hideLoading()
      
      if (data.error) {
        this.addErrorMessage(data.error)
      } else {
        this.addAiMessage(data.ai_response, data.timestamp)
      }
    })
    .catch(error => {
      this.hideLoading()
      console.error("Chat error:", error)
      this.addErrorMessage("Sorry, something went wrong. Please try again.")
    })
  }

  fillInput(event) {
    const question = event.target.dataset.question
    this.inputTarget.value = question
    this.inputTarget.focus()
  }

  addUserMessage(message) {
    const chatMessages = document.getElementById("chat-messages")
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    
    const userMessageHTML = `
      <div class="chat chat-end">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center text-sm">
            👤
          </div>
        </div>
        <div class="chat-bubble chat-bubble-primary">
          ${this.escapeHtml(message)}
        </div>
        <div class="chat-footer opacity-50 text-xs">
          You • ${timestamp}
        </div>
      </div>
    `
    
    chatMessages.insertAdjacentHTML("beforeend", userMessageHTML)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  addAiMessage(message, timestamp) {
    const chatMessages = document.getElementById("chat-messages")
    
    const aiMessageHTML = `
      <div class="chat chat-start">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm">
            🤖
          </div>
        </div>
        <div class="chat-bubble">
          ${this.formatMessage(message)}
        </div>
        <div class="chat-footer opacity-50 text-xs">
          AI Assistant • ${timestamp || 'now'}
        </div>
      </div>
    `
    
    chatMessages.insertAdjacentHTML("beforeend", aiMessageHTML)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  addErrorMessage(error) {
    const chatMessages = document.getElementById("chat-messages")
    
    const errorMessageHTML = `
      <div class="chat chat-start">
        <div class="chat-image avatar">
          <div class="w-10 rounded-full bg-error text-error-content flex items-center justify-center text-sm">
            ⚠️
          </div>
        </div>
        <div class="chat-bubble chat-bubble-error">
          ${this.escapeHtml(error)}
        </div>
        <div class="chat-footer opacity-50 text-xs">
          System • Error
        </div>
      </div>
    `
    
    chatMessages.insertAdjacentHTML("beforeend", errorMessageHTML)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  showLoading() {
    this.sendButtonTarget.disabled = true
    this.buttonTextTarget.textContent = "Sending..."
    this.spinnerTarget.classList.remove("hidden")
  }

  hideLoading() {
    this.sendButtonTarget.disabled = false
    this.buttonTextTarget.textContent = "Send"
    this.spinnerTarget.classList.add("hidden")
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  formatMessage(text) {
    // Simple markdown-like formatting
    return this.escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }
}
