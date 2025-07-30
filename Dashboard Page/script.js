// Dashboard Mobile-First JavaScript - Enhanced Responsiveness

class Dashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.isMobile = window.innerWidth < 1024;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTooltips();
        this.loadInitialData();
        this.handleResize();
        this.initTouchGestures();
        this.initKeyboardShortcuts();
        this.initAccessibility();
    }

    bindEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeSidebar = document.getElementById('closeSidebar');

        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        if (closeSidebar) {
            closeSidebar.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSidebar();
            });
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
                if (this.isMobile) {
                    this.closeSidebar();
                }
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

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Prevent zoom on double tap for iOS
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            const timeSince = now - this.lastTouchEnd;
            if (timeSince < 300 && timeSince > 0) {
                e.preventDefault();
            }
            this.lastTouchEnd = now;
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar.classList.contains('active')) {
            this.closeSidebar();
        } else {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const firstNavLink = sidebar.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to menu toggle
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle && this.isMobile) {
            menuToggle.focus();
        }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Announce page change for screen readers
        this.announcePageChange(pageName);
    }

    updatePageTitle(pageName) {
        const titles = {
            dashboard: 'Dashboard',
            menu: 'Menu Management',
            orders: 'Orders',
            reports: 'Reports',
            settings: 'Settings',
            profile: 'Profile'
        };

        document.title = `${titles[pageName]} - Dashboard Mobile`;
        
        // Update header title on mobile
        const logo = document.querySelector('.logo');
        if (logo && this.isMobile) {
            logo.textContent = titles[pageName];
        }
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
        // Search functionality dapat digunakan untuk halaman lain jika diperlukan
        console.log('Search query:', query);
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
    }

    initTouchGestures() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
            this.touchStartX = startX;
            this.touchStartY = startY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                isScrolling = false;
                // Horizontal swipe
                if (Math.abs(diffX) > 50 && this.isMobile) {
                    if (diffX > 0) {
                        // Swipe left - close sidebar
                        this.closeSidebar();
                    } else {
                        // Swipe right - open sidebar (only if not already open)
                        const sidebar = document.getElementById('sidebar');
                        if (!sidebar.classList.contains('active') && startX < 50) {
                            this.toggleSidebar();
                        }
                    }
                }
            } else {
                isScrolling = true;
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
            isScrolling = false;
        }, { passive: true });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const keyMap = {
                    '1': 'dashboard',
                    '2': 'menu',
                    '3': 'orders',
                    '4': 'reports',
                    '5': 'settings',
                    '6': 'profile'
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

            // Ctrl + K for search (dapat digunakan untuk halaman lain)
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-box input, .search-input-wrapper input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // Tab navigation in sidebar
            if (e.key === 'Tab') {
                const sidebar = document.getElementById('sidebar');
                if (sidebar.classList.contains('active')) {
                    const focusableElements = sidebar.querySelectorAll('a, button');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            }
        });
    }

    initAccessibility() {
        // Add ARIA labels and roles
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Main navigation');
        }

        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-controls', 'sidebar');
        }

        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
            border-radius: 4px;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 1024;

        // Close sidebar on desktop
        if (!this.isMobile && wasMobile !== this.isMobile) {
            this.closeSidebar();
        }

        // Update menu toggle aria-expanded
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active').toString());
        }

        // Update chart sizes if needed
        this.updateChartSizes();

        // Adjust grid layouts based on screen size
        this.adjustGridLayouts();
    }

    adjustGridLayouts() {
        const width = window.innerWidth;
        const statsGrid = document.querySelector('.stats-grid');
        const productsGrids = document.querySelectorAll('.products-grid');

        if (statsGrid) {
            if (width < 375) {
                statsGrid.style.gridTemplateColumns = '1fr 1fr';
            } else if (width < 768) {
                statsGrid.style.gridTemplateColumns = '1fr 1fr';
            } else if (width < 1024) {
                statsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                statsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        }

        productsGrids.forEach(grid => {
            if (width < 425) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (width < 768) {
                grid.style.gridTemplateColumns = '1fr';
            } else if (width < 1024) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else if (width < 1280) {
                grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            } else {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        });
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
            case 'reports':
                this.generateReports();
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
        }, 1000);
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
        const container = document.querySelector(selector);
        if (container && container.innerHTML.includes('Loading...')) {
            // Restore original content here
            location.reload(); // Simple way for demo
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

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle" style="margin-right: 8px;"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    updateChartSizes() {
        // Update chart containers for responsive design
        const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
        chartPlaceholders.forEach(chart => {
            chart.style.height = this.isMobile ? '150px' : '200px';
        });
    }

    initializeTooltips() {
        // Add tooltips for better UX on desktop
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            if (!this.isMobile) {
                element.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, e.target.getAttribute('title'));
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            }
        });
    }

    showTooltip(element, text) {
        if (this.isMobile) return;
        
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
            max-width: 200px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 8;
        
        // Adjust if tooltip goes off screen
        if (left < 0) left = 8;
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }
        if (top < 0) {
            top = rect.bottom + 8;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            document.body.removeChild(tooltip);
        }
    }

    announcePageChange(pageName) {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = `Navigated to ${pageName} page`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Menu Management System - Enhanced for Mobile
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
        this.initMobileOptimizations();
    }

    initMobileOptimizations() {
        // Optimize touch interactions
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            }, { passive: true });
        });

        // Optimize category filter scrolling
        const categoryFilter = document.querySelector('.category-filter');
        if (categoryFilter) {
            let isScrolling = false;
            categoryFilter.addEventListener('touchstart', () => {
                isScrolling = false;
            }, { passive: true });
            
            categoryFilter.addEventListener('touchmove', () => {
                isScrolling = true;
            }, { passive: true });
            
            categoryFilter.addEventListener('touchend', (e) => {
                if (!isScrolling && e.target.classList.contains('category-filter-btn')) {
                    e.target.click();
                }
            }, { passive: true });
        }
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
        
        // Search functionality with debounce
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 300);
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
                section.style.animation = 'fadeIn 0.3s ease';
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
                card.style.animation = 'fadeIn 0.3s ease';
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
        // Create category modal with mobile optimizations
        const categoryModal = document.createElement('div');
        categoryModal.id = 'category-modal';
        categoryModal.className = 'modal';
        categoryModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add/Edit Category</h3>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <form class="modal-form" id="category-form">
                    <div class="form-row">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" required autocomplete="off">
                    </div>
                    <div class="form-row">
                        <label for="category-icon">Icon Class</label>
                        <input type="text" id="category-icon" placeholder="fas fa-pills" autocomplete="off">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel">Cancel</button>
                        <button type="submit" class="btn-save">Save</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(categoryModal);
        
        // Create product modal with mobile optimizations
        const productModal = document.createElement('div');
        productModal.id = 'product-modal';
        productModal.className = 'modal';
        productModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add/Edit Product</h3>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <form class="modal-form" id="product-form">
                    <div class="form-row">
                        <label for="product-name">Product Name</label>
                        <input type="text" id="product-name" required autocomplete="off">
                    </div>
                    <div class="form-row">
                        <label for="product-description">Description</label>
                        <textarea id="product-description" required rows="3"></textarea>
                    </div>
                    <div class="form-row">
                        <label for="product-price">Price (Rp)</label>
                        <input type="number" id="product-price" required min="0" step="100">
                    </div>
                    <div class="form-row">
                        <label for="product-stock">Stock</label>
                        <input type="number" id="product-stock" required min="0">
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
        
        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 2000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
            }
            
            .modal.active {
                display: flex;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                width: 100%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1e293b;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #64748b;
                padding: 4px;
                border-radius: 4px;
                min-width: 32px;
                min-height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                background: #f1f5f9;
                color: #1e293b;
            }
            
            .modal-form {
                padding: 20px;
            }
            
            .form-row {
                margin-bottom: 16px;
            }
            
            .form-row label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
                margin-bottom: 6px;
            }
            
            .form-row input,
            .form-row select,
            .form-row textarea {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                font-size: 14px;
                background: white;
                min-height: 40px;
                font-family: inherit;
            }
            
            .form-row textarea {
                resize: vertical;
                min-height: 80px;
            }
            
            .form-row input:focus,
            .form-row select:focus,
            .form-row textarea:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .modal-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #e2e8f0;
            }
            
            .btn-cancel {
                background: #f1f5f9;
                color: #475569;
                border: 1px solid #e2e8f0;
                padding: 10px 16px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 14px;
                min-height: 40px;
            }
            
            .btn-save {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 14px;
                min-height: 40px;
            }
            
            .btn-cancel:hover {
                background: #e2e8f0;
            }
            
            .btn-save:hover {
                background: #3730a3;
            }
            
            @media (max-width: 480px) {
                .modal {
                    padding: 8px;
                }
                
                .modal-content {
                    max-height: 95vh;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .btn-cancel,
                .btn-save {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(modalStyles);
        
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
        
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCategoryForm();
            });
        }
        
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProductForm();
            });
        }
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
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    saveCategoryForm() {
        const form = document.getElementById('category-form');
        const name = document.getElementById('category-name').value.trim();
        const icon = document.getElementById('category-icon').value.trim() || 'fas fa-folder';
        
        if (!name) {
            this.showToast('Please enter a category name', 'warning');
            return;
        }
        
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
            const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const newCategory = { id: newId, name, icon };
            this.categories.push(newCategory);
            this.addCategoryToDOM(newCategory);
        }
        
        this.hideModal('category-modal');
        this.showToast('Category saved successfully!', 'success');
    }
    
    saveProductForm() {
        const form = document.getElementById('product-form');
        const name = document.getElementById('product-name').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const price = parseInt(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const category = document.getElementById('product-category').value;
        const image = document.getElementById('product-image').value.trim();
        
        if (!name || !description || !price || !stock || !category) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }
        
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
            const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
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
                productCard.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    productCard.remove();
                }, 300);
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
                    <button class="btn-edit-category" data-category="${category.id}" aria-label="Edit category">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-category" data-category="${category.id}" aria-label="Delete category">
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
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price-stock">
                        <span class="price">${this.formatCurrency(product.price)}</span>
                        <span class="stock">Stock: ${product.stock}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-edit-product" data-product-id="${product.id}" aria-label="Edit product">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete-product" data-product-id="${product.id}" aria-label="Delete product">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            categorySection.appendChild(productCard);
            
            // Add animation
            productCard.style.animation = 'fadeIn 0.3s ease';
            
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

