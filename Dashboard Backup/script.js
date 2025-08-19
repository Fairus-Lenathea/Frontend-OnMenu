class Dashboard {
    constructor() {
        this.isMobile = window.innerWidth < 1024;
        this.salesChart = null;
        this.appData = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
        this.handleResize();
        const initialPage = window.location.hash.substring(1) || 'dashboard';
        this.navigateToPage(initialPage);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Gagal memuat data');
            this.appData = await response.json();
        } catch (error) {
            console.error('Kesalahan: Tidak dapat memuat data.json', error);
            this.showToast('Gagal memuat data aplikasi.', 'error');
        }
    }

    bindEvents() {
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('overlay')?.addEventListener('click', () => this.toggleSidebar());

        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                if (this.isMobile) this.toggleSidebar();
            }
        });

        document.getElementById('headerProfileIcon')?.addEventListener('click', () => {
            this.navigateToPage('profile');
            if (this.isMobile) this.toggleSidebar();
        });

        document.getElementById('saveContactInfo')?.addEventListener('click', () => {
            const data = {
                shopAddress: document.getElementById('shopAddress').value.trim(),
                shopContact: document.getElementById('shopContact').value.trim(),
                hours: Array.from(document.querySelectorAll('.day-schedule')).map(day => ({
                    day: day.dataset.day,
                    enabled: day.querySelector('.day-checkbox').checked,
                    open: day.querySelector('.time-input:first-of-type').value,
                    close: day.querySelector('.time-input:last-of-type').value
                }))
            };
            localStorage.setItem('shopContact', JSON.stringify(data));
            this.showToast('Alamat & kontak berhasil disimpan!', 'success');
        });

        this.bindOrderPageEvents();
        this.bindReportPageEvents();
        this.bindProfilePageEvents();
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !overlay) return;

        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';

        // Toggle class pada body untuk menandakan status sidebar (hanya di desktop)
        if (!this.isMobile) {
            document.body.classList.toggle('sidebar-collapsed', !sidebar.classList.contains('active'));
        }
    }

    navigateToPage(pageName) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${pageName}-page`)?.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`.nav-link[data-page="${pageName}"]`)?.closest('.nav-item')?.classList.add('active');

        window.location.hash = pageName;
        this.loadPageData(pageName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadPageData(pageName) {
        if (!this.appData) return;
        switch (pageName) {
            case 'dashboard': this.displayRecentOrders(); break;
            case 'orders': this.displayOrders(this.appData.orders); break;
            case 'reports': this.updateSalesReport('daily'); break;
            case 'profile': this.loadProfileData(); break;
        }
    }

    displayRecentOrders() {
        const container = document.getElementById('recent-order-list');
        if (!container) return;
        const recentOrders = this.appData.orders.slice(0, 5);
        container.innerHTML = recentOrders.map(order => `
            <div class="order-item">
                <span class="order-id">${order.id}</span>
                <span class="order-customer">${order.customerName}</span>
                <span class="order-status ${order.status}">${this.translateStatus(order.status)}</span>
            </div>
        `).join('');
    }

    translateStatus(status) {
        const map = {
            pending: 'Tertunda',
            processing: 'Diproses',
            completed: 'Selesai',
            cancelled: 'Dibatalkan'
        };
        return map[status] || status;
    }

    bindOrderPageEvents() {
        document.querySelectorAll('#orders-page .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelector('#orders-page .tab.active')?.classList.remove('active');
                tab.classList.add('active');
                this.filterOrdersByStatus(tab.dataset.status);
            });
        });
        document.getElementById('order-search-input')?.addEventListener('input', e => this.handleOrderSearch(e.target.value));
    }

    displayOrders(orders) {
        const container = document.getElementById('order-status-list');
        if (!container) return;
        container.innerHTML = orders.length === 0
            ? `<div class="empty-state"><p>Tidak ada pesanan ditemukan.</p></div>`
            : orders.map(order => `
                <div class="order-card" data-status="${order.status}">
                    <div class="order-header">
                        <span class="order-id">${order.id}</span>
                        <span class="order-status ${order.status}">${this.translateStatus(order.status)}</span>
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
            o.id.toLowerCase().includes(lowerQuery) || o.customerName.toLowerCase().includes(lowerQuery)
        );
        this.displayOrders(filtered);
    }

    bindReportPageEvents() {
        document.getElementById('salesReportPeriod')?.addEventListener('change', e => this.updateSalesReport(e.target.value));
    }

    updateSalesReport(period) {
        if (!this.appData?.salesReport) return;
        const dataMap = {
            daily: this.appData.salesReport.daily.slice(-7),
            weekly: this.appData.salesReport.weekly.slice(-4),
            monthly: this.appData.salesReport.monthly.slice(-6),
            yearly: this.appData.salesReport.yearly || []
        };
        const reportData = dataMap[period];
        if (!reportData || reportData.length === 0) return;

        const labels = reportData.map(item => item.date || item.week || item.month || item.year);
        const revenues = reportData.map(item => item.revenue);
        const totalRevenue = revenues.reduce((sum, current) => sum + current, 0);
        const avgRevenue = totalRevenue / revenues.length;

        document.getElementById('summary-total-revenue').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('summary-avg-revenue').textContent = this.formatCurrency(avgRevenue);
        document.getElementById('summary-total-orders').textContent = reportData.reduce((sum, item) => sum + (item.orders || 1), 0);

        const bestPeriod = [...reportData].sort((a, b) => b.revenue - a.revenue)[0];
        document.getElementById('analysis-best-day').textContent = bestPeriod.date || bestPeriod.week || bestPeriod.month || bestPeriod.year;
        document.getElementById('analysis-best-value').textContent = this.formatCurrency(bestPeriod.revenue);

        const comparisonValue = revenues.length > 1
            ? ((revenues[revenues.length - 1] - revenues[0]) / revenues[0]) * 100
            : 0;
        const comparisonElement = document.getElementById('analysis-comparison-value');
        comparisonElement.textContent = `${comparisonValue >= 0 ? '+' : ''}${comparisonValue.toFixed(1)}%`;
        comparisonElement.style.color = comparisonValue >= 0 ? '#22c55e' : '#ef4444';

        this.renderSalesChart(labels, revenues);
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
                labels,
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
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) =>
                                new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)
                        },
                        grid: { drawBorder: false }
                    },
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
                        callbacks: {
                            label: (context) => this.formatCurrency(context.parsed.y)
                        }
                    }
                }
            }
        });
    }

    bindProfilePageEvents() {
        const avatarUpload = document.getElementById('profileAvatarUpload');
        const avatarPreview = document.getElementById('profileAvatarPreview');

        avatarUpload?.addEventListener('change', () => {
            const file = avatarUpload.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => { avatarPreview.src = e.target.result; };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        document.querySelector('.profile-reset-btn')?.addEventListener('click', () => this.resetProfile());
    }

    loadProfileData() {
        const savedProfile = localStorage.getItem('userProfile');
        const profileData = savedProfile ? JSON.parse(savedProfile) : this.appData.profile;
        if (profileData) this.fillProfileForm(profileData);
    }

    fillProfileForm(data) {
        document.getElementById('profileName').value = data.name || '';
        document.getElementById('profileEmail').value = data.email || '';
        document.getElementById('profilePhone').value = data.phone || '';
        document.getElementById('profileAddress').value = data.address || '';
        document.getElementById('profileAbout').value = data.about || '';
        document.getElementById('profileAvatarPreview').src = data.avatar || 'https://via.placeholder.com/150x150/4F46E5/ffffff?text=U';
        document.querySelector('.profile-avatar img').src = data.avatar || 'https://via.placeholder.com/32x32/4F46E5/ffffff?text=U';
    }

    saveProfile() {
        const profileData = {
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value,
            about: document.getElementById('profileAbout').value,
            avatar: document.getElementById('profileAvatarPreview').src
        };

        if (!profileData.name || !profileData.email) {
            this.showToast('Nama dan Email wajib diisi.', 'error');
            return;
        }

        localStorage.setItem('userProfile', JSON.stringify(profileData));
        this.fillProfileForm(profileData);
        this.showToast('Profil berhasil disimpan!', 'success');
    }

    resetProfile() {
        localStorage.removeItem('userProfile');
        this.loadProfileData();
        this.showToast('Profil telah direset ke data awal.', 'info');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toastNotification');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast-notification show ${type}`;
        setTimeout(() => { toast.className = 'toast-notification'; }, 3000);
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 1024;
        if (wasMobile !== this.isMobile && !this.isMobile) {
            this.toggleSidebar();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});