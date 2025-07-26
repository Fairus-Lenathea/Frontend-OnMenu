// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let isMobile = window.innerWidth <= 768;
let isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initScrollToTop();
    initProgressBar();
    initCounterAnimation();
    initContactForm();
    initFAQAccordion();
    initServiceAnimations();
    initPricingCards();
    initScrollAnimations();
    initMobileOptimizations();
    initTouchGestures();
    initResponsiveImages();
    
    // Update mobile state on resize
    window.addEventListener('resize', debounce(function() {
        isMobile = window.innerWidth <= 768;
        isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        handleResponsiveChanges();
    }, 250));
});

// ===== NAVIGATION =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (hamburger && navMenu) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Enhanced navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', throttle(function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            
            // Hide navbar on scroll down, show on scroll up (mobile only)
            if (isMobile) {
                if (currentScroll > lastScrollTop && currentScroll > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, 100));
}

// ===== MOBILE OPTIMIZATIONS =====
function initMobileOptimizations() {
    // Optimize touch targets for mobile
    if (isMobile) {
        const buttons = document.querySelectorAll('.btn, .service-btn, .pricing-btn, .submit-btn');
        buttons.forEach(button => {
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
        });
        
        // Optimize form inputs for mobile
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // Prevent zoom on iOS
        });
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // Recalculate heights and positions
            handleResponsiveChanges();
        }, 100);
    });
    
    // Optimize animations for mobile
    if (isMobile) {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            card.style.animation = 'none';
            card.style.position = 'relative';
            card.style.display = 'inline-block';
            card.style.margin = '1rem';
        });
    }
}

// ===== TOUCH GESTURES =====
function initTouchGestures() {
    if (!('ontouchstart' in window)) return;
    
    // Swipe to close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        let startX = 0;
        let startY = 0;
        
        navMenu.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        navMenu.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Swipe left to close menu
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                const hamburger = document.querySelector('.hamburger');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .service-btn, .pricing-btn, .feature-card, .value-card');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// ===== RESPONSIVE IMAGES =====
function initResponsiveImages() {
    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 100));
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Touch support for scroll to top
    if ('ontouchstart' in window) {
        scrollToTopBtn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.9)';
        });
        
        scrollToTopBtn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    }
}

// ===== PROGRESS BAR =====
function initProgressBar() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', throttle(function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 50));
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (isMobile ? 100 : 200); // Faster on mobile
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: isMobile ? 0.3 : 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Enhanced form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Nama harus berisi minimal 2 karakter dan hanya huruf'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Format email tidak valid'
        },
        phone: {
            pattern: /^[\d\s\-\+\(\)]+$/,
            message: 'Format nomor telepon tidak valid'
        },
        subject: {
            required: true,
            message: 'Silakan pilih subjek'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Pesan harus berisi minimal 10 karakter'
        },
        privacy: {
            required: true,
            message: 'Anda harus menyetujui kebijakan privasi'
        }
    };
    
    // Real-time validation with mobile optimizations
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Use input event for better mobile experience
        field.addEventListener('input', debounce(function() {
            clearFieldError(field);
            if (this.value.trim()) {
                validateField(field, validationRules[fieldName]);
            }
        }, 300));
        
        field.addEventListener('blur', function() {
            validateField(field, validationRules[fieldName]);
        });
    });
    
    // Enhanced form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(contactForm);
        
        // Validate all fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField(field, validationRules[fieldName])) {
                isValid = false;
            }
        });
        
        if (isValid) {
            submitContactForm(formData);
        } else {
            showNotification('Mohon perbaiki kesalahan pada form', 'error');
            // Scroll to first error on mobile
            if (isMobile) {
                const firstError = contactForm.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
    
    function validateField(field, rules) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        
        // Required validation
        if (rules.required && (!value || value === '')) {
            showFieldError(field, rules.message || 'Field ini wajib diisi');
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            clearFieldError(field);
            return true;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, rules.message);
            return false;
        }
        
        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(field, rules.message);
            return false;
        }
        
        clearFieldError(field);
        return true;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#dc3545';
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        
        // Add haptic feedback on mobile
        if (isMobile && 'vibrate' in navigator) {
            navigator.vibrate(100);
        }
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        field.removeAttribute('aria-invalid');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function submitContactForm(formData) {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Pesan Anda berhasil dikirim! Kami akan segera merespons.', 'success');
            
            // Scroll to top on mobile
            if (isMobile) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 2000);
    }
}

