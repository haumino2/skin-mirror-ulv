export default async function handler(req, res) {
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path]
  const path = pathParts.join('/')
  const url = `https://api.vieneu.io/api/${path}`

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.VITE_VIENEU_API_KEY || '',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed' })
  }
}
