import React, { useState } from "react";
import { Filter, Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Types
interface Post {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
    content: string[];
}

// Sample data
const posts: Post[] = [
    {
        id: 1,
        title: "Morning Routine",
        category: "lifestyle",
        image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&q=80&w=800",
        description: "Start your day right with these tips",
        content: [
            "Wake up at 6 AM for maximum productivity",
            "10-minute meditation session",
            "Healthy breakfast preparation",
            "Quick room tidying",
            "Daily goals planning",
        ],
    },
    {
        id: 2,
        title: "Quick Workout",
        category: "fitness",
        image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80&w=800",
        description: "15-minute home workout routine",
        content: [
            "5 minutes of dynamic stretching",
            "20 bodyweight squats",
            "15 push-ups (modified if needed)",
            "30-second plank holds",
            "10 burpees for cardio",
        ],
    },
    {
        id: 3,
        title: "Healthy Breakfast Bowl",
        category: "food",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
        description: "Nutritious breakfast recipe",
        content: [
            "1 cup Greek yogurt base",
            "Mixed berries and banana slices",
            "Handful of granola",
            "Drizzle of honey",
            "Chia seeds for omega-3",
        ],
    },
    {
        id: 4,
        title: "Meditation Guide",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=800",
        description: "Begin your mindfulness journey",
        content: [
            "Find a quiet, comfortable space",
            "Set a timer for 10 minutes",
            "Focus on your breath",
            "Observe thoughts without judgment",
            "Practice daily for best results",
        ],
    },
];

const categories = ["all", "lifestyle", "fitness", "food", "wellness"];

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Custom Alert Component
const Alert = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
            <div className="ml-3">
                <p className="text-sm text-red-700">{children}</p>
            </div>
        </div>
    </div>
);

// Components
const CategoryFilter = ({
    categories,
    selected,
    onChange,
}: {
    categories: string[];
    selected: string;
    onChange: (category: string) => void;
}) => (
    <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
            <button
                key={category}
                onClick={() => onChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${
              selected === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
            >
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
        ))}
    </div>
);

const AISuggestions = ({
    suggestions,
    isLoading,
    onGenerate,
    error,
}: {
    suggestions: string[];
    isLoading: boolean;
    onGenerate: () => void;
    error: string | null;
}) => (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    AI Content Suggestions
                </h2>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    Generate Ideas
                </button>
            </div>

            {error && (
                <div className="mb-4">
                    <Alert>{error}</Alert>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100"
                    >
                        {suggestion}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PostCard = ({
    post,
    expanded,
    onToggle,
}: {
    post: Post;
    expanded: boolean;
    onToggle: () => void;
}) => (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
        <div className="p-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-1 text-gray-600">{post.description}</p>
            <div className="mt-4">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    {expanded ? (
                        <>
                            Show Less
                            <ChevronUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Show More
                            <ChevronDown className="h-4 w-4" />
                        </>
                    )}
                </button>
                {expanded && (
                    <ul className="mt-3 space-y-2">
                        {post.content.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </article>
);

// Main App Component
function App() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filteredPosts = posts.filter((post) =>
        selectedCategory === "all" ? true : post.category === selectedCategory
    );

    const generateSuggestions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Generate exactly 3 content ideas for the "${selectedCategory}" category.
      Return them in this exact JSON format:
      ["idea 1", "idea 2", "idea 3"]
      Keep each idea under 10 words. Return only the JSON array, nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            try {
                const cleanedText = text.trim().replace(/[\r\n\t]/g, "");
                const suggestions = JSON.parse(cleanedText);

                if (
                    !Array.isArray(suggestions) ||
                    suggestions.length !== 3 ||
                    !suggestions.every((item) => typeof item === "string")
                ) {
                    throw new Error("Invalid response format");
                }

                setAiSuggestions(suggestions);
            } catch (parseError) {
                console.error("Parsing error:", parseError);
                const defaultSuggestions = [
                    "Quick fitness routine for beginners",
                    "Healthy meal prep ideas",
                    "Wellness tips for daily life",
                ];
                setAiSuggestions(defaultSuggestions);
                setError("Response format issue - showing default suggestions");
            }
        } catch (error) {
            console.error("Error generating suggestions:", error);
            setError("Failed to generate suggestions. Please try again.");
            setAiSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Filter className="h-6 w-6 text-indigo-600" />
                            Content Filter
                        </h1>
                        <CategoryFilter
                            categories={categories}
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>
                </div>
            </header>

            <AISuggestions
                suggestions={aiSuggestions}
                isLoading={isLoading}
                onGenerate={generateSuggestions}
                error={error}
            />

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            expanded={expandedPost === post.id}
                            onToggle={() =>
                                setExpandedPost(expandedPost === post.id ? null : post.id)
                            }
                        />
                    ))}
                </div>
                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No posts found in this category.
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