// Store Appearance Settings Manager - Enhanced for Mobile
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
        if (logoElement && !window.dashboard?.isMobile) {
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
        // Background option selection with touch optimization
        const backgroundOptions = document.querySelectorAll('.background-option');
        backgroundOptions.forEach(option => {
            // Mouse events
            option.addEventListener('click', () => {
                this.selectBackgroundOption(option, backgroundOptions);
            });
            
            // Touch events for better mobile experience
            option.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.selectBackgroundOption(option, backgroundOptions);
            });
        });

        // Welcome background option selection
        const welcomeBgOptions = document.querySelectorAll('.welcome-bg-option');
        welcomeBgOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectWelcomeOption(option, welcomeBgOptions);
            });
            
            option.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.selectWelcomeOption(option, welcomeBgOptions);
            });
        });

        // Store name input with debounce
        const storeNameInput = document.getElementById('storeName');
        if (storeNameInput) {
            let nameTimeout;
            storeNameInput.addEventListener('input', (e) => {
                clearTimeout(nameTimeout);
                nameTimeout = setTimeout(() => {
                    this.settings.storeName = e.target.value;
                    this.applySettings();
                }, 500);
            });
        }

        // Store tagline input with debounce
        const storeTaglineInput = document.getElementById('storeTagline');
        if (storeTaglineInput) {
            let taglineTimeout;
            storeTaglineInput.addEventListener('input', (e) => {
                clearTimeout(taglineTimeout);
                taglineTimeout = setTimeout(() => {
                    this.settings.storeTagline = e.target.value;
                    this.updateExternalPages();
                }, 500);
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

    selectBackgroundOption(selectedOption, allOptions) {
        // Remove active class from all options
        allOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to selected option
        selectedOption.classList.add('active');
        // Update setting
        this.settings.headerBackground = selectedOption.dataset.bg;
        this.applySettings();
        
        // Haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    selectWelcomeOption(selectedOption, allOptions) {
        // Remove active class from all options
        allOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to selected option
        selectedOption.classList.add('active');
        // Update setting
        this.settings.welcomeBackground = selectedOption.dataset.welcomeBg;
        this.updateExternalPages();
        
        // Haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
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
        if (window.dashboard && window.dashboard.showToast) {
            window.dashboard.showToast(message, type);
        } else {
            // Fallback toast
            const toast = document.createElement('div');
            toast.className = `toast ${type} show`;
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 80px;
                right: 16px;
                background: ${type === 'success' ? '#059669' : '#0ea5e9'};
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 2000;
                max-width: calc(100vw - 32px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing dashboard
    window.dashboard = new Dashboard();
    
    // Initialize menu manager
    setTimeout(() => {
        window.menuManager = new MenuManager();
    }, 100);
    
    // Initialize appearance manager
    window.appearanceManager = new AppearanceManager();
    
    // Add loading complete indicator
    console.log('Dashboard Mobile-First initialized successfully!');
    console.log('Features: Responsive design, Touch gestures, Keyboard shortcuts, Accessibility');
    console.log('Keyboard shortcuts:');
    console.log('- Alt + 1-6: Quick navigation');
    console.log('- Escape: Close sidebar');
    console.log('- Ctrl + K: Focus search');
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

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}



// Welcome Card Customization Functions
function loadWelcomeCardSettings() {
    const settings = localStorage.getItem('welcomeCardSettings');
    if (settings) {
        const parsedSettings = JSON.parse(settings);
        applyWelcomeCardSettings(parsedSettings);
    }
}

function applyWelcomeCardSettings(settings) {
    const welcomeCard = document.getElementById('welcomeCard');
    const welcomeLogo = document.getElementById('welcomeLogo');
    
    if (settings.backgroundImage) {
        welcomeCard.style.backgroundImage = `url(${settings.backgroundImage})`;
        welcomeCard.classList.add('with-background');
    }
    
    if (settings.logoImage) {
        welcomeLogo.src = settings.logoImage;
        welcomeLogo.style.display = 'block';
    }
}

function initializeWelcomeCardCustomization() {
    const backgroundUpload = document.getElementById('backgroundUpload');
    const logoUpload = document.getElementById('logoUpload');
    const saveButton = document.getElementById('saveSettings');
    const resetButton = document.getElementById('resetSettings');
    const preview = document.getElementById('welcomeCardPreview');
    const previewLogo = document.getElementById('welcomeLogoPreview');

    let currentSettings = {
        backgroundImage: null,
        logoImage: null
    };

    // Background upload handler
    if (backgroundUpload) {
        backgroundUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Ukuran file background terlalu besar (max 2MB)', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentSettings.backgroundImage = e.target.result;
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    preview.classList.add('with-background');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Logo upload handler
    if (logoUpload) {
        logoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1 * 1024 * 1024) {
                    showToast('Ukuran file logo terlalu besar (max 1MB)', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentSettings.logoImage = e.target.result;
                    previewLogo.src = e.target.result;
                    previewLogo.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save settings
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            localStorage.setItem('welcomeCardSettings', JSON.stringify(currentSettings));
            applyWelcomeCardSettings(currentSettings);
            showToast('Pengaturan berhasil disimpan!', 'success');
        });
    }

    // Reset settings
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            localStorage.removeItem('welcomeCardSettings');
            currentSettings = { backgroundImage: null, logoImage: null };
            
            // Reset preview
            preview.style.backgroundImage = '';
            preview.classList.remove('with-background');
            previewLogo.style.display = 'none';
            
            // Reset actual welcome card
            const welcomeCard = document.getElementById('welcomeCard');
            const welcomeLogo = document.getElementById('welcomeLogo');
            if (welcomeCard) {
                welcomeCard.style.backgroundImage = '';
                welcomeCard.classList.remove('with-background');
            }
            if (welcomeLogo) {
                welcomeLogo.style.display = 'none';
            }
            
            // Reset file inputs
            backgroundUpload.value = '';
            logoUpload.value = '';
            
            showToast('Pengaturan berhasil direset!', 'success');
        });
    }
}

// Reports Functions
function initializeReports() {
    loadOrderData();
    initializeReportTabs();
    initializeCharts();
    loadReportData();
}

function initializeReportTabs() {
    // Main tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchReportTab(tabId);
        });
    });

    // Sub-tab navigation
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    subTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subTabId = this.getAttribute('data-sub-tab');
            switchSubTab(subTabId);
        });
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button-report');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            filterOrdersByStatus(status);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('order-search-report');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchOrders(this.value);
        });
    }

    // Export buttons
    const exportPdfBtn = document.getElementById('exportPdf');
    const exportCsvBtn = document.getElementById('exportCsv');
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPdf);
    }
    
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCsv);
    }
}

