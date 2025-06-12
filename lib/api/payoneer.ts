import axios from 'axios';

const PAYONEER_API_URL = 'https://api.payoneer.com';

const PAYONEER_USERNAME = process.env.PAYONEER_USERNAME || '';
const PAYONEER_PASSWORD = process.env.PAYONEER_PASSWORD || '';

export async function getAccountBalance() {
  try {
    const response = await axios.get(`${PAYONEER_API_URL}/v2/accounts/balance`, {
      auth: {
        username: PAYONEER_USERNAME,
        password: PAYONEER_PASSWORD,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Payoneer API Error:', error);
    throw new Error('Failed to fetch account balance');
  }
}

export async function createPayment(amount: number, currency: string, description: string) {
  try {
    const response = await axios.post(
      `${PAYONEER_API_URL}/v2/payments`,
      {
        amount,
        currency,
        description,
      },
      {
        auth: {
          username: PAYONEER_USERNAME,
          password: PAYONEER_PASSWORD,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payoneer API Error:', error);
    throw new Error('Failed to create payment');
  }
}

export default {
  getAccountBalance,
  createPayment,
};
