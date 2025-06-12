import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholder response
  res.status(200).json({
    success: true,
    message: 'Transaction processed (placeholder)',
    transactionId: 'txn_1234567890',
  });
}
