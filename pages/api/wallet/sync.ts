import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholder response
  res.status(200).json({
    success: true,
    message: 'Wallet sync triggered (placeholder)',
    syncStatus: 'in-progress',
  });
}
