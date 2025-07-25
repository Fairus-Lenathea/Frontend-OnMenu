// Dashboard Mobile-First JavaScript

class Dashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTooltips();
        this.loadInitialData();
    }

    bindEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebar = document.getElementById('closeSidebar');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.closeSidebar());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                this.closeSidebar();
            });
        });

        // Filter tabs
        const filterTabs = document.querySelectorAll('.tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleFilterTab(tab));
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Form submissions
        this.bindFormEvents();

        // Touch gestures for mobile
        this.initTouchGestures();

        // Keyboard shortcuts
        this.initKeyboardShortcuts();

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateToPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }

        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));

        const activeNavItem = document.querySelector(`[data-page="${pageName}"]`).closest('.nav-item');
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(pageName);

        // Load page-specific data
        this.loadPageData(pageName);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    updatePageTitle(pageName) {
        const titles = {
            dashboard: 'Dashboard',
            menu: 'Menu Management',
            orders: 'Orders',
            customers: 'Customers',
            reports: 'Reports',
            sales: 'Sales',
            analytics: 'Analytics',
            settings: 'Settings',
            profile: 'Profile'
        };

        document.title = `${titles[pageName]} - Dashboard Mobile`;
    }

    handleFilterTab(clickedTab) {
        // Remove active class from all tabs
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked tab
        clickedTab.classList.add('active');

        // Filter content based on tab
        const filterValue = clickedTab.textContent.toLowerCase();
        this.filterOrders(filterValue);
    }

    filterOrders(status) {
        const orderCards = document.querySelectorAll('.order-card');
        
        orderCards.forEach(card => {
            const orderStatus = card.querySelector('.order-status');
            if (status === 'all' || orderStatus.textContent.toLowerCase().includes(status)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    handleSearch(query) {
        const customerCards = document.querySelectorAll('.customer-card');
        
        customerCards.forEach(card => {
            const customerName = card.querySelector('h4').textContent.toLowerCase();
            const customerEmail = card.querySelector('p').textContent.toLowerCase();
            
            if (customerName.includes(query.toLowerCase()) || customerEmail.includes(query.toLowerCase())) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    bindFormEvents() {
        // Settings form
        const settingsInputs = document.querySelectorAll('#settings-page input, #settings-page select');
        settingsInputs.forEach(input => {
            input.addEventListener('change', () => this.saveSettings());
        });

        // Profile form
        const profileForm = document.querySelector('#profile-page .profile-form');
        if (profileForm) {
            const saveButton = profileForm.querySelector('.btn-primary');
            if (saveButton) {
                saveButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.saveProfile();
                });
            }
        }

        // Menu item actions
        const editButtons = document.querySelectorAll('.btn-edit');
        const deleteButtons = document.querySelectorAll('.btn-delete');

        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editMenuItem(btn);
            });
        });

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMenuItem(btn);
            });
        });

        // Add new menu item
        const addItemButton = document.querySelector('#menu-page .btn-primary');
        if (addItemButton) {
            addItemButton.addEventListener('click', () => this.addMenuItem());
        }

        // New sale button
        const newSaleButton = document.querySelector('#sales-page .btn-primary');
        if (newSaleButton) {
            newSaleButton.addEventListener('click', () => this.createNewSale());
        }
    }

    initTouchGestures() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                isScrolling = false;
                // Horizontal swipe
                if (diffX > 50 && window.innerWidth < 1024) {
                    // Swipe left - close sidebar
                    this.closeSidebar();
                } else if (diffX < -50 && window.innerWidth < 1024) {
                    // Swipe right - open sidebar
                    this.toggleSidebar();
                }
            } else {
                isScrolling = true;
            }
        });

        document.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
            isScrolling = false;
        });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const keyMap = {
                    '1': 'dashboard',
                    '2': 'menu',
                    '3': 'orders',
                    '4': 'customers',
                    '5': 'reports',
                    '6': 'sales',
                    '7': 'analytics',
                    '8': 'settings',
                    '9': 'profile'
                };

                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.navigateToPage(keyMap[e.key]);
                }
            }

            // Escape key to close sidebar
            if (e.key === 'Escape') {
                this.closeSidebar();
            }

            // Ctrl + K for search
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-box input');
                if (searchInput && this.currentPage === 'customers') {
                    searchInput.focus();
                }
            }
        });
    }

    handleResize() {
        // Close sidebar on desktop
        if (window.innerWidth >= 1024) {
            this.closeSidebar();
        }

        // Update chart sizes if needed
        this.updateChartSizes();
    }

    loadInitialData() {
        // Simulate loading initial dashboard data
        this.updateDashboardStats();
        this.loadRecentOrders();
        this.updateNotificationCount();
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.updateDashboardStats();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'reports':
                this.generateReports();
                break;
            case 'sales':
                this.loadSalesData();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    updateDashboardStats() {
        // Simulate real-time stats update
        const stats = [
            { value: Math.floor(Math.random() * 200) + 100, suffix: '' },
            { value: Math.floor(Math.random() * 150) + 50, suffix: '' },
            { value: '$' + (Math.floor(Math.random() * 20000) + 10000).toLocaleString(), suffix: '' },
            { value: '+' + Math.floor(Math.random() * 30) + 10, suffix: '%' }
        ];

        const statCards = document.querySelectorAll('.stat-card .stat-content h3');
        statCards.forEach((card, index) => {
            if (stats[index]) {
                this.animateNumber(card, stats[index].value);
            }
        });
    }

    animateNumber(element, targetValue) {
        const isMonetary = targetValue.toString().includes('$');
        const isPercentage = targetValue.toString().includes('%');
        const numericValue = parseInt(targetValue.toString().replace(/[^0-9]/g, ''));
        
        let currentValue = 0;
        const increment = numericValue / 30;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            if (isMonetary) {
                displayValue = '$' + displayValue.toLocaleString();
            } else if (isPercentage) {
                displayValue = '+' + displayValue + '%';
            }
            
            element.textContent = displayValue;
        }, 50);
    }

    loadRecentOrders() {
        // Simulate loading recent orders
        const orderStatuses = ['pending', 'completed', 'processing'];
        const orderItems = document.querySelectorAll('.order-item .order-status');
        
        orderItems.forEach(status => {
            const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
            status.className = `order-status ${randomStatus}`;
            status.textContent = randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1);
        });
    }

    updateNotificationCount() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const count = Math.floor(Math.random() * 10);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    loadOrders() {
        // Simulate loading orders with loading state
        this.showLoadingState('#orders-page .orders-list');
        
        setTimeout(() => {
            this.hideLoadingState('#orders-page .orders-list');
            // Orders are already in HTML, just show them
        }, 1000);
    }

    loadCustomers() {
        // Simulate loading customers
        this.showLoadingState('#customers-page .customers-list');
        
        setTimeout(() => {
            this.hideLoadingState('#customers-page .customers-list');
        }, 800);
    }

    generateReports() {
        // Simulate report generation
        const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
        chartPlaceholders.forEach(placeholder => {
            placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Generating...</p>';
        });

        setTimeout(() => {
            chartPlaceholders.forEach(placeholder => {
                placeholder.innerHTML = '<i class="fas fa-chart-bar"></i><p>Chart Generated</p>';
            });
        }, 2000);
    }

    loadSalesData() {
        // Animate sales amounts
        const amounts = document.querySelectorAll('.amount');
        amounts.forEach(amount => {
            const value = amount.textContent.replace(/[^0-9]/g, '');
            this.animateNumber(amount, '$' + value);
        });
    }

    loadAnalytics() {
        // Simulate analytics loading
        const itemRanks = document.querySelectorAll('.item-rank');
        itemRanks.forEach((rank, index) => {
            rank.style.opacity = '0';
            rank.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                rank.style.transition = 'all 0.3s ease';
                rank.style.opacity = '1';
                rank.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    showLoadingState(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 12px;"></i>
                    <p>Loading...</p>
                </div>
            `;
        }
    }

    hideLoadingState(selector) {
        // This would normally restore the original content
        // For demo purposes, we'll just hide the loading state
        const container = document.querySelector(selector);
        if (container && container.innerHTML.includes('Loading...')) {
            location.reload(); // Simple way to restore content
        }
    }

    saveSettings() {
        // Simulate saving settings
        this.showToast('Settings saved successfully!', 'success');
    }

    saveProfile() {
        // Simulate saving profile
        this.showToast('Profile updated successfully!', 'success');
    }

    editMenuItem(button) {
        const menuItem = button.closest('.menu-item');
        const itemName = menuItem.querySelector('h4').textContent;
        
        // Simple prompt for demo - in real app, would show modal
        const newName = prompt('Edit item name:', itemName);
        if (newName && newName !== itemName) {
            menuItem.querySelector('h4').textContent = newName;
            this.showToast('Menu item updated!', 'success');
        }
    }

    deleteMenuItem(button) {
        const menuItem = button.closest('.menu-item');
        const itemName = menuItem.querySelector('h4').textContent;
        
        if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
            menuItem.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                menuItem.remove();
                this.showToast('Menu item deleted!', 'success');
            }, 300);
        }
    }

    addMenuItem() {
        const itemName = prompt('Enter new menu item name:');
        if (itemName) {
            const menuGrid = document.querySelector('.menu-grid');
            const newItem = document.createElement('div');
            newItem.className = 'menu-item';
            newItem.innerHTML = `
                <img src="https://via.placeholder.com/150x100/45B7D1/ffffff?text=${encodeURIComponent(itemName.charAt(0))}" alt="${itemName}">
                <h4>${itemName}</h4>
                <p>$0.00</p>
                <div class="menu-actions">
                    <button class="btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            menuGrid.appendChild(newItem);
            
            // Rebind events for new buttons
            const editBtn = newItem.querySelector('.btn-edit');
            const deleteBtn = newItem.querySelector('.btn-delete');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editMenuItem(editBtn);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMenuItem(deleteBtn);
            });
            
            this.showToast('New menu item added!', 'success');
        }
    }

    createNewSale() {
        // Simulate creating a new sale
        this.showToast('New sale created!', 'success');
        
        // Update today's sales
        setTimeout(() => {
            this.loadSalesData();
        }, 500);
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 16px;
                background: ${type === 'success' ? '#10b981' : '#3b82f6'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 2000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                font-size: 14px;
                font-weight: 500;
            ">
                <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle" style="margin-right: 8px;"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    updateChartSizes() {
        // Update chart containers for responsive design
        const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
        chartPlaceholders.forEach(chart => {
            // Recalculate chart dimensions
            chart.style.height = window.innerWidth < 768 ? '150px' : '200px';
        });
    }

    initializeTooltips() {
        // Add tooltips for better UX
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                if (window.innerWidth >= 1024) { // Only on desktop
                    this.showTooltip(e.target, e.target.getAttribute('title'));
                }
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #1e293b;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 2000;
            pointer-events: none;
            white-space: nowrap;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            document.body.removeChild(tooltip);
        }
    }
}

// CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    
    // Add some demo interactivity
    console.log('Dashboard initialized successfully!');
    console.log('Keyboard shortcuts:');
    console.log('- Alt + 1-9: Quick navigation');
    console.log('- Escape: Close sidebar');
    console.log('- Ctrl + K: Focus search (on customers page)');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


// Menu Management System
class MenuManager {
    constructor() {
        this.categories = [
            { id: 'antibiotik', name: 'Antibiotik', icon: 'fas fa-pills' },
            { id: 'vitamin', name: 'Vitamin & Mineral', icon: 'fas fa-capsules' },
            { id: 'anti-coccidia', name: 'Anti Coccidia', icon: 'fas fa-shield-alt' },
            { id: 'antiparasi', name: 'Antiparasi', icon: 'fas fa-bug' }
        ];
        
        this.products = [
            { id: 1, name: 'CYPROTIL 250 g', description: 'Obat CRD Kompleks', price: 52500, stock: 35, category: 'antibiotik' },
            { id: 2, name: 'DITA FLOXA LIQ 1 L', description: 'Obat CRD Kompleks', price: 199650, stock: 43, category: 'antibiotik' },
            { id: 3, name: 'DITA FLOXA POWDER 500 g', description: 'Obat CRD Kompleks', price: 145200, stock: 28, category: 'antibiotik' },
            { id: 4, name: 'DITA THERAPIX 250 g', description: 'Obat Kolera dan Coccidiosis', price: 89500, stock: 67, category: 'anti-coccidia' },
            { id: 5, name: 'PRIMAVIT PLUS 1 L', description: 'Energizer & Stimulan Metabolisme', price: 145200, stock: 22, category: 'vitamin' },
            { id: 6, name: 'WORMECTIN 100 ml', description: 'Obat Cacing Ternak', price: 75000, stock: 45, category: 'antiparasi' }
        ];
        
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.bindMenuEvents();
        this.createModals();
    }
    