function switchReportTab(tabId) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update tab content
    const tabSections = document.querySelectorAll('.tab-content-section');
    tabSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

function switchSubTab(subTabId) {
    // Update sub-tab buttons
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    subTabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-sub-tab="${subTabId}"]`).classList.add('active');

    // Update sub-tab content
    const subTabSections = document.querySelectorAll('#other-reports-tab .tab-content-section');
    subTabSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${subTabId}-report-section`).classList.add('active');
}

async function loadOrderData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        window.ordersData = data.orders;
        displayOrders(data.orders);
    } catch (error) {
        console.error('Error loading order data:', error);
        window.ordersData = [];
    }
}

function displayOrders(orders) {
    const orderList = document.getElementById('order-list-report');
    if (!orderList) return;

    if (orders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-state-report">
                <i class="fas fa-inbox"></i>
                <p>Tidak ada pesanan ditemukan</p>
            </div>
        `;
        return;
    }

    orderList.innerHTML = orders.map(order => `
        <div class="order-item-report" data-status="${order.status}">
            <div class="order-header-report">
                <span class="order-id-report">${order.id}</span>
                <span class="order-status-report status-${order.status}-report">${getStatusText(order.status)}</span>
            </div>
            <div class="order-info-report">
                <span>Pelanggan:</span>
                <span>${order.customerName}</span>
                <span>Tanggal:</span>
                <span>${formatDate(order.orderDate)}</span>
            </div>
            <div class="order-total-report">Total: ${formatCurrency(order.totalPrice)}</div>
            <div class="order-actions-report">
                <button class="btn-report" onclick="viewOrderDetail('${order.id}')">Detail</button>
                <button class="btn-report btn-secondary-report" onclick="printOrder('${order.id}')">Print</button>
            </div>
        </div>
    `).join('');
}

function filterOrdersByStatus(status) {
    if (!window.ordersData) return;
    
    let filteredOrders = window.ordersData;
    if (status !== 'all') {
        filteredOrders = window.ordersData.filter(order => order.status === status);
    }
    
    displayOrders(filteredOrders);
}

function searchOrders(query) {
    if (!window.ordersData) return;
    
    const filteredOrders = window.ordersData.filter(order => 
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase())
    );
    
    displayOrders(filteredOrders);
}

function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['25 Jul', '26 Jul', '27 Jul', '28 Jul', '29 Jul'],
                datasets: [{
                    label: 'Penjualan Harian',
                    data: [1200000, 850000, 1500000, 1100000, 1300000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Rp' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    // New Customers Chart
    const newCustomersCtx = document.getElementById('newCustomersChart');
    if (newCustomersCtx) {
        new Chart(newCustomersCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Pelanggan Baru',
                    data: [50, 60, 75, 65, 80, 85, 90],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Inventory Turnover Chart
    const inventoryCtx = document.getElementById('inventoryTurnoverChart');
    if (inventoryCtx) {
        new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotik', 'Vitamin', 'Anti Coccidia', 'Antiparasi'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Payment Method Chart
    const paymentCtx = document.getElementById('paymentMethodChart');
    if (paymentCtx) {
        new Chart(paymentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Transfer Bank', 'Cash', 'E-Wallet', 'Kredit'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

async function loadReportData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Load top products
        loadTopProducts(data.topProducts);
        
        // Load top customers
        loadTopCustomers(data.topCustomers);
        
        // Load low stock products
        loadLowStockProducts(data.lowStockProducts);
        
        // Load payment status
        loadPaymentStatus(data.paymentStatus);
        
        // Update revenue stats
        updateRevenueStats(data.revenueStats);
        
    } catch (error) {
        console.error('Error loading report data:', error);
    }
}

function loadTopProducts(products) {
    const list = document.getElementById('topProductsList');
    if (!list || !products) return;
    
    list.innerHTML = products.map((product, index) => `
        <div class="order-item">
            <span class="order-id">#${index + 1}</span>
            <span class="order-customer">${product.name}</span>
            <span class="order-status completed">${product.sold} terjual</span>
        </div>
    `).join('');
}

function loadTopCustomers(customers) {
    const list = document.getElementById('topCustomersList');
    if (!list || !customers) return;
    
    list.innerHTML = customers.map((customer, index) => `
        <div class="order-item">
            <span class="order-id">#${index + 1}</span>
            <span class="order-customer">${customer.name}</span>
            <span class="order-status completed">${formatCurrency(customer.totalSpent)}</span>
        </div>
    `).join('');
}

function loadLowStockProducts(products) {
    const list = document.getElementById('lowStockList');
    if (!list || !products) return;
    
    list.innerHTML = products.map(product => `
        <div class="order-item">
            <span class="order-id">${product.name}</span>
            <span class="order-customer">Stok: ${product.stock}</span>
            <span class="order-status pending">Perlu Restock</span>
        </div>
    `).join('');
}

function loadPaymentStatus(payments) {
    const list = document.getElementById('paymentStatusList');
    if (!list || !payments) return;
    
    list.innerHTML = payments.map(payment => `
        <div class="order-item">
            <span class="order-id">${payment.method}</span>
            <span class="order-customer">${payment.count} transaksi</span>
            <span class="order-status ${payment.status === 'Lunas' ? 'completed' : 'pending'}">${payment.status}</span>
        </div>
    `).join('');
}

function updateRevenueStats(stats) {
    if (!stats) return;
    
    const todayElement = document.getElementById('todayRevenue');
    const weekElement = document.getElementById('weekRevenue');
    const monthElement = document.getElementById('monthRevenue');
    
    if (todayElement) todayElement.textContent = formatCurrency(stats.today);
    if (weekElement) weekElement.textContent = formatCurrency(stats.week);
    if (monthElement) monthElement.textContent = formatCurrency(stats.month);
}

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'processing': 'Diproses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function viewOrderDetail(orderId) {
    showToast(`Melihat detail pesanan ${orderId}`, 'success');
}

function printOrder(orderId) {
    showToast(`Mencetak pesanan ${orderId}`, 'success');
}

function exportToPdf() {
    showToast('Export PDF sedang diproses...', 'success');
}

function exportToCsv() {
    showToast('Export CSV sedang diproses...', 'success');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadWelcomeCardSettings();
    initializeWelcomeCardCustomization();
    initializeReports();
});

