// Navigation functions
function goToSignUp() {
    window.location.href = 'signup.html';
}

function goToAddress() {
    window.location.href = 'address.html';
}

function goBack() {
    window.history.back();
}

// Photo upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const photoInput = document.getElementById('photoInput');
    
    if (photoPlaceholder && photoInput) {
        photoPlaceholder.addEventListener('click', function() {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPlaceholder.innerHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
                    photoPlaceholder.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form submissions
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const addressForm = document.getElementById('addressForm');
    
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }
    
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }
    
    if (addressForm) {
        addressForm.addEventListener('submit', handleAddress);
    }
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Show loading state
function showLoading(button) {
    button.disabled = true;
    button.classList.add('loading');
}

// Hide loading state
function hideLoading(button) {
    button.disabled = false;
    button.classList.remove('loading');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#2ed573';
            break;
        case 'error':
            notification.style.backgroundColor = '#ff4757';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffa502';
            break;
        default:
            notification.style.backgroundColor = '#3742fa';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle Sign In
function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validation
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading
    showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        hideLoading(submitBtn);
        
        // Store user data (in real app, this would be handled by backend)
        const userData = {
            email: email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showNotification('Sign in successful!', 'success');
        
        // Redirect to dashboard (for demo, just show success)
        setTimeout(() => {
            showNotification('Welcome to FoodMarket! (Demo completed)', 'info');
        }, 1500);
        
    }, 2000);
}

// Handle Sign Up
function handleSignUp(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('emailSignUp').value;
    const password = document.getElementById('passwordSignUp').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validation
    if (fullName.trim().length < 2) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading
    showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        hideLoading(submitBtn);
        
        // Store signup data
        const signupData = {
            fullName: fullName,
            email: email,
            password: password, // In real app, never store plain password
            step: 1
        };
        localStorage.setItem('signupData', JSON.stringify(signupData));
        
        showNotification('Basic information saved!', 'success');
        
        // Redirect to address page
        setTimeout(() => {
            goToAddress();
        }, 1000);
        
    }, 1500);
}

// Handle Address
function handleAddress(e) {
    e.preventDefault();
    
    const phoneNo = document.getElementById('phoneNo').value;
    const address = document.getElementById('address').value;
    const houseNo = document.getElementById('houseNo').value;
    const city = document.getElementById('city').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validation
    if (!validatePhone(phoneNo)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    if (address.trim().length < 5) {
        showNotification('Please enter a valid address', 'error');
        return;
    }
    
    if (houseNo.trim().length < 1) {
        showNotification('Please enter your house number', 'error');
        return;
    }
    
    if (!city) {
        showNotification('Please select your city', 'error');
        return;
    }
    
    // Show loading
    showLoading(submitBtn);
    
    // Simulate API call
    setTimeout(() => {
        hideLoading(submitBtn);
        
        // Get existing signup data
        const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
        
        // Add address data
        const completeData = {
            ...signupData,
            phoneNo: phoneNo,
            address: address,
            houseNo: houseNo,
            city: city,
            step: 2,
            registrationComplete: true,
            registrationTime: new Date().toISOString()
        };
        
        localStorage.setItem('signupData', JSON.stringify(completeData));
        localStorage.setItem('currentUser', JSON.stringify({
            email: completeData.email,
            fullName: completeData.fullName,
            loginTime: new Date().toISOString()
        }));
        
        showNotification('Registration completed successfully!', 'success');
        
        // Redirect to sign in or dashboard
        setTimeout(() => {
            showNotification('Welcome to FoodMarket! Please sign in to continue.', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
        
    }, 2000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    }
});

// Add focus management for better accessibility
document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }
});

