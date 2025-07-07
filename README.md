# 🎙️ TTS Overlay Server for OBS

WebSocket backend untuk menghubungkan notifikasi dari TikTok (via TikFinity) dan YouTube ke overlay OBS berbasis HTML dengan Text-to-Speech.

## 🔧 Deploy Gratis di Render

1. Fork repo ini
2. Login ke [https://render.com](https://render.com)
3. Pilih **New → Web Service**
4. Hubungkan repo GitHub ini
5. Gunakan setting:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

## 📤 Kirim Pesan Manual (untuk tes)

```
POST https://your-domain.onrender.com/send
Content-Type: application/json

{
  "message": "Halo, ini suara dari OBS!"
}
```

## 🎥 Gunakan di OBS

1. Buat Browser Source
2. Masukkan HTML overlay yang menggunakan WebSocket:
   ```js
   const socket = new WebSocket("wss://your-domain.onrender.com");
   ```

## 📡 Integrasi TikFinity

Di TikFinity → Settings → WebSocket Output:
- URL: `wss://your-domain.onrender.com`
- Format JSON:
  ```json
  {
    "message": "USER mengirim GIFT"
  }
  ```

## 🟢 YouTube Auto Polling

Tambahkan file `.env`:

```
YT_API_KEY=YOUR_YOUTUBE_API_KEY
YT_LIVE_CHAT_ID=YOUR_YOUTUBE_LIVE_CHAT_ID
```

Live chat ID bisa didapat dari API:
```
https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=YOUR_VIDEO_ID&key=YOUR_YOUTUBE_API_KEY
```

Ambil `activeLiveChatId` dari respon tersebut.
