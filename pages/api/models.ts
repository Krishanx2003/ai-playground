import { NextApiRequest, NextApiResponse } from 'next';
import modelsData from '../../data/models.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Simulate network delay for realistic loading state
    setTimeout(() => {
      res.status(200).json(modelsData);
    }, Math.random() * 1000 + 500);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}