// ===== FAQ ACCORDION =====
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Set initial ARIA attributes
            const questionId = 'faq-question-' + Math.random().toString(36).substr(2, 9);
            const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
            
            question.setAttribute('id', questionId);
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', answerId);
            
            answer.setAttribute('id', answerId);
            answer.setAttribute('aria-labelledby', questionId);
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    
                    // Scroll into view on mobile
                    if (isMobile) {
                        setTimeout(() => {
                            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 300);
                    }
                }
            });
            
            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
}

// ===== SERVICE ANIMATIONS =====
function initServiceAnimations() {
    // Animate service cards on scroll with mobile optimizations
    const serviceCards = document.querySelectorAll('.service-item, .feature-card, .step-item');
    
    const observerOptions = {
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = isMobile ? index * 50 : index * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, observerOptions);
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Optimize step animations for mobile
    if (!isMobile) {
        const stepNumbers = document.querySelectorAll('.step-number');
        stepNumbers.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.2}s`;
            step.style.animation = 'pulse 2s infinite';
        });
        
        // Add pulse animation if not exists
        if (!document.querySelector('#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== PRICING CARDS =====
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        // Only add hover effects on non-touch devices
        if (!('ontouchstart' in window)) {
            card.addEventListener('mouseenter', function() {
                if (!this.classList.contains('featured')) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('featured')) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        }
        
        // Add touch feedback for mobile
        if ('ontouchstart' in window) {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Animate elements on scroll with mobile optimizations
    const animatedElements = document.querySelectorAll('.value-card, .team-card, .vm-card, .category-card, .testimonial-card');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: isMobile ? 0.1 : 0.2,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        scrollObserver.observe(element);
    });
}

// ===== RESPONSIVE CHANGES HANDLER =====
function handleResponsiveChanges() {
    // Update mobile-specific optimizations
    initMobileOptimizations();
    
    // Recalculate intersection observer thresholds
    const observers = document.querySelectorAll('[data-observer]');
    observers.forEach(observer => {
        // Reinitialize observers with new thresholds
        // This would need to be implemented based on specific needs
    });
    
    // Update floating card positions for mobile
    const floatingCards = document.querySelectorAll('.floating-card');
    if (isMobile) {
        floatingCards.forEach(card => {
            card.style.position = 'relative';
            card.style.animation = 'none';
            card.style.display = 'inline-block';
            card.style.margin = '1rem';
        });
    } else {
        floatingCards.forEach((card, index) => {
            card.style.position = 'absolute';
            card.style.animation = 'float 3s ease-in-out infinite';
            card.style.animationDelay = `${index}s`;
            card.style.display = 'flex';
            card.style.margin = '0';
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff';
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    // Adjust positioning for mobile
    const rightPosition = isMobile ? '10px' : '20px';
    const topPosition = isMobile ? '80px' : '100px';
    const maxWidth = isMobile ? 'calc(100vw - 20px)' : '400px';
    
    notification.style.cssText = `
        position: fixed;
        top: ${topPosition};
        right: ${rightPosition};
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        max-width: ${maxWidth};
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: ${isMobile ? '0.9rem' : '1rem'};
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0.2rem;
            min-width: 24px;
            min-height: 24px;
        " aria-label="Close notification">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds (longer on mobile for better UX)
    const autoRemoveTime = isMobile ? 7000 : 5000;
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, autoRemoveTime);
    
    // Add slide animations if not exists
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    // Add haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator && type === 'error') {
        navigator.vibrate([100, 50, 100]);
    } else if (isMobile && 'vibrate' in navigator && type === 'success') {
        navigator.vibrate(200);
    }
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - (isMobile ? 80 : 100);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ENHANCED ANIMATIONS =====
function initPageSpecificAnimations() {
    // Animate pricing cards with stagger effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = isMobile ? index * 100 : index * 200;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, delay);
                }
            });
        }, { threshold: isMobile ? 0.1 : 0.2 });
        
        pricingCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s ease';
            pricingObserver.observe(card);
        });
    }
    
    // Animate testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length > 0) {
        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = isMobile ? index * 100 : index * 150;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, delay);
                }
            });
        }, { threshold: isMobile ? 0.1 : 0.2 });
        
        testimonialCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            testimonialObserver.observe(card);
        });
    }
}

// Initialize page-specific animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPageSpecificAnimations, 100);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Skip to main content link
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #ff6b35;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close notifications with Escape key
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Disable complex animations
    const style = document.createElement('style');
    style.textContent = `
        .floating-card,
        .service-card,
        .contact-card {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Prefers reduced motion support
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// ===== SERVICE WORKER REGISTRATION (if needed) =====
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        // Service worker registration would go here if needed
        // navigator.serviceWorker.register('/sw.js');
    });
}

