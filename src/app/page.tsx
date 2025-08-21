"use client"; // needed because we’ll use React hooks

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch("http://localhost:5678/webhook-test/review_scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to analyze");
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">🛒 AI Shopping Assistant</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <input
          type="text"
          placeholder="Paste product URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Reviews"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {summary && (
        <section className="mt-6 max-w-xl bg-indigo-500 p-4 rounded">
          <h2 className="text-2xl font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </section>
      )}
    </main>
  );
}
