// Header Customization JavaScript
class HeaderCustomization {
    constructor() {
        this.settings = {
            background: {
                type: 'color', // 'color' or 'image'
                value: '#667eea',
                imageData: null
            },
            logo: {
                enabled: false,
                imageData: null
            },
            colors: {
                primary: '#667eea',
                secondary: '#764ba2'
            }
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.updatePreview();
        this.applyToMainHeader();
    }

    bindEvents() {
        // Background upload
        const backgroundUpload = document.getElementById('headerBackgroundUpload');
        if (backgroundUpload) {
            backgroundUpload.addEventListener('change', (e) => this.handleBackgroundUpload(e));
        }

        // Logo upload
        const logoUpload = document.getElementById('headerLogoUpload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => this.handleLogoUpload(e));
        }

        // Color picker
        const colorPicker = document.getElementById('headerColorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => this.handleColorChange(e));
        }

        // Apply settings button
        const applyBtn = document.getElementById('applyHeaderSettings');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applySettings());
        }

        // Reset settings button
        const resetBtn = document.getElementById('resetHeaderSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }

        // Drag and drop for background
        this.setupDragAndDrop('headerBackgroundArea', (file) => this.processBackgroundFile(file));
        
        // Drag and drop for logo
        this.setupDragAndDrop('headerLogoArea', (file) => this.processLogoFile(file));
    }

