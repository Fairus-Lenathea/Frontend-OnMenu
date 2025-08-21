// Data produk baru
const products = [
  {
    name: 'Pir Xianglie',
    description: 'Harga per kg',
    price: 45000,
    stock: 50,
    category: 'buah',
    imageUrl: 'img/Pir Xianglie.jpg'
  },
  {
    name: 'Shine Muscat',
    description: 'Harga per Pack',
    price: 50000,
    stock: 30,
    category: 'buah',
    imageUrl: 'img/Shine Muscat.jpg'
  },
  {
    name: 'Pisang Cavendish',
    description: 'Harga per Kg',
    price: 20000,
    stock: 100,
    category: 'buah',
    imageUrl: 'img/Pisang Cavendish.jpg'
  },
  {
    name: 'Beet',
    description: 'Harga per kg',
    price: 45000,
    stock: 25,
    category: 'sayur',
    imageUrl: 'img/Beet.jpg'
  },
  {
    name: 'Anggur Red Globe',
    description: 'Harga per kg',
    price: 70000,
    stock: 40,
    category: 'buah',
    imageUrl: 'img/Anggur Red Globe.jpg'
  }
];

// Global variables
let cart = [];
let currentPage = 'catalog';

// DOM elements
const catalogPage = document.getElementById('catalog-page');
const orderPage = document.getElementById('order-page');
const checkoutBtn = document.getElementById('checkout-btn');
const backToCatalogBtn = document.getElementById('back-to-catalog');
const addMoreItemsBtn = document.getElementById('add-more-items');
const productGrid = document.getElementById('product-grid');

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
  renderProducts();
  initializeCatalogPage();
  initializeOrderPage();
  updateCartDisplay();
  generateOrderId();
  setOrderDate();
});

// ===== PRODUCT RENDERING =====
function renderProducts() {
  productGrid.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;

    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      <p class="price" data-price="${product.price}">${formatCurrency(product.price)}</p>
      <p class="stock">Stok: ${product.stock}</p>
      <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}">Tambahkan</button>
    `;

    productGrid.appendChild(card);
  });
}

// ===== CATALOG PAGE FUNCTIONS =====
function initializeCatalogPage() {
  const backArrow = document.querySelector('.back-arrow');
  const categoryButtons = document.querySelectorAll('.category-button');
  const searchInput = document.getElementById('search-input');

  backArrow.addEventListener('click', function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      alert('Tidak ada halaman sebelumnya.');
    }
  });

  categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterProducts(this.dataset.category);
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productName = e.target.dataset.product;
      const productPrice = parseInt(e.target.dataset.price);
      addToCart(productName, productPrice);
    }
  });

  searchInput.addEventListener('input', function () {
    searchProducts(this.value);
  });

  checkoutBtn.addEventListener('click', function () {
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
    cart.push({ name: productName, price: productPrice, quantity: 1 });
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
  checkoutBtn.disabled = cart.length === 0;
}

function showAddToCartFeedback(productName) {
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
  backToCatalogBtn.addEventListener('click', () => showCatalogPage());
  addMoreItemsBtn.addEventListener('click', () => showCatalogPage());
  document.getElementById('send-order').addEventListener('click', processOrder);
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
  const list = document.getElementById('order-items-list');
  const totalItems = document.getElementById('total-items');
  list.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'item-detail';
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Produk segar berkualitas</p>
      <div class="item-price-quantity">
        <span class="price">${formatCurrency(item.price)}</span>
        <div class="quantity-control">
          <button onclick="updateItemQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateItemQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button class="delete-btn" onclick="removeItem(${index})">Hapus</button>
    `;
    list.appendChild(div);
  });

  totalItems.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateOrderSummary() {
  const subtotalItems = document.getElementById('subtotal-items');
  const subtotalAmount = document.getElementById('subtotal-amount');
  const totalPayment = document.getElementById('total-payment');
  const footerTotal = document.getElementById('footer-total');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  subtotalItems.textContent = totalItems;
  subtotalAmount.textContent = formatCurrency(totalAmount);
  totalPayment.textContent = formatCurrency(totalAmount);
  footerTotal.textContent = formatCurrency(totalAmount);
}

function updateItemQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartDisplay();
    updateOrderDisplay();
  }
}

function removeItem(index) {
  if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateOrderDisplay();
    if (cart.length === 0) showCatalogPage();
  }
}

function generateOrderId() {
  document.getElementById('order-id').textContent = 'TBU' + Date.now().toString().slice(-8);
}

function setOrderDate() {
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
  document.getElementById('order-date').textContent = now.toLocaleDateString('id-ID', options).replace('GMT+8', 'WITA');
}

// ===== FIX OVERLAY BUG – PASTIKAN TIDAK MUNCUL OTOMATIS =====
function processOrder() {
  const nama = document.getElementById('nama-lengkap').value.trim();
  const wa = document.getElementById('whatsapp').value.trim();
  const alamat = document.getElementById('shipping-address').value.trim();
  const catatan = document.getElementById('order-notes').value.trim();

  if (!nama) return alert('Nama lengkap harus diisi.');
  if (!wa) return alert('Nomor WhatsApp harus diisi.');
  if (!alamat) return alert('Alamat pengiriman harus diisi.');

  // Sembunyikan overlay jika ada
  const overlay = document.getElementById('order-page-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  }

  const orderId = document.getElementById('order-id').textContent;
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let summary = `*PESANAN TOKO BUAH UWAIS*\n\n`;
  summary += `ID Pesanan: ${orderId}\n`;
  summary += `Tanggal: ${document.getElementById('order-date').textContent}\n\n`;
  summary += `*DETAIL PESANAN:*\n`;

  cart.forEach(item => {
    summary += `• ${item.name}\n  ${item.quantity}x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n\n`;
  });

  summary += `*TOTAL: ${formatCurrency(totalAmount)}*\n\n`;
  summary += `*DATA PEMESAN:*\n`;
  summary += `Nama: ${nama}\n`;
  summary += `WhatsApp: ${wa}\n`;
  summary += `Alamat: ${alamat}\n`;
  if (catatan) summary += `Catatan: ${catatan}\n`;

  const waNumber = '6285176773633';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`;

  if (confirm('Pesanan akan dikirim melalui WhatsApp. Lanjutkan?')) {
    window.open(waUrl, '_blank');
    setTimeout(() => {
      cart = [];
      updateCartDisplay();
      resetOrderForm();
      showCatalogPage();
      alert('Pesanan berhasil dikirim! Terima kasih telah berbelanja di Toko Buah Uwais');
    }, 1000);
  }
}

function resetOrderForm() {
  document.getElementById('nama-lengkap').value = '';
  document.getElementById('whatsapp').value = '';
  document.getElementById('shipping-address').value = '';
  document.getElementById('order-notes').value = '';
  generateOrderId();
  setOrderDate();
}

function formatCurrency(amount) {
  return 'Rp' + amount.toLocaleString('id-ID');
}

// Tambahan: Pastikan overlay tidak aktif saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('order-page-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  }
});