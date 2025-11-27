export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { botToken, chatId, message } = req.body;

    if (!botToken || !chatId || !message) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: data.description || 'Unknown error' 
      });
    }
  } catch (error) {
    console.error('Telegram API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}