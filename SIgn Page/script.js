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
    // Validasi nomor telepon yang lebih fleksibel, bisa dimulai dengan 0, +62, atau langsung 8.
    const re = /^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/;
    return re.test(phone);
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
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
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
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle Sign In
function handleSignIn(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    showLoading(submitBtn);
    
    setTimeout(() => {
        hideLoading(submitBtn);
        const userData = { email: email, loginTime: new Date().toISOString() };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        showNotification('Sign in successful!', 'success');
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
    
    showLoading(submitBtn);
    
    setTimeout(() => {
        hideLoading(submitBtn);
        const signupData = {
            fullName: fullName,
            email: email,
            password: password,
            step: 1
        };
        localStorage.setItem('signupData', JSON.stringify(signupData));
        showNotification('Basic information saved!', 'success');
        setTimeout(() => {
            goToAddress();
        }, 1000);
    }, 1500);
}

// =================================================================
// KODE YANG DIPERBAIKI ADA DI FUNGSI DI BAWAH INI
// =================================================================
function handleAddress(e) {
    e.preventDefault();
    
    const phoneNo = document.getElementById('phoneNo').value;
    // Di HTML, ID untuk "Nama Toko" adalah "houseNo". Kita ambil nilainya.
    const shopName = document.getElementById('houseNo').value; 
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // --- PERBAIKAN VALIDASI ---
    // Validasi nomor telepon
    if (!validatePhone(phoneNo)) {
        showNotification('Please enter a valid phone number (e.g., 08123456789)', 'error');
        return;
    }
    
    // Validasi nama toko (sebelumnya 'houseNo')
    if (shopName.trim().length < 3) {
        showNotification('Please enter a valid shop name (min. 3 characters)', 'error');
        return;
    }
    
    // Validasi checkbox
    if (!document.getElementById('terms').checked || !document.getElementById('privacy').checked) {
        showNotification('You must agree to the Terms and Privacy Policy', 'error');
        return;
    }
    
    showLoading(submitBtn);
    
    setTimeout(() => {
        hideLoading(submitBtn);
        
        const signupData = JSON.parse(localStorage.getItem('signupData') || '{}');
        
        // --- PERBAIKAN PENYIMPANAN DATA ---
        // Simpan data yang benar (shopName, bukan address atau city)
        const completeData = {
            ...signupData,
            phoneNo: phoneNo,
            shopName: shopName, // Menggunakan variabel yang benar
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
        
        setTimeout(() => {
            showNotification('Welcome to FoodMarket! Please sign in to continue.', 'info');
            setTimeout(() => {
                window.location.href = 'index.html'; // Arahkan ke halaman login
            }, 2000);
        }, 1500);
        
    }, 2000);
}

// Add CSS for notifications and other UI enhancements
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(110%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(110%); opacity: 0; }
    }

    .notification {
        animation-fill-mode: forwards;
    }
`;
document.head.appendChild(style);

document.documentElement.style.scrollBehavior = 'smooth';

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

document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.querySelector('form:not(#signInForm) input:not([type="hidden"])');
    if (firstInput) {
        firstInput.focus();
    }
});
