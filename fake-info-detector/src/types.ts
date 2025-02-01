export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  analysis?: {
    isFake: boolean;
    confidence: number;
    explanation: string;
  };
}