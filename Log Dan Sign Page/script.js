document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('.signup-form');
    const backArrow = document.querySelector('.back-arrow');
    const profilePhotoPlaceholder = document.querySelector('.circle');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email-address');
    const passwordInput = document.getElementById('password');
    const continueButton = document.querySelector('.continue-button');

    // Back arrow functionality
    backArrow.addEventListener('click', function() {
        // You can customize this behavior
        if (window.history.length > 1) {
            window.history.back();
        } else {
            alert('No previous page to go back to');
        }
    });

    // Profile photo placeholder functionality
    profilePhotoPlaceholder.addEventListener('click', function() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoPlaceholder.style.backgroundImage = `url(${e.target.result})`;
                    profilePhotoPlaceholder.style.backgroundSize = 'cover';
                    profilePhotoPlaceholder.style.backgroundPosition = 'center';
                    profilePhotoPlaceholder.textContent = '';
                    profilePhotoPlaceholder.style.border = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm() {
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!fullName) {
            alert('Please enter your full name');
            fullNameInput.focus();
            return false;
        }

        if (!email) {
            alert('Please enter your email address');
            emailInput.focus();
            return false;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return false;
        }

        if (!password) {
            alert('Please enter a password');
            passwordInput.focus();
            return false;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            continueButton.textContent = 'Processing...';
            continueButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Sign up successful! Welcome!');
                
                // Reset form
                form.reset();
                profilePhotoPlaceholder.style.backgroundImage = '';
                profilePhotoPlaceholder.textContent = 'Add Photo';
                profilePhotoPlaceholder.style.border = '2px dashed #ccc';
                
                // Reset button
                continueButton.textContent = 'Continue';
                continueButton.disabled = false;
            }, 2000);
        }
    });

    // Input focus effects
    const inputs = [fullNameInput, emailInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Real-time validation feedback
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#ddd';
        }
    });

    passwordInput.addEventListener('input', function() {
        const password = this.value.trim();
        if (password && password.length < 6) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
});

