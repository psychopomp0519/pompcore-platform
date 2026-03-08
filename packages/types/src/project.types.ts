/**
 * @file Project and service type definitions
 * @module @pompcore/types/project
 */

export type ProjectStatus = 'active' | 'coming_soon' | 'beta' | 'maintenance';
export type ProjectCategory = 'finance' | 'productivity' | 'education' | 'lifestyle';

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon: string;
  status: ProjectStatus;
  category: ProjectCategory;
  categoryLabel?: string;
  accentColor: string;
  accentGradient?: string;
  accentGradientCSS?: string;
  logoSrc?: string;
  url?: string;
  features?: string[];
  stats?: Array<{ label: string; value: number }>;
}
