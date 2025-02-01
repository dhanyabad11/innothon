export interface User {
  id: string;
  username: string;
  displayName: string;
  pronouns?: string;
  bio?: string;
  avatar?: string;
  languages: string[];
  accessibilityPreferences: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'default' | 'large' | 'larger'
  };
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  contentWarnings?: string[];
  language: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  isPrivate: boolean;
  languages: string[];
  culturalContext?: string;
}