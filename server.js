const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ TTS WebSocket Server is running');
});

app.post('/send', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send('Missing message');

  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message }));
    }
  });

  console.log('📨 Dikirim ke overlay:', message);
  res.sendStatus(200);
});

app.post('/tiktok', (req, res) => {
  const { type, user, giftName } = req.body;

  let message = '';
  if (type === 'gift') {
    message = `${user} mengirim gift ${giftName}`;
  } else if (type === 'join') {
    message = `${user} bergabung ke live`;
  } else if (type === 'guest') {
    message = `${user} menjadi tamu live!`;
  } else {
    message = `${user} mengirim interaksi`;
  }

  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message }));
    }
  });

  console.log('🎁 TikTok:', message);
  res.sendStatus(200);
});

wss.on('connection', (ws) => {
  console.log('🔌 Browser overlay terhubung');
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
    console.log('❌ Browser overlay keluar');
  });
});

// YouTube Live Chat polling
let nextPageToken = null;
async function fetchYouTubeChat() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/liveChat/messages', {
      params: {
        liveChatId: process.env.YT_LIVE_CHAT_ID,
        part: 'snippet,authorDetails',
        key: process.env.YT_API_KEY,
        pageToken: nextPageToken || '',
      },
    });

    nextPageToken = response.data.nextPageToken;

    response.data.items.forEach(item => {
      const author = item.authorDetails.displayName;
      const message = item.snippet.displayMessage;
      const fullMsg = `${author}: ${message}`;
      console.log('💬 YT:', fullMsg);

      clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ message: fullMsg }));
        }
      });
    });
  } catch (err) {
    console.error('❌ Error fetch YouTube chat:', err.message);
  }

  setTimeout(fetchYouTubeChat, 5000);
}

if (process.env.YT_LIVE_CHAT_ID && process.env.YT_API_KEY) {
  fetchYouTubeChat();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server aktif di port ${PORT}`);
});
