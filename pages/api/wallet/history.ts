import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Placeholder response
  res.status(200).json({
    transactions: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
  });
}