    bindMenuEvents() {
        // Category filter buttons
        const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
        categoryFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.category);
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
        
        // Add category button
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showCategoryModal();
            });
        }
        
        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductModal();
            });
        }
        
        // Category edit/delete buttons
        this.bindCategoryActions();
        
        // Product edit/delete buttons
        this.bindProductActions();
    }
    
    bindCategoryActions() {
        const editCategoryBtns = document.querySelectorAll('.btn-edit-category');
        const deleteCategoryBtns = document.querySelectorAll('.btn-delete-category');
        
        editCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const categoryId = btn.dataset.category;
                this.editCategory(categoryId);
            });
        });
        
        deleteCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const categoryId = btn.dataset.category;
                this.deleteCategory(categoryId);
            });
        });
    }
    
    bindProductActions() {
        const editProductBtns = document.querySelectorAll('.btn-edit-product');
        const deleteProductBtns = document.querySelectorAll('.btn-delete-product');
        
        editProductBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId);
                this.editProduct(productId);
            });
        });
        
        deleteProductBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId);
                this.deleteProduct(productId);
            });
        });
    }
    
    filterByCategory(category) {
        this.currentFilter = category;
        const categorySections = document.querySelectorAll('.category-section');
        
        categorySections.forEach(section => {
            if (category === 'all' || section.dataset.category === category) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
    
    searchProducts(query) {
        const productCards = document.querySelectorAll('.product-card');
        const searchTerm = query.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h4').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-desc').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Hide empty categories
        const categorySections = document.querySelectorAll('.category-section');
        categorySections.forEach(section => {
            const visibleProducts = section.querySelectorAll('.product-card:not(.hidden)');
            if (visibleProducts.length === 0 && searchTerm) {
                section.classList.add('hidden');
            } else if (this.currentFilter === 'all' || section.dataset.category === this.currentFilter) {
                section.classList.remove('hidden');
            }
        });
    }
    
    createModals() {
        // Create category modal
        const categoryModal = document.createElement('div');
        categoryModal.id = 'category-modal';
        categoryModal.className = 'modal';
        categoryModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add/Edit Category</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form class="modal-form" id="category-form">
                    <div class="form-row">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" required>
                    </div>
                    <div class="form-row">
                        <label for="category-icon">Icon Class</label>
                        <input type="text" id="category-icon" placeholder="fas fa-pills">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(categoryModal);
        
        // Create product modal
        const productModal = document.createElement('div');
        productModal.id = 'product-modal';
        productModal.className = 'modal';
        productModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add/Edit Product</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form class="modal-form" id="product-form">
                    <div class="form-row">
                        <label for="product-name">Product Name</label>
                        <input type="text" id="product-name" required>
                    </div>
                    <div class="form-row">
                        <label for="product-description">Description</label>
                        <textarea id="product-description" required></textarea>
                    </div>
                    <div class="form-row">
                        <label for="product-price">Price (Rp)</label>
                        <input type="number" id="product-price" required>
                    </div>
                    <div class="form-row">
                        <label for="product-stock">Stock</label>
                        <input type="number" id="product-stock" required>
                    </div>
                    <div class="form-row">
                        <label for="product-category">Category</label>
                        <select id="product-category" required>
                            <option value="">Select Category</option>
                            <option value="antibiotik">Antibiotik</option>
                            <option value="vitamin">Vitamin & Mineral</option>
                            <option value="anti-coccidia">Anti Coccidia</option>
                            <option value="antiparasi">Antiparasi</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label for="product-image">Image URL</label>
                        <input type="url" id="product-image" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(productModal);
        
        // Bind modal events
        this.bindModalEvents();
    }
    
    bindModalEvents() {
        // Close modal events
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            const cancelBtn = modal.querySelector('.btn-cancel');
            
            closeBtn.addEventListener('click', () => this.hideModal(modal.id));
            cancelBtn.addEventListener('click', () => this.hideModal(modal.id));
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Form submissions
        const categoryForm = document.getElementById('category-form');
        const productForm = document.getElementById('product-form');
        
        categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategoryForm();
        });
        
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProductForm();
        });
    }
    
    showCategoryModal(categoryId = null) {
        const modal = document.getElementById('category-modal');
        const form = document.getElementById('category-form');
        const title = modal.querySelector('.modal-header h3');
        
        if (categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            title.textContent = 'Edit Category';
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-icon').value = category.icon;
            form.dataset.editId = categoryId;
        } else {
            title.textContent = 'Add Category';
            form.reset();
            delete form.dataset.editId;
        }
        
        this.showModal('category-modal');
    }
    
    showProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const form = document.getElementById('product-form');
        const title = modal.querySelector('.modal-header h3');
        
        if (productId) {
            const product = this.products.find(p => p.id === productId);
            title.textContent = 'Edit Product';
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-image').value = product.image || '';
            form.dataset.editId = productId;
        } else {
            title.textContent = 'Add Product';
            form.reset();
            delete form.dataset.editId;
        }
        
        this.showModal('product-modal');
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    saveCategoryForm() {
        const form = document.getElementById('category-form');
        const name = document.getElementById('category-name').value;
        const icon = document.getElementById('category-icon').value || 'fas fa-folder';
        
        if (form.dataset.editId) {
            // Edit existing category
            const categoryId = form.dataset.editId;
            const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
            if (categoryIndex !== -1) {
                this.categories[categoryIndex].name = name;
                this.categories[categoryIndex].icon = icon;
                this.updateCategoryDisplay(categoryId);
            }
        } else {
            // Add new category
            const newId = name.toLowerCase().replace(/\s+/g, '-');
            const newCategory = { id: newId, name, icon };
            this.categories.push(newCategory);
            this.addCategoryToDOM(newCategory);
        }
        
        this.hideModal('category-modal');
        this.showToast('Category saved successfully!', 'success');
    }
    
    saveProductForm() {
        const form = document.getElementById('product-form');
        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const price = parseInt(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const category = document.getElementById('product-category').value;
        const image = document.getElementById('product-image').value;
        
        if (form.dataset.editId) {
            // Edit existing product
            const productId = parseInt(form.dataset.editId);
            const productIndex = this.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                this.products[productIndex] = { ...this.products[productIndex], name, description, price, stock, category, image };
                this.updateProductDisplay(productId);
            }
        } else {
            // Add new product
            const newId = Math.max(...this.products.map(p => p.id)) + 1;
            const newProduct = { id: newId, name, description, price, stock, category, image };
            this.products.push(newProduct);
            this.addProductToDOM(newProduct);
        }
        
        this.hideModal('product-modal');
        this.showToast('Product saved successfully!', 'success');
    }
    
    editCategory(categoryId) {
        this.showCategoryModal(categoryId);
    }
    
    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category? All products in this category will also be deleted.')) {
            // Remove category
            this.categories = this.categories.filter(c => c.id !== categoryId);
            
            // Remove products in this category
            this.products = this.products.filter(p => p.category !== categoryId);
            
            // Remove from DOM
            const categorySection = document.querySelector(`[data-category="${categoryId}"]`);
            if (categorySection) {
                categorySection.remove();
            }
            
            // Remove from filter buttons
            const filterBtn = document.querySelector(`[data-category="${categoryId}"]`);
            if (filterBtn && filterBtn.classList.contains('category-filter-btn')) {
                filterBtn.remove();
            }
            
            this.showToast('Category deleted successfully!', 'success');
        }
    }
    
    editProduct(productId) {
        this.showProductModal(productId);
    }
    
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            // Remove from products array
            this.products = this.products.filter(p => p.id !== productId);
            
            // Remove from DOM
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                productCard.remove();
            }
            
            this.showToast('Product deleted successfully!', 'success');
        }
    }
    
    updateCategoryDisplay(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        const categoryHeader = document.querySelector(`[data-category="${categoryId}"] .category-header h3`);
        if (categoryHeader && category) {
            categoryHeader.innerHTML = `<i class="${category.icon}"></i>${category.name}`;
        }
    }
    
    updateProductDisplay(productId) {
        const product = this.products.find(p => p.id === productId);
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        
        if (productCard && product) {
            const img = productCard.querySelector('img');
            const name = productCard.querySelector('h4');
            const desc = productCard.querySelector('.product-desc');
            const price = productCard.querySelector('.price');
            const stock = productCard.querySelector('.stock');
            
            if (product.image) img.src = product.image;
            name.textContent = product.name;
            desc.textContent = product.description;
            price.textContent = this.formatCurrency(product.price);
            stock.textContent = `Stock: ${product.stock}`;
            
            // Move to correct category if changed
            const currentCategory = productCard.closest('.category-section').dataset.category;
            if (currentCategory !== product.category) {
                productCard.remove();
                this.addProductToDOM(product);
            }
        }
    }
    
    addCategoryToDOM(category) {
        // Add to filter buttons
        const categoryFilter = document.querySelector('.category-filter');
        const filterBtn = document.createElement('button');
        filterBtn.className = 'category-filter-btn';
        filterBtn.dataset.category = category.id;
        filterBtn.textContent = category.name;
        categoryFilter.appendChild(filterBtn);
        
        // Add category section
        const categoriesSection = document.querySelector('.categories-section');
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.dataset.category = category.id;
        categorySection.innerHTML = `
            <div class="category-header">
                <h3>
                    <i class="${category.icon}"></i>
                    ${category.name}
                </h3>
                <div class="category-actions">
                    <button class="btn-edit-category" data-category="${category.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-category" data-category="${category.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="products-grid"></div>
        `;
        categoriesSection.appendChild(categorySection);
        
        // Rebind events
        this.bindCategoryActions();
        this.bindMenuEvents();
    }
    
    addProductToDOM(product) {
        const categorySection = document.querySelector(`[data-category="${product.category}"] .products-grid`);
        if (categorySection) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            productCard.dataset.productId = product.id;
            
            const imageUrl = product.image || this.generatePlaceholderImage(product.name);
            
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price-stock">
                        <span class="price">${this.formatCurrency(product.price)}</span>
                        <span class="stock">Stock: ${product.stock}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-edit-product" data-product-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-product" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            categorySection.appendChild(productCard);
            
            // Rebind events
            this.bindProductActions();
        }
    }
    
    generatePlaceholderImage(productName) {
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FECA57', 'FF9FF3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const text = encodeURIComponent(productName.substring(0, 8));
        return `https://via.placeholder.com/150x120/${color}/ffffff?text=${text}`;
    }
    
    formatCurrency(amount) {
        return 'Rp' + amount.toLocaleString('id-ID');
    }
    
    showToast(message, type = 'info') {
        // Use existing toast function from dashboard
        if (window.dashboard && window.dashboard.showToast) {
            window.dashboard.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize menu manager when dashboard is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for dashboard to be initialized
    setTimeout(() => {
        if (window.dashboard) {
            window.menuManager = new MenuManager();
        }
    }, 100);
});



