import axios from 'axios';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || '';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const SHOPIFY_SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || '';

const apiBase = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2023-10`;

export async function getProducts() {
  try {
    const response = await axios.get(`${apiBase}/products.json`, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    return response.data.products;
  } catch (error) {
    console.error('Shopify REST API Error:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function createOrder(orderData: any) {
  try {
    const response = await axios.post(
      `${apiBase}/orders.json`,
      { order: orderData },
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.order;
  } catch (error) {
    console.error('Shopify REST API Error:', error);
    throw new Error('Failed to create order');
  }
}
