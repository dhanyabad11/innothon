import React, { useState } from 'react';
import { PostForm } from './components/PostForm';
import { PostCard } from './components/PostCard';
import { analyzePost } from './services/gemini';
import { Post } from './types';
import { Newspaper } from 'lucide-react';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleCreatePost = (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleAnalyzePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      const analysis = await analyzePost(post.title, post.content);
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { ...p, analysis } 
            : p
        )
      );
    } catch (error) {
      console.error('Error analyzing post:', error);
      alert('Failed to analyze post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Truth Checker</h1>
          </div>
          <p className="text-gray-600">Create posts and verify their credibility with AI</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <PostForm onSubmit={handleCreatePost} />
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onAnalyze={handleAnalyzePost}
            />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No posts yet. Create your first post above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;