# LihatKebunku Proxy Server

Instruksi singkat:

1. Copy `server/.env.example` ke `server/.env` dan isi `PATEWAY_API_KEY` dengan API key Anda (JANGAN commit file .env).
2. Install dependensi:

   cd server
   npm install

3. Jalankan server untuk development:

   npm run dev

4. Pastikan client (index.html) memanggil endpoint `/api/chat` dari origin yang sama, atau atur CORS di server.

Catatan keamanan:
- Jangan masukkan API key ke file yang diakses publik.
- Jika API key sudah terekspos, segera rotate/regenerate kunci di dashboard provider.
