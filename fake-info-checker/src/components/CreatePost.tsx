import React, { useState, useRef } from 'react';
import { Send, AlertCircle, Wand2, Shield, Image, Languages } from 'lucide-react';
import { 
  generateContentSuggestions, 
  improveAccessibility, 
  suggestContentWarnings,
  generateImageDescription,
  translateContent
} from '../lib/gemini';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [contentWarning, setContentWarning] = useState('');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedWarnings, setSuggestedWarnings] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageDescription, setImageDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIAssist = async () => {
    if (!content) return;
    setIsLoading(true);
    try {
      const improvedContent = await improveAccessibility(content);
      setContent(improvedContent);
      
      const warnings = await suggestContentWarnings(improvedContent);
      setSuggestedWarnings(warnings);
      if (warnings.length > 0) {
        setContentWarning(warnings.join(', '));
      }
    } catch (error) {
      console.error('Error using AI assistance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    try {
      const suggestion = await generateContentSuggestions(
        'Generate an engaging, inclusive social media post about community building and diversity'
      );
      setContent(suggestion);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsLoading(true);
    try {
      const description = await generateImageDescription(previewUrl);
      setImageDescription(description);
    } catch (error) {
      console.error('Error generating image description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!content) return;
    setIsLoading(true);
    try {
      const translated = await translateContent(content, language);
      setContent(translated);
    } catch (error) {
      console.error('Error translating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-4">
        <textarea
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your thoughts..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <button
          className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
          onClick={handleGetSuggestions}
          disabled={isLoading}
        >
          <Wand2 size={18} />
          <span>Get AI Suggestions</span>
        </button>

        <button
          className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
          onClick={handleAIAssist}
          disabled={!content || isLoading}
        >
          <Shield size={18} />
          <span>Improve & Check Content</span>
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        
        <button
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={18} />
          <span>Add Image</span>
        </button>
      </div>

      {imagePreview && (
        <div className="mb-4">
          <div className="relative">
            <img
              src={imagePreview}
              alt={imageDescription}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
          {imageDescription && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-semibold">AI-Generated Description:</p>
              <p>{imageDescription}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 flex-grow">
          <AlertCircle className="text-yellow-500" size={20} />
          <input
            type="text"
            placeholder="Content warning (if needed)"
            className="border rounded px-2 py-1 text-sm flex-grow"
            value={contentWarning}
            onChange={(e) => setContentWarning(e.target.value)}
          />
        </div>

        {suggestedWarnings.length > 0 && (
          <div className="w-full text-sm text-yellow-600">
            <p>Suggested warnings: {suggestedWarnings.join(', ')}</p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="zh">中文</option>
          </select>

          <button
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
            onClick={handleTranslate}
            disabled={!content || isLoading}
          >
            <Languages size={18} />
            <span>Translate</span>
          </button>
        </div>

        <button
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          onClick={() => {/* TODO: Implement post creation */}}
          disabled={isLoading}
        >
          <Send size={20} />
          <span>Post</span>
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          Processing with AI...
        </div>
      )}
    </div>
  );
}