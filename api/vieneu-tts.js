export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.vieneu.io/api/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.VITE_VIENEU_API_KEY || '',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}
