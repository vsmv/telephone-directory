import { supabase } from './supabase';

// Interfaces for Patentable Ideas
export interface PatentableIdea {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PatentableIdeaInsert {
  email: string;
  title: string;
  description?: string;
  category?: string;
}

// Interfaces for Learning Plans
export interface LearningPlan {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status: string;
  target_completion_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningPlanInsert {
  email: string;
  title: string;
  description?: string;
  category?: string;
  status?: 'not-started' | 'in-progress' | 'completed' | 'archived';
  target_completion_date?: string;
}

// Patentable Ideas Service
export class PatentableIdeasService {
  // Get all ideas (for admin view)
  async getAllIdeas() {
    try {
      const response = await fetch('/api/patentable-ideas');
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to fetch ideas' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getIdeasByEmail(email: string) {
    try {
      const response = await fetch(`/api/patentable-ideas?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to fetch ideas' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createIdea(idea: PatentableIdeaInsert) {
    try {
      const response = await fetch('/api/patentable-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idea)
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to create idea' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateIdea(id: string, updates: Partial<PatentableIdeaInsert>) {
    try {
      const response = await fetch('/api/patentable-ideas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to update idea' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteIdea(id: string) {
    try {
      const response = await fetch(`/api/patentable-ideas?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { error: result.error || 'Failed to delete idea' };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Learning Plans Service
export class LearningPlansService {
  // Get all plans (for admin view)
  async getAllPlans() {
    try {
      const response = await fetch('/api/learning-plans');
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to fetch plans' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getPlansByEmail(email: string) {
    try {
      const response = await fetch(`/api/learning-plans?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to fetch plans' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createPlan(plan: LearningPlanInsert) {
    try {
      const response = await fetch('/api/learning-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan)
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to create plan' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updatePlan(id: string, updates: Partial<LearningPlanInsert>) {
    try {
      const response = await fetch('/api/learning-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to update plan' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deletePlan(id: string) {
    try {
      const response = await fetch(`/api/learning-plans?id=${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { error: result.error || 'Failed to delete plan' };
      }
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updatePlanStatus(id: string, status: string) {
    try {
      const response = await fetch('/api/learning-plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to update status' };
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export service instances
export const patentableIdeasService = new PatentableIdeasService();
export const learningPlansService = new LearningPlansService();