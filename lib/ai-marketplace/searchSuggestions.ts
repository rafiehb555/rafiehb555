// Mock data for search suggestions
const mockSuggestions = [
  'AI Chatbot Development',
  'Data Analysis Services',
  'Machine Learning Models',
  'Natural Language Processing',
  'Computer Vision Solutions',
  'Predictive Analytics',
  'AI Consulting',
  'Automation Services',
  'Deep Learning Solutions',
  'AI Integration',
];

// Simulate AI-based prediction logic
export async function getSearchSuggestions(query: string): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase();

  // Filter suggestions based on query
  const matches = mockSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(normalizedQuery)
  );

  // Sort by relevance (simplified)
  return matches
    .sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(normalizedQuery);
      const bStartsWith = b.toLowerCase().startsWith(normalizedQuery);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    })
    .slice(0, 5); // Limit to 5 suggestions
}
