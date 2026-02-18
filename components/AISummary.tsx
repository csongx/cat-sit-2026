
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Friend } from '../types';

interface AISummaryProps {
  reservations: Record<string, string>;
  friends: Friend[];
}

const AISummary: React.FC<AISummaryProps> = ({ reservations, friends }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const generateSummary = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Prepare schedule string
        const schedule = Object.entries(reservations)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, id]) => {
            const name = friends.find(f => f.id === id)?.name;
            return `${date}: ${name}`;
          })
          .join('\n');

        const prompt = `
          I have two cats and a summer vacation from July 25 to Aug 5, 2026.
          My friends have signed up for different days to feed the cats.
          Here is the current schedule:
          ${schedule}

          Please write a short, warm, and funny message to my friends. 
          Mention if any days are still missing (total should be 12 days).
          Keep it brief and cat-themed. Mention the cats (Max and Luna).
          Output just the text, no conversational filler.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        setSummary(response.text || "No insights found yet! 🐾");
      } catch (error) {
        console.error("AI Error:", error);
        setSummary("The cats are speechless (AI error)! But they still need feeding. 🐱");
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [reservations, friends]);

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 mt-4 relative overflow-hidden">
      <div className="absolute -top-4 -right-4 opacity-10 text-8xl">💬</div>
      <h3 className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-3 flex items-center">
        <span className="mr-2">✨</span> Cat Assistant's Note
      </h3>
      {loading ? (
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
        </div>
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
          "{summary}"
        </p>
      )}
    </div>
  );
};

export default AISummary;
