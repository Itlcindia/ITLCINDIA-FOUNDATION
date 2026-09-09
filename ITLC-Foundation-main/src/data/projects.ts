import initialProjects from './projects.json';

export interface ProjectStat {
  number: string;
  label: string;
}

export interface ProjectGalleryItem {
  image: string;
  caption?: string;
  alt?: string;
  order?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  description: string;
  why_matters: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  start_date?: string;
  end_date?: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  featured_image: string;
  image_alt?: string;
  objectives: string[];
  activities: string[];
  impact_description?: string;
  statistics: ProjectStat[];
  gallery?: ProjectGalleryItem[];
  video_url?: string;
  related_blogs?: string[];
  enable_donation: boolean;
  donation_button_text?: string;
  donation_url?: string;
  enable_volunteer: boolean;
  volunteer_button_text?: string;
  volunteer_url?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  is_featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function getAllProjects(): Project[] {
  if (Array.isArray(initialProjects) && initialProjects.length > 0) {
    return initialProjects as Project[];
  }
  return [];
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  const projects = getAllProjects();
  return projects.filter((p) => p.published && p.is_featured);
}

export function getRelatedProjects(currentSlug: string, category?: string, limit = 3): Project[] {
  const projects = getAllProjects().filter((p) => p.published && p.slug !== currentSlug);
  if (category) {
    const sameCat = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    const others = projects.filter((p) => p.category.toLowerCase() !== category.toLowerCase());
    return [...sameCat, ...others].slice(0, limit);
  }
  return projects.slice(0, limit);
}
