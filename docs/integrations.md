# EHB API Integrations Status

## AI & NLP

- ✅ OpenAI GPT-4 API
- ✅ Cohere API
- ✅ Google Vertex AI

## Location & Maps

- ✅ Mapbox GL
- ✅ Google Maps API

## E-commerce & Shipping

- ✅ EasyPost API
- ✅ Shippo API
- ❌ UPCitemDB (Not available in npm registry)

## SMS & Authentication

- ✅ Twilio
- ✅ MessageBird

## Document Verification & KYC

- ✅ Onfido API
- ❌ Veriff SDK (Not available in npm registry)

## Fraud Detection

- ❌ SEON API (Not available in npm registry)
- ❌ IPQualityScore (Not available in npm registry)

## UI & Testing

- ✅ Chart.js
- ✅ Recharts
- ✅ Jest
- ✅ React Testing Library
- ✅ Jest DOM

---

## Environment Variables (.env.local Example)

```
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Shopify
SHOPIFY_API_KEY=your_shopify_api_key_here
SHOPIFY_API_SECRET=your_shopify_api_secret_here
SHOPIFY_ACCESS_TOKEN=your_shopify_access_token_here
SHOPIFY_SHOP_DOMAIN=your_shop_domain_here

# Payoneer
PAYONEER_USERNAME=your_payoneer_username_here
PAYONEER_PASSWORD=your_payoneer_password_here
```

---

## Usage Examples

### OpenAI

```ts
import { generateText } from '@/lib/api/openai';
const text = await generateText('Hello!');
```

### Shopify

```ts
import { getProducts } from '@/lib/api/shopify';
const products = await getProducts();
```

### Payoneer

```ts
import { getAccountBalance } from '@/lib/api/payoneer';
const balance = await getAccountBalance();
```

---

## Next Steps

- Add your real API keys to `.env.local` in the project root.
- Never commit `.env.local` to git (it is in .gitignore by default).
- Use the provided functions in your Next.js API routes or backend logic.
- For more APIs, follow the same pattern: use environment variables for secrets, and document usage in this file.

## Required API Keys & Credentials

### AI Services

- OpenAI API Key
- Cohere API Key
- Google Cloud Project Credentials

### Maps

- Mapbox Access Token
- Google Maps API Key

### Shipping

- EasyPost API Key
- Shippo API Key

### SMS

- Twilio Account SID & Auth Token
- MessageBird API Key

### KYC

- Onfido API Token

## Notes

- Some APIs require paid accounts
- Rate limits apply to all APIs
- Error handling should be implemented for all API calls
- Consider implementing caching for frequently used API responses
