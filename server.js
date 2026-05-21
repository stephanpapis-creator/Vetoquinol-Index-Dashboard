const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt } = req.body;
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], tools:[{google_search:{}}] }) }
    );
    const d = await r.json();
    const text = (d?.candidates?.[0]?.content?.parts||[]).filter(p=>p.text).map(p=>p.text).join('');
    res.json({ text });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.listen(process.env.PORT || 3000);
