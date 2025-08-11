class Dashboard {
    constructor() {
        this.isMobile = window.innerWidth < 1024;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.salesChart = null;
        this.appData = null; // Single source for all data
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.handleResize();
        this.initTouchGestures();
        this.initKeyboardShortcuts();
        this.initAccessibility();
        
        const initialPage = window.location.hash.substring(1) || 'dashboard';
        this.navigateToPage(initialPage);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Network response was not ok');
            this.appData = await response.json();
        } catch (error) {
            console.error('Fatal Error: Could not load data.json', error);
            // You might want to show a user-friendly error message on the screen
        }
    }

    bindEvents() {
        const menuToggle = document.getElementById('menuToggle');
        const closeSidebarBtn = document.getElementById('closeSidebar');
        const overlay = document.getElementById('overlay');

        if (menuToggle) menuToggle.addEventListener('click', () => this.toggleSidebar());
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        if (overlay) overlay.addEventListener('click', () => this.closeSidebar());

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                if (this.isMobile) this.closeSidebar();
            });
        });

        // Event listeners for specific pages
        this.bindOrderPageEvents();
        this.bindMenuPageEvents();
        this.bindReportPageEvents();
        this.bindSettingsPageEvents();
        this.bindProfilePageEvents();

        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateToPage(pageName) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) targetPage.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`.nav-link[data-page="${pageName}"]`)?.closest('.nav-item');
        if (activeNavItem) activeNavItem.classList.add('active');

        window.location.hash = pageName;
        this.loadPageData(pageName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadPageData(pageName) {
        if (!this.appData) return; // Don't run if data isn't loaded

        switch (pageName) {
            case 'dashboard':
                this.displayRecentOrders();
                break;
            case 'orders':
                this.displayOrders(this.appData.orders);
                break;
            case 'menu':
                this.displayMenu();
                break;
            case 'reports':
                this.updateSalesReport('daily');
                break;
        }
    }

    // --- Dashboard Page ---
    displayRecentOrders() {
        const container = document.getElementById('recent-order-list');
        if (!container) return;
        const recentOrders = this.appData.orders.slice(0, 3);
        container.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <span class="order-id">${order.id}</span>
                <span class="order-customer">${order.customerName}</span>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
        `).join('');
    }

    // --- Orders Page ---
    bindOrderPageEvents() {
        document.querySelectorAll('#orders-page .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelector('#orders-page .tab.active').classList.remove('active');
                tab.classList.add('active');
                this.filterOrdersByStatus(tab.dataset.status);
            });
        });
        document.getElementById('order-search-input')?.addEventListener('input', e => this.handleOrderSearch(e.target.value));
    }

    displayOrders(orders) {
        const container = document.getElementById('order-status-list');
        if (!container) return;
        if (orders.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>Tidak ada pesanan ditemukan.</p></div>`;
            return;
        }
        container.innerHTML = orders.map(order => `
            <div class="order-card" data-status="${order.status}">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="order-customer">${order.customerName}</div>
                    <div class="order-meta">
                        <span>${this.formatDate(order.orderDate)}</span>
                        <span class="order-amount">${this.formatCurrency(order.totalPrice)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterOrdersByStatus(status) {
        const filtered = status === 'all' ? this.appData.orders : this.appData.orders.filter(o => o.status === status);
        this.displayOrders(filtered);
    }

    handleOrderSearch(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = this.appData.orders.filter(o => 
            o.id.toLowerCase().includes(lowerQuery) || 
            o.customerName.toLowerCase().includes(lowerQuery)
        );
        this.displayOrders(filtered);
    }

    // --- Menu Page ---
    bindMenuPageEvents() {
        // This is where you would add event listeners for add/edit/delete buttons
    }

    displayMenu() {
        // A simplified example of how you might render the menu
        const categories = this.appData.inventoryReport.categories; // Assuming you add this to data.json
        const products = this.appData.inventoryReport.products; // Assuming you add this
        // Logic to render categories and products would go here
    }

    // --- Reports Page ---
    bindReportPageEvents() {
        document.getElementById('salesReportPeriod')?.addEventListener('change', e => this.updateSalesReport(e.target.value));
    }

    updateSalesReport(period) {
        if (!this.appData?.salesReport) return;

        const dataMap = {
            daily: this.appData.salesReport.daily.slice(-7),
            weekly: this.appData.salesReport.weekly.slice(-4),
            monthly: this.appData.salesReport.monthly.slice(-6),
            yearly: this.appData.salesReport.yearly
        };

        const reportData = dataMap[period];
        if (!reportData || reportData.length === 0) {
            this.resetSalesSummary();
            return;
        }

        const labels = reportData.map(item => item.date || item.week || item.month || item.year);
        const revenues = reportData.map(item => item.revenue);

        const totalRevenue = revenues.reduce((sum, current) => sum + current, 0);
        const avgRevenue = totalRevenue / revenues.length;
        const totalOrders = revenues.length;

        document.getElementById('summary-total-revenue').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('summary-avg-revenue').textContent = this.formatCurrency(avgRevenue);
        document.getElementById('summary-total-orders').textContent = totalOrders;

        const bestPeriod = [...reportData].sort((a, b) => b.revenue - a.revenue)[0];
        document.getElementById('analysis-best-day').textContent = bestPeriod.date || bestPeriod.week || bestPeriod.month || bestPeriod.year;
        document.getElementById('analysis-best-value').textContent = this.formatCurrency(bestPeriod.revenue);

        const comparisonValue = ((totalRevenue - (avgRevenue * revenues.length)) / (avgRevenue * revenues.length)) * 100;
        const comparisonElement = document.getElementById('analysis-comparison-value');
        if (totalRevenue > avgRevenue * revenues.length * 0.95) {
            comparisonElement.textContent = `+${comparisonValue.toFixed(1)}%`;
            comparisonElement.style.color = '#22c55e';
        } else {
            comparisonElement.textContent = `${comparisonValue.toFixed(1)}%`;
            comparisonElement.style.color = '#ef4444';
        }

        this.renderSalesChart(labels, revenues);
    }

    resetSalesSummary() {
        document.getElementById('summary-total-revenue').textContent = 'Rp0';
        document.getElementById('summary-avg-revenue').textContent = 'Rp0';
        document.getElementById('summary-total-orders').textContent = '0';
        document.getElementById('analysis-best-day').textContent = '-';
        document.getElementById('analysis-best-value').textContent = '-';
        document.getElementById('analysis-comparison-value').textContent = '-';
        if (this.salesChart) {
            this.salesChart.destroy();
            this.salesChart = null;
        }
    }

    renderSalesChart(labels, revenues) {
        const ctx = document.getElementById('salesChart')?.getContext('2d');
        if (!ctx) return;

        if (this.salesChart) this.salesChart.destroy();

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Pendapatan',
                    data: revenues,
                    backgroundColor: gradient,
                    borderColor: '#4F46E5',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#4F46E5',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { callback: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value) }, grid: { drawBorder: false } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111827',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: { label: (context) => this.formatCurrency(context.parsed.y) }
                    }
                }
            }
        });
    }

    // --- Settings & Profile Pages ---
    bindSettingsPageEvents() { /* Add event listeners for settings */ }
    bindProfilePageEvents() { /* Add event listeners for profile */ }

    // --- Utility Functions ---
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 1024;
        if (wasMobile !== this.isMobile) {
            document.body.classList.toggle('desktop', !this.isMobile);
            if (!this.isMobile) this.closeSidebar();
        }
    }

    initTouchGestures() { /* Logic for touch gestures */ }
    initKeyboardShortcuts() { /* Logic for keyboard shortcuts */ }
    initAccessibility() { /* Logic for accessibility improvements */ }
}

document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
