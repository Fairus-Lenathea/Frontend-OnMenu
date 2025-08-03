// Dashboard Navigation and Integration Script
class DashboardManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.bindNavigationEvents();
        this.bindSidebarEvents();
        this.initializePages();
        this.loadInitialPage();
    }

    bindNavigationEvents() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.navigateToPage(pageId);
                this.setActiveNavItem(link.parentElement);
            });
        });
    }

    bindSidebarEvents() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    navigateToPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            
            // Close sidebar on mobile after navigation
            this.closeSidebar();
            
            // Initialize page-specific functionality
            this.initializePage(pageId);
        }
    }

    setActiveNavItem(navItem) {
        // Remove active class from all nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        if (navItem) {
            navItem.classList.add('active');
        }
    }

    initializePages() {
        // Initialize dashboard page
        this.initializeDashboardPage();
        
        // Initialize orders page
        this.initializeOrdersPage();
        
        // Initialize menu page
        this.initializeMenuPage();
        
        // Initialize reports page
        this.initializeReportsPage();
        
        // Initialize settings page
        this.initializeSettingsPage();
        
        // Initialize profile page
        this.initializeProfilePage();
    }

    initializePage(pageId) {
        switch(pageId) {
            case 'dashboard':
                this.refreshDashboardData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'menu':
                this.loadMenuData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'settings':
                // Settings page initialization is handled by header-customization.js
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    initializeDashboardPage() {
        // Dashboard initialization logic
        console.log('Dashboard page initialized');
    }

    initializeOrdersPage() {
        // Orders page initialization
        this.setupOrderFilters();
        this.setupOrderSearch();
    }

    initializeMenuPage() {
        // Menu page initialization
        this.setupMenuFilters();
        this.setupMenuSearch();
        this.setupMenuActions();
    }

    initializeReportsPage() {
        // Reports page initialization
        this.setupReportTabs();
        this.setupDateFilters();
    }

    initializeSettingsPage() {
        // Settings page initialization
        console.log('Settings page initialized');
        // Header customization is handled by header-customization.js
    }

    initializeProfilePage() {
        // Profile page initialization
        this.setupProfileForm();
    }

    setupOrderFilters() {
        const filterTabs = document.querySelectorAll('.tab[data-status]');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Filter orders by status
                const status = tab.getAttribute('data-status');
                this.filterOrdersByStatus(status);
            });
        });
    }

    setupOrderSearch() {
        const searchInput = document.getElementById('order-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchOrders(e.target.value);
            });
        }
    }

    setupMenuFilters() {
        const categoryBtns = document.querySelectorAll('.category-filter-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Filter products by category
                const category = btn.getAttribute('data-category');
                this.filterProductsByCategory(category);
            });
        });
    }

    setupMenuSearch() {
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    setupMenuActions() {
        // Add product button
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductModal();
            });
        }

        // Add category button
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showAddCategoryModal();
            });
        }

        // Product action buttons
        this.bindProductActions();
    }

    setupReportTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchReportTab(tabId);
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    setupDateFilters() {
        const applyFilterBtn = document.getElementById('applyDateFilter');
        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                this.applyDateFilter(startDate, endDate);
            });
        }
    }

    setupProfileForm() {
        const saveBtn = document.querySelector('.profile-save-btn');
        const cancelBtn = document.querySelector('.profile-cancel-btn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveProfileChanges();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelProfileChanges();
            });
        }
    }

    // Data loading methods
    refreshDashboardData() {
        // Simulate data refresh
        console.log('Refreshing dashboard data...');
    }

    loadOrdersData() {
        // Load orders data
        console.log('Loading orders data...');
        this.renderOrdersList();
    }

    loadMenuData() {
        // Load menu data
        console.log('Loading menu data...');
    }

    loadReportsData() {
        // Load reports data
        console.log('Loading reports data...');
        this.initializeCharts();
    }

    loadProfileData() {
        // Load profile data
        console.log('Loading profile data...');
    }

    // Filter and search methods
    filterOrdersByStatus(status) {
        const orderCards = document.querySelectorAll('.order-card');
        orderCards.forEach(card => {
            const orderStatus = card.getAttribute('data-status');
            if (status === 'all' || orderStatus === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchOrders(query) {
        const orderCards = document.querySelectorAll('.order-card');
        const searchTerm = query.toLowerCase();
        
        orderCards.forEach(card => {
            const orderText = card.textContent.toLowerCase();
            if (orderText.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterProductsByCategory(category) {
        const categorySection = document.querySelectorAll('.category-section');
        categorySection.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            if (category === 'all' || sectionCategory === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
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
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Report methods
    switchReportTab(tabId) {
        // Hide all tab content sections
        const tabSections = document.querySelectorAll('.tab-content-section');
        tabSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target tab content
        const targetSection = document.getElementById(`${tabId}-report-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    applyDateFilter(startDate, endDate) {
        console.log(`Applying date filter: ${startDate} to ${endDate}`);
        // Implement date filtering logic
    }

    initializeCharts() {
        // Initialize Chart.js charts
        this.initializeSalesChart();
        this.initializeCustomersChart();
        this.initializeInventoryChart();
        this.initializePaymentChart();
    }

    initializeSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Penjualan',
                        data: [12, 19, 3, 5, 2, 3],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    initializeCustomersChart() {
        const ctx = document.getElementById('newCustomersChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Pelanggan Baru',
                        data: [5, 8, 3, 7, 4, 6],
                        backgroundColor: '#10b981'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    initializeInventoryChart() {
        const ctx = document.getElementById('inventoryTurnoverChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Antibiotik', 'Vitamin', 'Anti Coccidia', 'Antiparasi'],
                    datasets: [{
                        data: [30, 25, 25, 20],
                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    initializePaymentChart() {
        const ctx = document.getElementById('paymentMethodChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Cash', 'Transfer', 'E-Wallet'],
                    datasets: [{
                        data: [40, 35, 25],
                        backgroundColor: ['#8b5cf6', '#06b6d4', '#84cc16']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // Modal and form methods
    showAddProductModal() {
        // Implement add product modal
        console.log('Show add product modal');
    }

    showAddCategoryModal() {
        // Implement add category modal
        console.log('Show add category modal');
    }

    bindProductActions() {
        // Edit product buttons
        const editBtns = document.querySelectorAll('.btn-edit-product');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.getAttribute('data-product-id');
                this.editProduct(productId);
            });
        });

        // Delete product buttons
        const deleteBtns = document.querySelectorAll('.btn-delete-product');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.getAttribute('data-product-id');
                this.deleteProduct(productId);
            });
        });
    }

    editProduct(productId) {
        console.log(`Edit product: ${productId}`);
        // Implement edit product functionality
    }

    deleteProduct(productId) {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            console.log(`Delete product: ${productId}`);
            // Implement delete product functionality
        }
    }

    saveProfileChanges() {
        // Implement save profile changes
        console.log('Saving profile changes...');
        this.showToast('Profil berhasil disimpan!', 'success');
    }

    cancelProfileChanges() {
        // Implement cancel profile changes
        console.log('Cancelling profile changes...');
    }

    renderOrdersList() {
        // Sample orders data
        const orders = [
            { id: '#001', customer: 'Ananda Fairus', status: 'completed', date: '2024-01-15' },
            { id: '#002', customer: 'Rafif Dzaki', status: 'processing', date: '2024-01-14' },
            { id: '#003', customer: 'Fahri Wijaya', status: 'pending', date: '2024-01-13' }
        ];

        const ordersList = document.getElementById('order-status-list');
        if (ordersList) {
            ordersList.innerHTML = orders.map(order => `
                <div class="order-card" data-status="${order.status}">
                    <div class="order-header">
                        <span class="order-number">${order.id}</span>
                        <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Customer:</strong> ${order.customer}</p>
                        <p><strong>Date:</strong> ${order.date}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Processing',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    loadInitialPage() {
        // Load dashboard page by default
        this.navigateToPage('dashboard');
        
        // Set dashboard nav item as active
        const dashboardNavItem = document.querySelector('.nav-item:first-child');
        if (dashboardNavItem) {
            dashboardNavItem.classList.add('active');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toastNotification');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast toast-${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});

