// Global variables
let cart = [];
let currentPage = 'catalog';

// DOM elements
const catalogPage = document.getElementById('catalog-page');
const orderPage = document.getElementById('order-page');
const checkoutBtn = document.getElementById('checkout-btn');
const backToCatalogBtn = document.getElementById('back-to-catalog');
const addMoreItemsBtn = document.getElementById('add-more-items');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeCatalogPage();
    initializeOrderPage();
    updateCartDisplay();
    generateOrderId();
    setOrderDate();
});

// ===== CATALOG PAGE FUNCTIONS =====

function initializeCatalogPage() {
    const backArrow = document.querySelector('.back-arrow');
    const categoryButtons = document.querySelectorAll('.category-button');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const searchInput = document.getElementById('search-input');

    // Back arrow functionality
    backArrow.addEventListener('click', function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            alert('Tidak ada halaman sebelumnya.');
        }
    });

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.category);
        });
    });

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.dataset.product;
            const productPrice = parseInt(this.dataset.price);
            addToCart(productName, productPrice);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }
        showOrderPage();
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'semua' || card.dataset.category === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-desc').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartFeedback(productName);
}

function updateCartDisplay() {
    const itemCountElement = document.querySelector('.item-count');
    const totalAmountElement = document.querySelector('.total-amount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    itemCountElement.textContent = totalItems;
    totalAmountElement.textContent = formatCurrency(totalAmount);
    
    // Enable/disable checkout button
    checkoutBtn.disabled = cart.length === 0;
}

function showAddToCartFeedback(productName) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = `${productName} ditambahkan ke keranjang`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// ===== ORDER PAGE FUNCTIONS =====

function initializeOrderPage() {
    // Back to catalog button
    backToCatalogBtn.addEventListener('click', function() {
        showCatalogPage();
    });

    // Add more items button
    addMoreItemsBtn.addEventListener('click', function() {
        showCatalogPage();
    });

    // Send order button
    const sendOrderBtn = document.getElementById('send-order');
    sendOrderBtn.addEventListener('click', function() {
        processOrder();
    });
}

function showOrderPage() {
    catalogPage.classList.remove('active');
    orderPage.classList.add('active');
    currentPage = 'order';
    updateOrderDisplay();
}

function showCatalogPage() {
    orderPage.classList.remove('active');
    catalogPage.classList.add('active');
    currentPage = 'catalog';
}

function updateOrderDisplay() {
    updateOrderItems();
    updateOrderSummary();
}

function updateOrderItems() {
    const orderItemsList = document.getElementById('order-items-list');
    const totalItemsElement = document.getElementById('total-items');
    
    orderItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-detail';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Produk kesehatan ternak berkualitas</p>
            <div class="item-price-quantity">
                <span class="price">${formatCurrency(item.price)}</span>
                <div class="quantity-control">
                    <button class="minus-btn" onclick="updateItemQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="plus-btn" onclick="updateItemQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="delete-btn" onclick="removeItem(${index})">Hapus</button>
        `;
        orderItemsList.appendChild(itemElement);
    });
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalItemsElement.textContent = totalItems;
}

function updateOrderSummary() {
    const subtotalItemsElement = document.getElementById('subtotal-items');
    const subtotalAmountElement = document.getElementById('subtotal-amount');
    const totalPaymentElement = document.getElementById('total-payment');
    const footerTotalElement = document.getElementById('footer-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    subtotalItemsElement.textContent = totalItems;
    subtotalAmountElement.textContent = formatCurrency(totalAmount);
    totalPaymentElement.textContent = formatCurrency(totalAmount);
    footerTotalElement.textContent = formatCurrency(totalAmount);
}

function updateItemQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        updateCartDisplay();
        updateOrderDisplay();
    }
}

function removeItem(index) {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateOrderDisplay();
        
        if (cart.length === 0) {
            showCatalogPage();
        }
    }
}

function generateOrderId() {
    const orderIdElement = document.getElementById('order-id');
    const orderId = 'SDT' + Date.now().toString().slice(-8);
    orderIdElement.textContent = orderId;
}

function setOrderDate() {
    const orderDateElement = document.getElementById('order-date');
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Makassar',
        timeZoneName: 'short'
    };
    
    const formattedDate = now.toLocaleDateString('id-ID', options);
    orderDateElement.textContent = formattedDate.replace('GMT+8', 'WITA');
}

function processOrder() {
    const namaLengkap = document.getElementById('nama-lengkap').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const alamat = document.getElementById('shipping-address').value;
    const sales = document.getElementById('sales-select').value;
    const catatan = document.getElementById('order-notes').value;
    
    // Validation
    if (!namaLengkap.trim()) {
        alert('Nama lengkap harus diisi.');
        return;
    }
    
    if (!whatsapp.trim()) {
        alert('Nomor WhatsApp harus diisi.');
        return;
    }
    
    if (!alamat.trim()) {
        alert('Alamat pengiriman harus diisi.');
        return;
    }
    
    if (!sales) {
        alert('Silakan pilih sales.');
        return;
    }
    
    // Create order summary
    const orderId = document.getElementById('order-id').textContent;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let orderSummary = `*PESANAN SADITA.ID*\\n\\n`;
    orderSummary += `ID Pesanan: ${orderId}\\n`;
    orderSummary += `Tanggal: ${document.getElementById('order-date').textContent}\\n\\n`;
    orderSummary += `*DETAIL PESANAN:*\\n`;
    
    cart.forEach(item => {
        orderSummary += `• ${item.name}\\n`;
        orderSummary += `  ${item.quantity}x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\\n\\n`;
    });
    
    orderSummary += `*TOTAL: ${formatCurrency(totalAmount)}*\\n\\n`;
    orderSummary += `*DATA PEMESAN:*\\n`;
    orderSummary += `Nama: ${namaLengkap}\\n`;
    orderSummary += `WhatsApp: ${whatsapp}\\n`;
    orderSummary += `Alamat: ${alamat}\\n`;
    orderSummary += `Sales: ${sales}\\n`;
    
    if (catatan.trim()) {
        orderSummary += `Catatan: ${catatan}\\n`;
    }
    
    // Send via WhatsApp
    const whatsappNumber = '6281234567890'; // Replace with actual business WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderSummary)}`;
    
    if (confirm('Pesanan akan dikirim melalui WhatsApp. Lanjutkan?')) {
        window.open(whatsappUrl, '_blank');
        
        // Reset form and cart
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
            resetOrderForm();
            showCatalogPage();
            alert('Pesanan berhasil dikirim! Terima kasih telah berbelanja di Sadita.id');
        }, 1000);
    }
}

function resetOrderForm() {
    document.getElementById('nama-lengkap').value = '';
    document.getElementById('whatsapp').value = '';
    document.getElementById('shipping-address').value = '';
    document.getElementById('sales-select').value = '';
    document.getElementById('order-notes').value = '';
    generateOrderId();
    setOrderDate();
}

// ===== UTILITY FUNCTIONS =====

function formatCurrency(amount) {
    return 'Rp' + amount.toLocaleString('id-ID');
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    if (currentPage === 'order') {
        showCatalogPage();
    }
});

// Add to browser history when navigating to order page
function addToHistory(page) {
    if (page === 'order') {
        history.pushState({page: 'order'}, 'Pesanan', '#pesanan');
    } else {
        history.pushState({page: 'catalog'}, 'Katalog', '#katalog');
    }
}

