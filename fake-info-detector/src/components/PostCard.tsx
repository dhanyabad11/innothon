import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onAnalyze: (postId: string) => Promise<void>;
}

export function PostCard({ post, onAnalyze }: PostCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    await onAnalyze(post.id);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
      <p className="text-gray-600">{post.content}</p>
      
      {!post.analysis && !isAnalyzing && (
        <div className="flex space-x-4">
          <button
            onClick={handleAnalysis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            True
          </button>
          <button
            onClick={handleAnalysis}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Fake
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Analyzing...</span>
        </div>
      )}
      
      {post.analysis && (
        <div className={`mt-4 p-4 rounded-lg ${
          post.analysis.isFake 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-2">
            {post.analysis.isFake ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className={`font-medium ${
              post.analysis.isFake ? 'text-red-700' : 'text-green-700'
            }`}>
              {post.analysis.isFake ? 'Likely Fake' : 'Likely True'}
            </span>
            <span className="text-gray-500">
              ({Math.round(post.analysis.confidence * 100)}% confidence)
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{post.analysis.explanation}</p>
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        Posted on {post.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}