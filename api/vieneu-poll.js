export default async function handler(req, res) {
  const { jobId } = req.query
  try {
    const response = await fetch(`https://api.vieneu.io/api/v1/tts/${jobId}`, {
      headers: { 'X-API-Key': process.env.VITE_VIENEU_API_KEY || '' },
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}
