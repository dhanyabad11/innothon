import React, { useState } from "react";
import { Heart, MessageCircle, Share2, AlertTriangle, Languages } from "lucide-react";
import { translateContent } from "../lib/gemini";

const SAMPLE_POSTS = [
    {
        id: "1",
        user: {
            name: "Alex Rivera",
            username: "@arivera",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            pronouns: "they/them",
        },
        content:
            "Just finished organizing our community's first cultural exchange event! So excited to share stories and learn from each other. 🎉",
        contentWarnings: [],
        language: "en",
        likes: 42,
        comments: 12,
        timeAgo: "2h",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        imageAlt:
            "A diverse group of people sitting in a circle during a community event, engaging in animated conversation. The room is bright and welcoming, with colorful cultural decorations on the walls.",
    },
    {
        id: "2",
        user: {
            name: "Sam Chen",
            username: "@schen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            pronouns: "he/him",
        },
        content:
            "New blog post about accessibility in tech and why it matters for everyone. Check it out! #a11y #inclusion",
        contentWarnings: [],
        language: "en",
        likes: 89,
        comments: 24,
        timeAgo: "4h",
    },
];

export function Feed() {
    const [translatedPosts, setTranslatedPosts] = useState<Record<string, string>>({});
    const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});

    const handleTranslatePost = async (postId: string, content: string, targetLanguage: string) => {
        if (isTranslating[postId]) return;

        setIsTranslating((prev) => ({ ...prev, [postId]: true }));
        try {
            const translated = await translateContent(content, targetLanguage);
            setTranslatedPosts((prev) => ({ ...prev, [postId]: translated }));
        } catch (error) {
            console.error("Error translating post:", error);
        } finally {
            setIsTranslating((prev) => ({ ...prev, [postId]: false }));
        }
    };

    return (
        <div className="space-y-4">
            {SAMPLE_POSTS.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start space-x-3">
                        <img src={post.user.avatar} alt="" className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{post.user.name}</h3>
                                <span className="text-gray-500">{post.user.username}</span>
                                <span className="text-sm text-gray-400">
                                    ({post.user.pronouns})
                                </span>
                                <span className="text-gray-400">· {post.timeAgo}</span>
                            </div>

                            {post.contentWarnings.length > 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 rounded-lg flex items-center space-x-2">
                                    <AlertTriangle className="text-yellow-500" size={16} />
                                    <span className="text-sm text-yellow-700">
                                        Content Warning: {post.contentWarnings.join(", ")}
                                    </span>
                                </div>
                            )}

                            <p className="mt-2">{translatedPosts[post.id] || post.content}</p>

                            {post.image && (
                                <div className="mt-3">
                                    <img
                                        src={post.image}
                                        alt={post.imageAlt}
                                        className="rounded-lg max-h-96 w-full object-cover"
                                    />
                                    <p className="mt-1 text-sm text-gray-500 italic">
                                        Image description: {post.imageAlt}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex items-center space-x-6">
                                <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                                    <Heart size={20} />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                                    <MessageCircle size={20} />
                                    <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                                    <Share2 size={20} />
                                </button>
                                <button
                                    className="flex items-center space-x-2 text-gray-500 hover:text-indigo-500"
                                    onClick={() => handleTranslatePost(post.id, post.content, "es")}
                                    disabled={isTranslating[post.id]}
                                >
                                    <Languages size={20} />
                                    <span>
                                        {isTranslating[post.id] ? "Translating..." : "Translate"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