// Store Appearance Settings Manager
class AppearanceManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.applySettings();
        this.bindEvents();
        this.updateUI();
    }

    loadSettings() {
        const defaultSettings = {
            storeName: 'Sadita',
            storeTagline: 'Pilih produk terbaik untuk ternak Anda',
            headerBackground: 'gradient1',
            welcomeBackground: 'green',
            currency: 'IDR',
            language: 'id'
        };

        const saved = localStorage.getItem('storeAppearanceSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('storeAppearanceSettings', JSON.stringify(this.settings));
        this.showToast('Settings saved successfully!', 'success');
    }

    applySettings() {
        // Apply header background
        const header = document.querySelector('.mobile-header');
        if (header) {
            // Remove all background classes
            header.classList.remove('header-gradient1', 'header-gradient2', 'header-gradient3', 
                                   'header-gradient4', 'header-gradient5', 'header-solid1');
            // Add current background class
            header.classList.add(`header-${this.settings.headerBackground}`);
        }

        // Update store name in header
        const logoElement = document.querySelector('.logo');
        if (logoElement) {
            logoElement.textContent = this.settings.storeName;
        }

        // Apply settings to external menu and order pages
        this.updateExternalPages();
    }

    updateExternalPages() {
        // Update menu-integrated.html
        const menuSettings = {
            storeName: this.settings.storeName,
            storeTagline: this.settings.storeTagline,
            headerBackground: this.settings.headerBackground,
            welcomeBackground: this.settings.welcomeBackground
        };
        localStorage.setItem('menuPageSettings', JSON.stringify(menuSettings));

        // Update order-integrated.html
        localStorage.setItem('orderPageSettings', JSON.stringify(menuSettings));
    }

    bindEvents() {
        // Background option selection
        const backgroundOptions = document.querySelectorAll('.background-option');
        backgroundOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                backgroundOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                // Update setting
                this.settings.headerBackground = option.dataset.bg;
                this.applySettings();
            });
        });

        // Welcome background option selection
        const welcomeBgOptions = document.querySelectorAll('.welcome-bg-option');
        welcomeBgOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                welcomeBgOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                // Update setting
                this.settings.welcomeBackground = option.dataset.welcomeBg;
                this.updateExternalPages();
            });
        });

        // Store name input
        const storeNameInput = document.getElementById('storeName');
        if (storeNameInput) {
            storeNameInput.addEventListener('input', (e) => {
                this.settings.storeName = e.target.value;
                this.applySettings();
            });
        }

        // Store tagline input
        const storeTaglineInput = document.getElementById('storeTagline');
        if (storeTaglineInput) {
            storeTaglineInput.addEventListener('input', (e) => {
                this.settings.storeTagline = e.target.value;
                this.updateExternalPages();
            });
        }

        // Currency selection
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                this.settings.currency = e.target.value;
            });
        }

        // Language selection
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
            });
        }
    }

    updateUI() {
        // Update form inputs with current settings
        const storeNameInput = document.getElementById('storeName');
        if (storeNameInput) {
            storeNameInput.value = this.settings.storeName;
        }

        const storeTaglineInput = document.getElementById('storeTagline');
        if (storeTaglineInput) {
            storeTaglineInput.value = this.settings.storeTagline;
        }

        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = this.settings.currency;
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
        }

        // Update active background options
        const backgroundOptions = document.querySelectorAll('.background-option');
        backgroundOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.bg === this.settings.headerBackground);
        });

        const welcomeBgOptions = document.querySelectorAll('.welcome-bg-option');
        welcomeBgOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.welcomeBg === this.settings.welcomeBackground);
        });
    }

    resetToDefault() {
        if (confirm('Are you sure you want to reset all appearance settings to default?')) {
            this.settings = {
                storeName: 'Sadita',
                storeTagline: 'Pilih produk terbaik untuk ternak Anda',
                headerBackground: 'gradient1',
                welcomeBackground: 'green',
                currency: 'IDR',
                language: 'id'
            };
            this.applySettings();
            this.updateUI();
            this.showToast('Settings reset to default', 'info');
        }
    }

    showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions for button onclick events
