import { NextApiRequest, NextApiResponse } from 'next';
import templatesData from '../../data/templates.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Simulate network delay for realistic loading state
    setTimeout(() => {
      res.status(200).json(templatesData);
    }, Math.random() * 800 + 300);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}