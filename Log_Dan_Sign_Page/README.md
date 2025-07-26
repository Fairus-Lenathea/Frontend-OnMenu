# FoodMarket Authentication Pages

Halaman login dan sign up untuk aplikasi FoodMarket yang dibuat berdasarkan mockup design yang diberikan.

## Fitur

### 🔐 Halaman Sign In
- Form login dengan email dan password
- Validasi input real-time
- Tombol navigasi ke halaman sign up
- Responsive design untuk mobile dan desktop

### 📝 Halaman Sign Up (Multi-step)
**Step 1: Informasi Dasar**
- Upload foto profil (opsional)
- Input nama lengkap
- Input email address
- Input password
- Validasi form dengan feedback visual

**Step 2: Informasi Alamat**
- Input nomor telepon
- Input alamat lengkap
- Input nomor rumah
- Dropdown pilihan kota
- Validasi lengkap sebelum submit

## Teknologi yang Digunakan

- **HTML5** - Struktur halaman semantik
- **CSS3** - Styling modern dengan animasi dan transisi
- **JavaScript (Vanilla)** - Interaktivitas dan validasi form
- **Responsive Design** - Kompatibel dengan mobile dan desktop

## Struktur File

```
foodmarket-auth/
├── index.html          # Halaman Sign In
├── signup.html         # Halaman Sign Up (Step 1)
├── address.html        # Halaman Address (Step 2)
├── styles.css          # File CSS utama
├── script.js           # File JavaScript utama
├── README.md           # Dokumentasi ini
└── todo.md            # Progress tracking
```

## Cara Menggunakan

1. **Buka halaman utama**
   ```
   Buka file index.html di browser
   ```

2. **Testing Sign In**
   - Masukkan email valid (contoh: user@example.com)
   - Masukkan password minimal 6 karakter
   - Klik tombol "Sign In"

3. **Testing Sign Up**
   - Dari halaman Sign In, klik "Create New Account"
   - Isi form Step 1 dengan informasi dasar
   - Klik "Continue" untuk ke Step 2
   - Isi informasi alamat lengkap
   - Pilih kota dari dropdown
   - Klik "Sign Up Now"

## Fitur JavaScript

### Validasi Form
- **Email**: Format email yang valid
- **Password**: Minimal 6 karakter
- **Phone**: Format nomor telepon yang valid
- **Required Fields**: Semua field wajib diisi

### Interaktivitas
- **Photo Upload**: Klik area foto untuk upload gambar
- **Navigation**: Tombol back dan navigasi antar halaman
- **Loading States**: Animasi loading saat submit form
- **Notifications**: Toast notifications untuk feedback user
- **Keyboard Support**: Enter key untuk submit form

### Local Storage
- Menyimpan data signup sementara
- Tracking progress multi-step registration
- Session management sederhana

## Design Features

### Color Scheme
- **Primary**: #FFC700 (Yellow)
- **Secondary**: #8D92A3 (Gray)
- **Text**: #020202 (Black)
- **Background**: #f8f9fa (Light Gray)

### Typography
- Font modern sans-serif
- Hierarchy yang jelas
- Readable font sizes

### UI/UX
- **Smooth Animations**: Slide-in effects dan transitions
- **Hover Effects**: Interactive button states
- **Focus Management**: Accessibility-friendly navigation
- **Mobile-First**: Responsive design approach
- **Visual Feedback**: Form validation dengan color coding

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Customization

### Mengubah Warna
Edit variabel warna di `styles.css`:
```css
.btn-primary {
    background-color: #FFC700; /* Ubah warna primary */
}
```

### Menambah Kota
Edit array kota di `address.html`:
```html
<option value="kota-baru">Kota Baru</option>
```

### Mengubah Validasi
Edit fungsi validasi di `script.js`:
```javascript
function validatePassword(password) {
    return password.length >= 8; // Ubah minimal karakter
}
```

## Demo Flow

1. **Sign In Page** → Klik "Create New Account"
2. **Sign Up Step 1** → Isi form → Klik "Continue"
3. **Address Step 2** → Isi alamat → Klik "Sign Up Now"
4. **Success** → Redirect ke Sign In dengan notifikasi

## Notes

- Ini adalah demo frontend, tidak terhubung dengan backend
- Data disimpan sementara di localStorage
- Untuk production, integrasikan dengan API backend
- Tambahkan HTTPS untuk keamanan
- Implementasikan proper authentication system

## Screenshots

Halaman-halaman telah ditest dan sesuai dengan mockup design yang diberikan:
- ✅ Sign In page layout dan styling
- ✅ Sign Up page dengan photo upload
- ✅ Address page dengan dropdown kota
- ✅ Responsive design untuk mobile
- ✅ Form validation dan error handling
- ✅ Smooth navigation antar halaman

---

**Dibuat dengan ❤️ berdasarkan mockup FoodMarket design**