    setupDragAndDrop(areaId, callback) {
        const area = document.getElementById(areaId);
        if (!area) return;

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                callback(files[0]);
            }
        });
    }

    handleBackgroundUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processBackgroundFile(file);
        }
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processLogoFile(file);
        }
    }

    processBackgroundFile(file) {
        // Validate file
        if (!this.validateImageFile(file, 2 * 1024 * 1024)) { // 2MB limit
            return;
        }

        const area = document.getElementById('headerBackgroundArea');
        area.classList.add('loading');

        this.resizeImage(file, 800, 200, (resizedDataUrl) => {
            this.settings.background.type = 'image';
            this.settings.background.imageData = resizedDataUrl;
            
            this.showUploadedImage('headerBackgroundPreview', resizedDataUrl);
            this.updatePreview();
            
            area.classList.remove('loading');
            area.classList.add('success');
            
            setTimeout(() => area.classList.remove('success'), 2000);
        });
    }

    processLogoFile(file) {
        // Validate file
        if (!this.validateImageFile(file, 1024 * 1024)) { // 1MB limit
            return;
        }

        const area = document.getElementById('headerLogoArea');
        area.classList.add('loading');

        this.resizeImage(file, 120, 40, (resizedDataUrl) => {
            this.settings.logo.enabled = true;
            this.settings.logo.imageData = resizedDataUrl;
            
            this.showUploadedImage('headerLogoPreview', resizedDataUrl);
            this.updatePreview();
            
            area.classList.remove('loading');
            area.classList.add('success');
            
            setTimeout(() => area.classList.remove('success'), 2000);
        });
    }

    validateImageFile(file, maxSize) {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
            return false;
        }

        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024);
            this.showError(`Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`);
            return false;
        }

        return true;
    }

    resizeImage(file, maxWidth, maxHeight, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            callback(dataUrl);
        };

        img.src = URL.createObjectURL(file);
    }

    showUploadedImage(containerId, imageData) {
        const container = document.getElementById(containerId);
        const placeholder = container.parentElement.querySelector('.upload-placeholder');
        
        if (container && placeholder) {
            const img = container.querySelector('img');
            img.src = imageData;
            
            placeholder.style.display = 'none';
            container.style.display = 'block';
        }
    }

    handleColorChange(event) {
        this.settings.background.type = 'color';
        this.settings.background.value = event.target.value;
        this.settings.colors.primary = event.target.value;
        this.updatePreview();
    }

    updatePreview() {
        const preview = document.getElementById('headerPreview');
        const backgroundArea = document.getElementById('headerBackgroundPreviewArea');
        const logoImg = document.getElementById('headerLogoPreviewImg');

        if (!preview || !backgroundArea) return;

        // Update background
        if (this.settings.background.type === 'image' && this.settings.background.imageData) {
            backgroundArea.style.backgroundImage = `url(${this.settings.background.imageData})`;
            preview.style.background = 'none';
        } else {
            backgroundArea.style.backgroundImage = 'none';
            preview.style.background = `linear-gradient(135deg, ${this.settings.colors.primary} 0%, ${this.settings.colors.secondary} 100%)`;
        }

        // Update logo
        if (this.settings.logo.enabled && this.settings.logo.imageData && logoImg) {
            logoImg.src = this.settings.logo.imageData;
            logoImg.style.display = 'block';
        } else if (logoImg) {
            logoImg.style.display = 'none';
        }
    }

    applyToMainHeader() {
        const mainHeader = document.querySelector('.mobile-header');
        if (!mainHeader) return;

        // Remove existing background div
        const existingBg = mainHeader.querySelector('.header-background');
        if (existingBg) {
            existingBg.remove();
        }

        // Remove existing logo
        const existingLogo = mainHeader.querySelector('.header-logo');
        if (existingLogo) {
            existingLogo.remove();
        }

        // Apply background
        if (this.settings.background.type === 'image' && this.settings.background.imageData) {
            mainHeader.classList.add('custom');
            
            const bgDiv = document.createElement('div');
            bgDiv.className = 'header-background';
            bgDiv.style.backgroundImage = `url(${this.settings.background.imageData})`;
            
            mainHeader.insertBefore(bgDiv, mainHeader.firstChild);
        } else {
            mainHeader.classList.remove('custom');
            mainHeader.style.background = `linear-gradient(135deg, ${this.settings.colors.primary} 0%, ${this.settings.colors.secondary} 100%)`;
        }

        // Apply logo
        if (this.settings.logo.enabled && this.settings.logo.imageData) {
            const headerContent = mainHeader.querySelector('.header-content');
            const logo = mainHeader.querySelector('.logo');
            
            if (headerContent && logo) {
                // Create brand container if it doesn't exist
                let brandContainer = mainHeader.querySelector('.header-brand');
                if (!brandContainer) {
                    brandContainer = document.createElement('div');
                    brandContainer.className = 'header-brand';
                    
                    // Move logo to brand container
                    brandContainer.appendChild(logo);
                    
                    // Insert brand container in the right place
                    const menuToggle = headerContent.querySelector('.menu-toggle');
                    const headerActions = headerContent.querySelector('.header-actions');
                    
                    if (menuToggle && headerActions) {
                        headerContent.insertBefore(brandContainer, headerActions);
                    }
                }

                // Add logo image
                const logoImg = document.createElement('img');
                logoImg.src = this.settings.logo.imageData;
                logoImg.alt = 'Logo';
                logoImg.className = 'header-logo';
                
                brandContainer.insertBefore(logoImg, logo);
            }
        }
    }

    applySettings() {
        this.applyToMainHeader();
        this.saveSettings();
        this.showSuccess('Pengaturan header berhasil diterapkan!');
    }

    resetSettings() {
        if (confirm('Apakah Anda yakin ingin mereset semua pengaturan header?')) {
            this.settings = {
                background: {
                    type: 'color',
                    value: '#667eea',
                    imageData: null
                },
                logo: {
                    enabled: false,
                    imageData: null
                },
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2'
                }
            };

            this.clearUploadedImages();
            this.updatePreview();
            this.applyToMainHeader();
            this.saveSettings();
            
            // Reset color picker
            const colorPicker = document.getElementById('headerColorPicker');
            if (colorPicker) {
                colorPicker.value = '#667eea';
            }

            this.showSuccess('Pengaturan header berhasil direset!');
        }
    }

    clearUploadedImages() {
        // Clear background
        const bgPreview = document.getElementById('headerBackgroundPreview');
        const bgPlaceholder = document.querySelector('#headerBackgroundArea .upload-placeholder');
        if (bgPreview && bgPlaceholder) {
            bgPreview.style.display = 'none';
            bgPlaceholder.style.display = 'block';
        }

        // Clear logo
        const logoPreview = document.getElementById('headerLogoPreview');
        const logoPlaceholder = document.querySelector('#headerLogoArea .upload-placeholder');
        if (logoPreview && logoPlaceholder) {
            logoPreview.style.display = 'none';
            logoPlaceholder.style.display = 'block';
        }

        // Clear file inputs
        const bgInput = document.getElementById('headerBackgroundUpload');
        const logoInput = document.getElementById('headerLogoUpload');
        if (bgInput) bgInput.value = '';
        if (logoInput) logoInput.value = '';
    }

    saveSettings() {
        try {
            localStorage.setItem('headerCustomization', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving header settings:', error);
            this.showError('Gagal menyimpan pengaturan. Storage mungkin penuh.');
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('headerCustomization');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                
                // Restore UI state
                if (this.settings.background.imageData) {
                    this.showUploadedImage('headerBackgroundPreview', this.settings.background.imageData);
                }
                
                if (this.settings.logo.imageData) {
                    this.showUploadedImage('headerLogoPreview', this.settings.logo.imageData);
                }

                // Update color picker
                const colorPicker = document.getElementById('headerColorPicker');
                if (colorPicker) {
                    colorPicker.value = this.settings.colors.primary;
                }
            }
        } catch (error) {
            console.error('Error loading header settings:', error);
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions for onclick handlers
function removeHeaderBackground() {
    if (window.headerCustomization) {
        window.headerCustomization.settings.background.type = 'color';
        window.headerCustomization.settings.background.imageData = null;
        
        const bgPreview = document.getElementById('headerBackgroundPreview');
        const bgPlaceholder = document.querySelector('#headerBackgroundArea .upload-placeholder');
        const bgInput = document.getElementById('headerBackgroundUpload');
        
        if (bgPreview && bgPlaceholder) {
            bgPreview.style.display = 'none';
            bgPlaceholder.style.display = 'block';
        }
        
        if (bgInput) {
            bgInput.value = '';
        }
        
        window.headerCustomization.updatePreview();
    }
}

function removeHeaderLogo() {
    if (window.headerCustomization) {
        window.headerCustomization.settings.logo.enabled = false;
        window.headerCustomization.settings.logo.imageData = null;
        
        const logoPreview = document.getElementById('headerLogoPreview');
        const logoPlaceholder = document.querySelector('#headerLogoArea .upload-placeholder');
        const logoInput = document.getElementById('headerLogoUpload');
        
        if (logoPreview && logoPlaceholder) {
            logoPreview.style.display = 'none';
            logoPlaceholder.style.display = 'block';
        }
        
        if (logoInput) {
            logoInput.value = '';
        }
        
        window.headerCustomization.updatePreview();
    }
}

function resetHeaderColor() {
    const colorPicker = document.getElementById('headerColorPicker');
    if (colorPicker) {
        colorPicker.value = '#667eea';
        colorPicker.dispatchEvent(new Event('change'));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with header customization elements
    if (document.getElementById('headerBackgroundUpload')) {
        window.headerCustomization = new HeaderCustomization();
    }
});

