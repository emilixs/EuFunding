import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["companyRules", "projectRules", "combinedRules"]
  
  connect() {
    console.log("Eligibility extractor controller connected")
  }

  async extractRules(event) {
    const content = event.target.value.trim()
    
    // Only extract if there's substantial content (more than 500 characters)
    if (content.length < 500) {
      return
    }

    // Show loading indicator
    this.showLoading(true)
    
    try {
      // Call our Rails endpoint to extract eligibility rules using Claude
      const response = await fetch('/admin/extract_eligibility_rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify({
          content: content
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update the separate rule fields
        if (data.company_rules) {
          this.companyRulesTarget.value = data.company_rules
        }
        
        if (data.project_rules) {
          this.projectRulesTarget.value = data.project_rules
        }
        
        // Update combined rules for backward compatibility
        const combinedRules = [data.company_rules, data.project_rules].filter(Boolean).join('\n\n')
        this.combinedRulesTarget.value = combinedRules
        
        // Show success message
        this.showSuccess("✅ Eligibility rules extracted successfully!")
        
      } else {
        console.error('Failed to extract rules:', response.statusText)
        this.showError("Failed to extract eligibility rules")
      }
    } catch (error) {
      console.error('Error extracting rules:', error)
      this.showError("Error processing content")
    }
    
    this.showLoading(false)
  }

  showLoading(show) {
    // Simple loading indication - could be enhanced with a proper spinner
    const label = document.querySelector('label[for="funding_program_pdf_content"] .label-text-alt')
    if (label) {
      if (show) {
        label.textContent = "🔄 AI is extracting eligibility rules..."
      } else {
        label.textContent = "Paste PDF content here - AI will automatically extract eligibility rules below"
      }
    }
  }

  showSuccess(message) {
    // Create a temporary success toast
    const toast = document.createElement('div')
    toast.className = 'toast toast-top toast-end'
    toast.innerHTML = `
      <div class="alert alert-success">
        <span>${message}</span>
      </div>
    `
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  showError(message) {
    // Create a temporary error toast
    const toast = document.createElement('div')
    toast.className = 'toast toast-top toast-end'
    toast.innerHTML = `
      <div class="alert alert-error">
        <span>❌ ${message}</span>
      </div>
    `
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 5000)
  }

  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  }
}