function saveAppearanceSettings() {
    if (window.appearanceManager) {
        window.appearanceManager.saveSettings();
    }
}

function resetAppearanceSettings() {
    if (window.appearanceManager) {
        window.appearanceManager.resetToDefault();
    }
}

// Initialize appearance manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing dashboard
    window.dashboard = new Dashboard();
    
    // Initialize appearance manager
    window.appearanceManager = new AppearanceManager();
});

// Update menu-integrated.html to use settings
function updateMenuPageWithSettings() {
    const settings = JSON.parse(localStorage.getItem('menuPageSettings') || '{}');
    
    if (settings.storeName) {
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(el => el.textContent = settings.storeName + ' Menu');
    }
    
    if (settings.storeTagline) {
        const taglineElements = document.querySelectorAll('.welcome-card p');
        taglineElements.forEach(el => el.textContent = settings.storeTagline);
    }
    
    if (settings.headerBackground) {
        const headers = document.querySelectorAll('.mobile-header');
        headers.forEach(header => {
            header.classList.remove('header-gradient1', 'header-gradient2', 'header-gradient3', 
                                   'header-gradient4', 'header-gradient5', 'header-solid1');
            header.classList.add(`header-${settings.headerBackground}`);
        });
    }
    
    if (settings.welcomeBackground) {
        const welcomeCards = document.querySelectorAll('.welcome-card');
        welcomeCards.forEach(card => {
            card.classList.remove('welcome-green', 'welcome-blue', 'welcome-purple', 'welcome-orange');
            card.classList.add(`welcome-${settings.welcomeBackground}`);
        });
    }
}

// Update order-integrated.html to use settings
function updateOrderPageWithSettings() {
    const settings = JSON.parse(localStorage.getItem('orderPageSettings') || '{}');
    
    if (settings.storeName) {
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(el => el.textContent = 'Order Details');
    }
    
    if (settings.headerBackground) {
        const headers = document.querySelectorAll('.mobile-header');
        headers.forEach(header => {
            header.classList.remove('header-gradient1', 'header-gradient2', 'header-gradient3', 
                                   'header-gradient4', 'header-gradient5', 'header-solid1');
            header.classList.add(`header-${settings.headerBackground}`);
        });
    }
}

