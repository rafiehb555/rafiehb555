import { RoadmapData, Module, Feature, ApiEndpoint, BusinessRule, TimelineEvent } from '../types';

export class SearchService {
  private static readonly FUZZY_THRESHOLD = 0.6;
  private static readonly WEIGHTS = {
    title: 1.0,
    description: 0.8,
    status: 0.6,
    priority: 0.4,
    tags: 0.3
  };

  private static calculateFuzzyScore(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1.includes(s2) || s2.includes(s1)) return 1;
    
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    let maxScore = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        const score = this.calculateLevenshteinDistance(word1, word2);
        maxScore = Math.max(maxScore, score);
      }
    }
    
    return maxScore;
  }

  private static calculateLevenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1,
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1
          );
        }
      }
    }

    const maxLen = Math.max(m, n);
    return 1 - dp[m][n] / maxLen;
  }

  private static calculateRelevanceScore(item: any, query: string, filters: SearchFilters): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title and description scoring
    if (item.title) {
      const titleScore = this.calculateFuzzyScore(item.title, query);
      score += titleScore * this.WEIGHTS.title;
    }
    if (item.description) {
      const descScore = this.calculateFuzzyScore(item.description, query);
      score += descScore * this.WEIGHTS.description;
    }

    // Status scoring
    if (item.status && filters.status) {
      score += item.status === filters.status ? this.WEIGHTS.status : 0;
    }

    // Priority scoring
    if (item.priority && filters.priority) {
      score += item.priority === filters.priority ? this.WEIGHTS.priority : 0;
    }

    // Tags scoring
    if (item.tags && filters.tags) {
      const matchingTags = item.tags.filter((tag: string) => 
        filters.tags?.includes(tag)
      ).length;
      score += (matchingTags / (filters.tags?.length || 1)) * this.WEIGHTS.tags;
    }

    return score;
  }

  static search(data: RoadmapData, query: string, filters: SearchFilters = {}): SearchResult[] {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();

    // Search in modules
    data.modules.forEach(module => {
      const score = this.calculateRelevanceScore(module, query, filters);
      if (score >= this.FUZZY_THRESHOLD) {
        results.push({
          type: 'module',
          item: module,
          score,
          matches: this.findMatches(module, query)
        });
      }

      // Search in features
      module.features.forEach(feature => {
        const featureScore = this.calculateRelevanceScore(feature, query, filters);
        if (featureScore >= this.FUZZY_THRESHOLD) {
          results.push({
            type: 'feature',
            item: feature,
            score: featureScore,
            matches: this.findMatches(feature, query)
          });
        }
      });
    });

    // Search in timeline events
    data.timeline.forEach(event => {
      const score = this.calculateRelevanceScore(event, query, filters);
      if (score >= this.FUZZY_THRESHOLD) {
        results.push({
          type: 'timeline',
          item: event,
          score,
          matches: this.findMatches(event, query)
        });
      }
    });

    // Sort by score and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  private static findMatches(item: any, query: string): string[] {
    const matches: string[] = [];
    const queryLower = query.toLowerCase();

    if (item.title?.toLowerCase().includes(queryLower)) {
      matches.push(`Title: ${item.title}`);
    }
    if (item.description?.toLowerCase().includes(queryLower)) {
      matches.push(`Description: ${item.description}`);
    }
    if (item.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
      matches.push(`Tags: ${item.tags.join(', ')}`);
    }

    return matches;
  }
}

export interface SearchFilters {
  status?: string;
  priority?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResult {
  type: 'module' | 'feature' | 'timeline';
  item: Module | Feature | TimelineEvent;
  score: number;
  matches: string[];
} 