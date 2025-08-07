// Dashboard Mobile-First JavaScript - Enhanced Responsiveness

class Dashboard {
    constructor() {
        this.isMobile = window.innerWidth < 1024;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTooltips();
        this.handleResize();
        this.initTouchGestures();
        this.initKeyboardShortcuts();
        this.initAccessibility();
        
        // Navigate to the page specified in the URL hash, or default to 'dashboard'
        const initialPage = window.location.hash.substring(1) || 'dashboard';
        this.navigateToPage(initialPage);
    }

    bindEvents() {
        // --- PERBAIKAN UTAMA ADA DI SINI ---
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebarBtn = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');

        // Event listener untuk tombol buka menu (hamburger)
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        // Event listener untuk tombol tutup (X) di dalam sidebar
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSidebar();
            });
        }

        // Event listener untuk overlay (menutup sidebar saat diklik di luar)
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }
        // --- AKHIR DARI PERBAIKAN ---

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

        // Filter tabs for Orders page
        const orderFilterTabs = document.querySelectorAll('#orders-page .tab');
        orderFilterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.handleOrderFilterTab(tab));
        });

        // Search functionality for Orders page
        const orderSearchInput = document.querySelector('#order-search-input');
        if (orderSearchInput) {
            orderSearchInput.addEventListener('input', (e) => this.handleOrderSearch(e.target.value));
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
            const timeSince = now - (this.lastTouchEnd || 0);
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
        console.log('Navigating to page:', pageName);
        
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            console.log('Page activated:', pageName);
        } else {
            console.error('Target page not found:', `${pageName}-page`);
            // Fallback to dashboard if page not found
            const dashboardPage = document.getElementById('dashboard-page');
            if (dashboardPage) dashboardPage.classList.add('active');
            pageName = 'dashboard';
        }

        // Update navigation active state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));

        const activeNavItem = document.querySelector(`[data-page="${pageName}"]`)?.closest('.nav-item');
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update URL hash
        window.location.hash = pageName;

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
            orders: 'Order Status',
            reports: 'Reports',
            settings: 'Settings',
            profile: 'Profile'
        };

        document.title = `${titles[pageName] || 'Dashboard'} - Dashboard Mobile`;
        
        // Update header title on mobile
        const logo = document.querySelector('.logo');
        if (logo && this.isMobile) {
            logo.textContent = titles[pageName] || 'Dashboard';
        }
    }

    // Orders functionality
    async loadOrders() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.ordersData = data.orders;
            this.displayOrders(this.ordersData);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.loadSampleOrders();
        }
    }

    loadSampleOrders() {
        this.ordersData = [
            { id: '#001', customerName: 'Budi Santoso', orderDate: '2025-07-28', totalPrice: 252150, status: 'completed' },
            { id: '#002', customerName: 'Siti Aminah', orderDate: '2025-07-29', totalPrice: 89500, status: 'pending' },
            { id: '#003', customerName: 'Joko Susilo', orderDate: '2025-07-27', totalPrice: 145200, status: 'processing' },
            { id: '#004', customerName: 'Dewi Lestari', orderDate: '2025-07-26', totalPrice: 75000, status: 'cancelled' },
            { id: '#005', customerName: 'Agus Salim', orderDate: '2025-07-29', totalPrice: 52500, status: 'pending' }
        ];
        this.displayOrders(this.ordersData);
    }

    displayOrders(orders) {
        const ordersList = document.getElementById('order-status-list');
        if (!ordersList) return;

        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tidak ada pesanan ditemukan</p>
                </div>
            `;
            return;
        }

        const ordersHTML = orders.map(order => `
            <div class="order-card" data-status="${order.status}">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                </div>
                <div class="order-details">
                    <div class="order-customer">
                        <i class="fas fa-user"></i>
                        ${order.customerName}
                    </div>
                    <div class="order-meta">
                        <div class="order-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(order.orderDate)}
                        </div>
                        <div class="order-amount">
                            <i class="fas fa-money-bill"></i>
                            ${this.formatCurrency(order.totalPrice)}
                        </div>
                    </div>
                </div>
                ${(order.status === 'pending' || order.status === 'processing') ? `
                    <div class="order-actions">
                        <button class="btn-complete" onclick="window.dashboard.completeOrder('${order.id}')">
                            <i class="fas fa-check"></i>
                            Selesai
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        ordersList.innerHTML = ordersHTML;
    }

    handleOrderFilterTab(clickedTab) {
        // Remove active class from all tabs in Orders page
        const tabs = document.querySelectorAll('#orders-page .tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked tab
        clickedTab.classList.add('active');

        // Filter content based on tab
        const filterValue = clickedTab.getAttribute('data-status');
        this.filterOrdersByStatus(filterValue);
    }

    filterOrdersByStatus(status) {
        if (!this.ordersData) return;

        let filteredOrders = this.ordersData;
        if (status !== 'all') {
            filteredOrders = this.ordersData.filter(order => order.status === status);
        }

        this.displayOrders(filteredOrders);
    }

    handleOrderSearch(query) {
        if (!this.ordersData) return;

        const searchTerm = query.toLowerCase();
        const filteredOrders = this.ordersData.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm)
        );

        this.displayOrders(filteredOrders);
    }

    completeOrder(orderId) {
        if (!this.ordersData) return;

        const orderIndex = this.ordersData.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            this.ordersData[orderIndex].status = 'completed';
            
            // Show success message
            this.showToast(`Pesanan ${orderId} telah diselesaikan!`, 'success');
            
            // Refresh display
            const activeTab = document.querySelector('#orders-page .tab.active');
            if (activeTab) {
                const filterValue = activeTab.getAttribute('data-status');
                this.filterOrdersByStatus(filterValue);
            } else {
                this.displayOrders(this.ordersData);
            }
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Diproses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return statusMap[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    bindFormEvents() {
        // Settings form
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Shop info form
        const saveShopInfoBtn = document.getElementById('saveShopInfo');
        if (saveShopInfoBtn) {
            saveShopInfoBtn.addEventListener('click', () => this.saveShopInfo());
        }

        // Profile form
        const saveProfileBtn = document.querySelector('.profile-save-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
    }

    initTouchGestures() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            this.touchStartX = startX;
            this.touchStartY = startY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;

            if (Math.abs(diffX) > 50 && this.isMobile) {
                if (diffX > 0) {
                    this.closeSidebar();
                } else {
                    const sidebar = document.getElementById('sidebar');
                    if (!sidebar.classList.contains('active') && startX < 50) {
                        this.toggleSidebar();
                    }
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
        }, { passive: true });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const keyMap = {
                    '1': 'dashboard', '2': 'menu', '3': 'orders',
                    '4': 'reports', '5': 'settings', '6': 'profile'
                };
                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.navigateToPage(keyMap[e.key]);
                }
            }
            if (e.key === 'Escape') this.closeSidebar();
        });
    }

    initAccessibility() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Main navigation');
        }
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.setAttribute('aria-controls', 'sidebar');
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 1024;

        if (!this.isMobile && wasMobile !== this.isMobile) {
            this.closeSidebar();
        }

        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.setAttribute('aria-expanded', sidebar.classList.contains('active').toString());
        }
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.updateDashboardStats();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'settings':
                this.loadShopInfo();
                break;
        }
    }

    updateDashboardStats() {
        // Placeholder for stats update
    }

    saveSettings() {
        this.showToast('Pengaturan umum berhasil disimpan!', 'success');
    }

    saveShopInfo() {
        const shopName = document.getElementById('shopName').value;
        const shopAddress = document.getElementById('shopAddress').value;
        const shopContact = document.getElementById('shopContact').value;
        const shopLogoInput = document.getElementById('shopLogo');
        
        // Collect operating hours
        const operatingHours = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach(day => {
            const enabled = document.getElementById(`${day}-enabled`).checked;
            const openTime = document.getElementById(`${day}-open`).value;
            const closeTime = document.getElementById(`${day}-close`).value;
            
            operatingHours[day] = {
                enabled: enabled,
                open: openTime,
                close: closeTime
            };
        });
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const shopLogo = e.target.result;
            const shopInfo = {
                name: shopName,
                logo: shopLogo,
                address: shopAddress,
                contact: shopContact,
                operatingHours: operatingHours
            };
            localStorage.setItem('shopInfo', JSON.stringify(shopInfo));
            this.showToast('Informasi toko berhasil disimpan!', 'success');
            this.loadShopInfo(); // Reload to update preview
        };
        
        if (shopLogoInput.files[0]) {
            reader.readAsDataURL(shopLogoInput.files[0]);
        } else {
            // If no new logo is selected, retain the existing one or set to null
            const existingShopInfo = JSON.parse(localStorage.getItem('shopInfo')) || {};
            const shopInfo = {
                name: shopName,
                logo: existingShopInfo.logo || null,
                address: shopAddress,
                contact: shopContact,
                operatingHours: operatingHours
            };
            localStorage.setItem('shopInfo', JSON.stringify(shopInfo));
            this.showToast('Informasi toko berhasil disimpan!', 'success');
            this.loadShopInfo();
        }
    }

    loadShopInfo() {
        const shopInfo = JSON.parse(localStorage.getItem('shopInfo'));
        if (shopInfo) {
            document.getElementById('shopName').value = shopInfo.name || '';
            document.getElementById('shopAddress').value = shopInfo.address || '';
            document.getElementById('shopContact').value = shopInfo.contact || '';
            
            const shopLogoPreview = document.getElementById('shopLogoPreview');
            if (shopInfo.logo) {
                shopLogoPreview.src = shopInfo.logo;
                shopLogoPreview.style.display = 'block';
            } else {
                shopLogoPreview.style.display = 'none';
            }
            
            // Load operating hours
            if (shopInfo.operatingHours) {
                const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                
                days.forEach(day => {
                    const dayData = shopInfo.operatingHours[day];
                    if (dayData) {
                        const checkbox = document.getElementById(`${day}-enabled`);
                        const openInput = document.getElementById(`${day}-open`);
                        const closeInput = document.getElementById(`${day}-close`);
                        
                        checkbox.checked = dayData.enabled || false;
                        openInput.value = dayData.open || '';
                        closeInput.value = dayData.close || '';
                        
                        // Enable/disable time inputs based on checkbox
                        openInput.disabled = !dayData.enabled;
                        closeInput.disabled = !dayData.enabled;
                    }
                });
            }
        }
        
        // Initialize operating hours event listeners
        this.initOperatingHoursListeners();
    }

    initOperatingHoursListeners() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        days.forEach(day => {
            const checkbox = document.getElementById(`${day}-enabled`);
            const openInput = document.getElementById(`${day}-open`);
            const closeInput = document.getElementById(`${day}-close`);
            
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    const isEnabled = e.target.checked;
                    openInput.disabled = !isEnabled;
                    closeInput.disabled = !isEnabled;
                    
                    if (!isEnabled) {
                        openInput.value = '';
                        closeInput.value = '';
                    } else {
                        // Set default times if enabled
                        if (!openInput.value) openInput.value = '08:00';
                        if (!closeInput.value) closeInput.value = '17:00';
                    }
                });
            }
        });
    }

    saveProfile() {
        this.showToast('Profil berhasil disimpan!', 'success');
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    initializeTooltips() {
        // Placeholder for tooltip initialization
    }

    announcePageChange(pageName) {
        // Announce page change for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigated to ${pageName} page`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

