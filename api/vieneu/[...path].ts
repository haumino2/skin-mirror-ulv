import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = (req.query.path as string[]).join('/')
  const url = `https://api.vieneu.io/api/${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const apiKey = process.env.VITE_VIENEU_API_KEY
  if (apiKey) headers['X-API-Key'] = apiKey

  const response = await fetch(url, {
    method: req.method,
    headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  })

  const data = await response.json()
  res.status(response.status).json(data)
}
