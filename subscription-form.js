// MTL-Compatible Marketo Form Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get the "Subscribe Now" button
    const openBtn = document.getElementById('openSubscribeForm');
    
    if (openBtn) {
      // Add click event to the button
      openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Subscribe Now button clicked");
        
        // Create and show modal
        showSubscriptionModal();
      });
    }
    
    // Function to create and show the modal
    function showSubscriptionModal() {
      console.log("Creating subscription modal");
      
      // First, add the styles if not already present
      if (!document.getElementById('subscription-modal-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'subscription-modal-styles';
        styleEl.textContent = `
          /* Modal structure */
          .nintex-modal-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }
          .nintex-modal-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            overflow: hidden;
          }
          .nintex-modal-header {
            background-color: #FF6B00;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }
          .nintex-modal-title {
            margin: 0;
            font-weight: 600;
            font-size: 20px;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .nintex-modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 26px;
            cursor: pointer;
            line-height: 1;
            opacity: 0.9;
            transition: all 0.2s ease;
          }
          .nintex-modal-close:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          .nintex-modal-body {
            padding: 25px;
            max-height: 70vh;
            overflow-y: auto;
          }
          
          /* Loading indicator */
          .nintex-loading-spinner {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 107, 0, 0.2);
            border-radius: 50%;
            border-top-color: #FF6B00;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
          .nintex-loading-container {
            text-align: center;
            padding: 30px 20px;
          }
          .nintex-loading-container p {
            color: #555;
            font-size: 16px;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          /* Alert messages */
          .nintex-alert-success {
            text-align: center;
            color: #166534;
            background-color: #DCFCE7;
            border: 1px solid #A7F3D0;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .nintex-alert-error {
            text-align: center;
            color: #991B1B;
            background-color: #FEE2E2;
            border: 1px solid #FECACA;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          /* Marketo form styling */
          #nintex-subscription-modal form.mktoForm {
            width: 100% !important;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
          }
          #nintex-subscription-modal .mktoForm .mktoLabel {
            width: auto !important;
            font-weight: 500 !important;
            color: #333 !important;
            margin-bottom: 5px !important;
          }
          #nintex-subscription-modal .mktoForm .mktoRequiredField label.mktoLabel:after {
            content: " *" !important;
            color: #FF6B00 !important;
          }
          #nintex-subscription-modal .mktoForm .mktoFormRow {
            margin-bottom: 15px !important;
            clear: both !important;
          }
          #nintex-subscription-modal .mktoForm .mktoFieldWrap {
            float: none !important;
            width: 100% !important;
          }
          #nintex-subscription-modal .mktoForm .mktoFormCol {
            float: none !important;
            width: 100% !important;
          }
          #nintex-subscription-modal .mktoForm .mktoOffset {
            display: none !important;
          }
          #nintex-subscription-modal .mktoForm input[type=text],
          #nintex-subscription-modal .mktoForm input[type=email],
          #nintex-subscription-modal .mktoForm input[type=tel],
          #nintex-subscription-modal .mktoForm select {
            width: 100% !important;
            padding: 10px 12px !important;
            font-size: 16px !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            box-shadow: none !important;
            font-family: inherit !important;
            margin-bottom: 5px !important;
            height: auto !important;
          }
          #nintex-subscription-modal .mktoForm input[type=text]:focus,
          #nintex-subscription-modal .mktoForm input[type=email]:focus,
          #nintex-subscription-modal .mktoForm input[type=tel]:focus,
          #nintex-subscription-modal .mktoForm select:focus {
            border-color: #FF6B00 !important;
            outline: none !important;
            box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2) !important;
          }
          #nintex-subscription-modal .mktoForm .mktoButtonWrap {
            margin-left: 0 !important;
          }
          #nintex-subscription-modal .mktoForm .mktoButtonRow {
            width: 100% !important;
            text-align: center !important;
            margin-top: 15px !important;
          }
          #nintex-subscription-modal .mktoForm .mktoButton {
            background-color: #FF6B00 !important;
            background-image: none !important;
            border: none !important;
            color: white !important;
            padding: 12px 24px !important;
            font-weight: 500 !important;
            border-radius: 50px !important;
            font-size: 16px !important;
            transition: all 0.3s ease !important;
            font-family: inherit !important;
            box-shadow: 0 2px 4px rgba(255, 107, 0, 0.2) !important;
            min-width: 140px !important;
            display: inline-block !important;
            text-align: center !important;
          }
          #nintex-subscription-modal .mktoForm .mktoButton:hover {
            background-color: #E56000 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 8px rgba(255, 107, 0, 0.3) !important;
          }
          #nintex-subscription-modal .mktoForm .mktoError {
            right: 0 !important;
            bottom: -30px !important;
            left: 0 !important;
          }
          #nintex-subscription-modal .mktoForm .mktoErrorMsg {
            background-color: #FEE2E2 !important;
            border: 1px solid #FECACA !important;
            color: #991B1B !important;
            box-shadow: none !important;
            text-shadow: none !important;
            font-size: 14px !important;
            margin-top: 5px !important;
          }
          
          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Mobile responsive adjustments */
          @media (max-width: 480px) {
            .nintex-modal-body {
              padding: 15px;
            }
            .nintex-modal-title {
              font-size: 18px;
            }
            #nintex-subscription-modal .mktoForm .mktoButton {
              padding: 10px 20px !important;
              font-size: 14px !important;
              width: 100% !important;
            }
          }
        `;
        document.head.appendChild(styleEl);
      }
      
      // Create the modal HTML
      const modalEl = document.createElement('div');
      modalEl.id = 'nintex-subscription-modal';
      modalEl.innerHTML = `
        <div class="nintex-modal-backdrop"></div>
        <div class="nintex-modal-container">
          <div class="nintex-modal-header">
            <h3 class="nintex-modal-title">Subscribe to Nintex Communications</h3>
            <button type="button" class="nintex-modal-close">&times;</button>
          </div>
          <div class="nintex-modal-body">
            <div class="nintex-loading-container">
              <div class="nintex-loading-spinner"></div>
              <p>Loading subscription form...</p>
            </div>
          </div>
        </div>
      `;
      
      // Append to body
      document.body.appendChild(modalEl);
      
      // Handle close button
      const closeBtn = modalEl.querySelector('.nintex-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          if (modalEl && modalEl.parentNode) {
            modalEl.parentNode.removeChild(modalEl);
          }
        });
      }
      
      // Handle backdrop click
      const backdrop = modalEl.querySelector('.nintex-modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', function() {
          if (modalEl && modalEl.parentNode) {
            modalEl.parentNode.removeChild(modalEl);
          }
        });
      }
      
      // Load Marketo form
      loadMarketoForm();
    }
    
    // Function to load Marketo form
    function loadMarketoForm() {
      console.log("Loading Marketo form");
      
      // If Marketo is already loaded, just initialize the form
      if (typeof MktoForms2 !== 'undefined') {
        initializeForm();
        return;
      }
      
      // Otherwise, load the script first
      const script = document.createElement('script');
      script.src = "//info.nintex.com/js/forms2/js/forms2.min.js";
      
      script.onload = function() {
        console.log("Marketo script loaded successfully");
        initializeForm();
      };
      
      script.onerror = function() {
        console.error("Failed to load Marketo script");
        showError("Failed to load the form. Please try again later.");
      };
      
      document.head.appendChild(script);
    }
    
    // Initialize the form
    function initializeForm() {
      // Get modal body to put form in
      const modalBody = document.querySelector('#nintex-subscription-modal .nintex-modal-body');
      if (!modalBody) {
        console.error("Modal body not found");
        return;
      }
      
      // Create the form container - NO Data references here!
      // This is what was causing the error
      modalBody.innerHTML = `<form id="mktoForm_9147"></form>`;
      
      // Now load the form
      try {
        MktoForms2.loadForm("//info.nintex.com", "272-JVS-996", 9147, function(form) {
          console.log("Form loaded successfully");
          
          // The MTL variables will already be processed by the server
          // and made available as JavaScript variables if you add them to the page
          
          // Check if MTL processed variables exist - IMPORTANT: These should be set by your server
          // before this script runs. They should be properly escaped JavaScript variables.
          if (typeof memberEmail !== 'undefined') {
            try {
              // Set the values in the form using variables that should be set by MTL
              // during server-side template processing
              form.setValues({
                'Email': memberEmail || '',
                'FirstName': memberFirstName || '',
                'LastName': memberLastName || '',
                'PhoneNumber': memberPhoneNumber || '',
                'Country': memberCountry || '',
                'Company': accountName || ''
              });
              
              console.log("Pre-filled form with user data");
            } catch (e) {
              console.warn("Could not pre-fill form fields:", e);
            }
          }
          
          // Override form styles after it's loaded
          setTimeout(function() {
            enforceFormStyles();
          }, 100);
          
          // Form success handler
          form.onSuccess(function() {
            showSuccess("Thank you! You have successfully subscribed to Nintex communications.");
            
            // Close modal after delay
            setTimeout(function() {
              const modal = document.getElementById('nintex-subscription-modal');
              if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
              }
            }, 3000);
            
            return false; // Prevent default form submission
          });
        });
      } catch (err) {
        console.error("Error initializing form:", err);
        showError("There was an error loading the form. Please try again later.");
      }
    }
    
    // Enforce styles on Marketo form elements
    function enforceFormStyles() {
      // Force styles on Marketo elements that might be overridden
      const formEl = document.querySelector('#mktoForm_9147');
      if (formEl) {
        formEl.style.width = '100%';
        
        // Fix form row styling
        const formRows = formEl.querySelectorAll('.mktoFormRow');
        formRows.forEach(function(row) {
          row.style.clear = 'both';
          row.style.marginBottom = '15px';
        });
        
        // Fix label styling
        const labels = formEl.querySelectorAll('.mktoLabel');
        labels.forEach(function(label) {
          label.style.width = 'auto';
          label.style.fontWeight = '500';
          label.style.color = '#333';
          label.style.marginBottom = '5px';
        });
        
        // Fix input styling
        const inputs = formEl.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select');
        inputs.forEach(function(input) {
          input.style.width = '100%';
          input.style.padding = '10px 12px';
          input.style.fontSize = '16px';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '4px';
          input.style.boxShadow = 'none';
          input.style.marginBottom = '5px';
          input.style.height = 'auto';
        });
        
        // Fix button styling
        const button = formEl.querySelector('.mktoButton');
        if (button) {
          button.style.backgroundColor = '#FF6B00';
          button.style.backgroundImage = 'none';
          button.style.border = 'none';
          button.style.color = 'white';
          button.style.padding = '12px 24px';
          button.style.fontWeight = '500';
          button.style.borderRadius = '50px';
          button.style.fontSize = '16px';
          button.style.boxShadow = '0 2px 4px rgba(255, 107, 0, 0.2)';
          button.style.minWidth = '140px';
          button.style.display = 'inline-block';
          button.style.textAlign = 'center';
        }
        
        // Fix button row styling
        const buttonRow = formEl.querySelector('.mktoButtonRow');
        if (buttonRow) {
          buttonRow.style.width = '100%';
          buttonRow.style.textAlign = 'center';
          buttonRow.style.marginTop = '15px';
        }
        
        // Fix button wrap styling
        const buttonWrap = formEl.querySelector('.mktoButtonWrap');
        if (buttonWrap) {
          buttonWrap.style.marginLeft = '0';
        }
        
        // Hide offset elements
        const offsets = formEl.querySelectorAll('.mktoOffset');
        offsets.forEach(function(offset) {
          offset.style.display = 'none';
        });
        
        // Fix form column styling
        const formCols = formEl.querySelectorAll('.mktoFormCol');
        formCols.forEach(function(col) {
          col.style.float = 'none';
          col.style.width = '100%';
        });
        
        // Fix field wrap styling
        const fieldWraps = formEl.querySelectorAll('.mktoFieldWrap');
        fieldWraps.forEach(function(wrap) {
          wrap.style.float = 'none';
          wrap.style.width = '100%';
        });
      }
    }
    
    // Show success message
    function showSuccess(message) {
      const modalBody = document.querySelector('#nintex-subscription-modal .nintex-modal-body');
      if (modalBody) {
        modalBody.innerHTML = `<div class="nintex-alert-success"><p>${message}</p></div>`;
      }
    }
    
    // Show error message
    function showError(message) {
      const modalBody = document.querySelector('#nintex-subscription-modal .nintex-modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="nintex-alert-error">
            <p>${message}</p>
            <button onclick="document.getElementById('nintex-subscription-modal').remove(); showSubscriptionModal();" 
                    style="background-color: #FF6B00; color: white; border: none; border-radius: 50px; padding: 10px 20px; margin-top: 15px; cursor: pointer; font-weight: 500; font-family: inherit;">
              Try Again
            </button>
          </div>
        `;
      }
    }
    
    // Make the function globally available for the retry button
    window.showSubscriptionModal = showSubscriptionModal;
  });