import { supabase } from './supabase';

// Interfaces for Patentable Ideas
export interface PatentableIdea {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  date_added: string;
  last_modified: string;
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
  status: 'In Progress' | 'Completed' | 'On Hold';
  target_completion_date?: string;
  date_added: string;
  last_modified: string;
}

export interface LearningPlanInsert {
  email: string;
  title: string;
  description?: string;
  category?: string;
  status?: 'In Progress' | 'Completed' | 'On Hold';
  target_completion_date?: string;
}

// Patentable Ideas Service
export class PatentableIdeasService {
  async getIdeasByEmail(email: string) {
    return await supabase
      .from('patentable_ideas')
      .select('*')
      .eq('email', email)
      .order('date_added', { ascending: false });
  }

  async createIdea(idea: PatentableIdeaInsert) {
    return await supabase
      .from('patentable_ideas')
      .insert(idea)
      .select()
      .single();
  }

  async updateIdea(id: string, updates: Partial<PatentableIdeaInsert>) {
    return await supabase
      .from('patentable_ideas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }

  async deleteIdea(id: string) {
    return await supabase
      .from('patentable_ideas')
      .delete()
      .eq('id', id);
  }
}

// Learning Plans Service
export class LearningPlansService {
  async getPlansByEmail(email: string) {
    return await supabase
      .from('learning_plans')
      .select('*')
      .eq('email', email)
      .order('date_added', { ascending: false });
  }

  async createPlan(plan: LearningPlanInsert) {
    return await supabase
      .from('learning_plans')
      .insert(plan)
      .select()
      .single();
  }

  async updatePlan(id: string, updates: Partial<LearningPlanInsert>) {
    return await supabase
      .from('learning_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }

  async deletePlan(id: string) {
    return await supabase
      .from('learning_plans')
      .delete()
      .eq('id', id);
  }

  async updatePlanStatus(id: string, status: 'In Progress' | 'Completed' | 'On Hold') {
    return await supabase
      .from('learning_plans')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
  }
}

// Export service instances
export const patentableIdeasService = new PatentableIdeasService();
export const learningPlansService = new LearningPlansService();