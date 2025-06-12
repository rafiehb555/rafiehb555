import { Intent } from './intentRouter';

interface UserContext {
  id: string;
  sqlLevel: number;
  wallet: {
    balance: number;
    lockedCoins: number;
  };
}

interface PromptContext {
  message: string;
  intent: Intent;
  serviceMap: {
    route: string;
    filters: Record<string, any>;
    actions: Record<string, any>;
    discounts: {
      loyalty: number;
      sql: number;
    };
  };
  user: UserContext;
}

export async function buildPrompt(context: PromptContext): Promise<string> {
  const { intent, serviceMap, user } = context;

  // Base system prompt
  let prompt = `You are EHB's AI Assistant, a helpful guide for the Everything Hub Business platform. 
You help users navigate education, health, and shopping services across Pakistan.

Current Context:
- User SQL Level: ${user.sqlLevel}
- Wallet Balance: ${user.wallet.balance} PKR
- Locked Coins: ${user.wallet.lockedCoins} PKR
- Detected Intent: ${intent.type}
- Service: ${intent.service || 'none'}
- Available Discounts: ${serviceMap.discounts.loyalty}% loyalty, ${serviceMap.discounts.sql}% SQL

Guidelines:
1. Always mention available discounts if relevant
2. Only show SQL-verified listings (SQL Level ≥ 3)
3. Suggest coin locking for better discounts
4. Keep responses concise and actionable
5. Include direct links when possible
6. Support both English and Urdu responses

`;

  // Add intent-specific instructions
  switch (intent.type) {
    case 'education':
      prompt += `
For Education Queries:
- Recommend verified tutors only
- Mention subject expertise
- Include location and pricing
- Suggest booking if requested
- Highlight loyalty discounts
`;
      break;

    case 'health':
      prompt += `
For Health Queries:
- List verified doctors only
- Include specialization
- Mention location and fees
- Suggest appointment booking
- Highlight health-specific discounts
`;
      break;

    case 'shopping':
      prompt += `
For Shopping Queries:
- Show verified products
- Include category and price
- Mention delivery options
- Suggest cart addition
- Highlight shopping discounts
`;
      break;

    case 'wallet':
      prompt += `
For Wallet Queries:
- Show current balance
- Explain coin locking benefits
- List available discounts
- Suggest optimal locking strategy
`;
      break;

    case 'franchise':
      prompt += `
For Franchise Queries:
- Explain franchise benefits
- List requirements
- Mention investment options
- Guide through application
`;
      break;
  }

  // Add action-specific instructions
  if (intent.actions?.book) {
    prompt += `
Booking Instructions:
- Confirm user's intent to book
- Show available time slots
- Mention any prerequisites
- Explain payment process
- Highlight applicable discounts
`;
  }

  if (intent.actions?.apply) {
    prompt += `
Application Instructions:
- List required documents
- Explain application process
- Mention eligibility criteria
- Highlight benefits
`;
  }

  return prompt;
}
