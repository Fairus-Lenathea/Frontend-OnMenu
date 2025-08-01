# Aplikasi Sadita Terintegrasi

Aplikasi web e-commerce untuk toko obat ternak Sadita.id yang menggabungkan halaman katalog produk dan halaman pesanan dalam satu aplikasi yang terintegrasi.

## Fitur Utama

### Halaman Katalog Produk
- **Header dengan Logo**: Menampilkan logo Sadita dan tombol kembali
- **Welcome Card**: Pesan selamat datang dengan informasi cabang
- **Search Bar**: Pencarian produk berdasarkan nama atau deskripsi
- **Filter Kategori**: Filter produk berdasarkan kategori (Semua, Antibiotik, Vitamin & Mineral, Anti Coccidia, Antiparasi)
- **Grid Produk**: Menampilkan produk dengan gambar, nama, deskripsi, harga, dan stok
- **Keranjang Belanja**: Menampilkan jumlah item dan total harga
- **Tombol Tambah ke Keranjang**: Untuk setiap produk
- **Tombol Checkout**: Navigasi ke halaman pesanan

### Halaman Pesanan
- **Informasi Pesanan**: ID pesanan otomatis dan tanggal pesanan
- **Daftar Item**: Menampilkan produk yang dipesan dengan kontrol kuantitas
- **Pemilihan Sales**: Dropdown untuk memilih sales
- **Catatan Pesanan**: Area untuk menambahkan catatan tambahan
- **Data Pemesan**: Form untuk nama lengkap dan nomor WhatsApp
- **Alamat Pengiriman**: Area untuk alamat lengkap
- **Rincian Pembayaran**: Subtotal dan total pembayaran
- **Tombol Kirim**: Mengirim pesanan melalui WhatsApp

## Teknologi yang Digunakan

- **HTML5**: Struktur halaman
- **CSS3**: Styling dan responsive design
- **JavaScript**: Interaktivitas dan manajemen state
- **Font Awesome**: Ikon
- **Responsive Design**: Kompatibel dengan desktop dan mobile

## Struktur File

```
sadita_integrated_app/
├── index.html          # File HTML utama
├── style.css           # File CSS untuk styling
├── script.js           # File JavaScript untuk interaktivitas
└── README.md           # Dokumentasi ini
```

## Cara Penggunaan

1. Buka file `index.html` di browser
2. Jelajahi produk di halaman katalog
3. Gunakan fitur pencarian atau filter kategori untuk menemukan produk
4. Klik "Tambahkan" untuk menambahkan produk ke keranjang
5. Klik "Bayar" untuk melanjutkan ke halaman pesanan
6. Isi data pemesan dan alamat pengiriman
7. Pilih sales dan tambahkan catatan jika diperlukan
8. Klik "Kirim" untuk mengirim pesanan melalui WhatsApp

## Fitur JavaScript

### Manajemen Keranjang
- Menambah produk ke keranjang
- Mengupdate jumlah item dan total harga
- Menghapus item dari keranjang
- Mengubah kuantitas item

### Navigasi Halaman
- Beralih antara halaman katalog dan pesanan
- Tombol kembali yang berfungsi
- Manajemen history browser

### Filter dan Pencarian
- Filter produk berdasarkan kategori
- Pencarian real-time berdasarkan nama produk
- Menyembunyikan/menampilkan produk sesuai filter

### Integrasi WhatsApp
- Generate pesan pesanan otomatis
- Format pesan yang rapi dan terstruktur
- Membuka WhatsApp dengan pesan yang sudah diformat

## Responsivitas

Aplikasi ini dirancang untuk bekerja dengan baik di:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Kustomisasi

### Mengubah Nomor WhatsApp Bisnis
Edit variabel `whatsappNumber` di file `script.js`:
```javascript
const whatsappNumber = '6281234567890'; // Ganti dengan nomor WhatsApp bisnis
```

### Menambah Produk Baru
Tambahkan elemen `.product-card` baru di dalam `.product-grid` dengan struktur yang sama.

### Mengubah Warna Tema
Edit variabel CSS di file `style.css` untuk mengubah skema warna.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Catatan Pengembangan

Aplikasi ini menggabungkan dua landing page terpisah:
1. **design_implementation**: Halaman pesanan/checkout
2. **sadita_app**: Halaman katalog produk

Kedua halaman telah diintegrasikan menjadi satu aplikasi single-page dengan navigasi yang mulus dan state management yang konsisten.

