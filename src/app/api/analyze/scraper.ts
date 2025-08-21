import puppeteer from "puppeteer";

// Scrape reviews from the product URL
export async function scrapeReviews(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Example: scrape Amazon reviews (adjust selectors as needed)
  const reviewElements = await page.$$(".review-text-content span");
  console.log(`Found ${reviewElements.length} review elements`);

  const reviews = await page.$$eval(".review-text-content span", (nodes) =>
  nodes.map((n) => n.textContent?.trim() || "")
  );

  console.log("Reviews:", reviews);

  await browser.close();

  return reviews;
}

// Call Gemini API to summarize reviews
export async function summarizeReviews(reviews: string[]): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API key");
  
    // Build the prompt by joining reviews with newlines
    const prompt = `Summarize these product reviews:\n\n${reviews.join("\n")}\n\nSummary:`;
  
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
  
    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const candidate = data?.candidates?.[0];
    const summaryText = Array.isArray(candidate?.content?.parts)
        ? candidate.content.parts.join("")
        : "No summary available";
    
    return summaryText;
  }

// Combined function to scrape and summarize
export async function scrapeAndSummarize(url: string) {
  const reviews = await scrapeReviews(url);
  const summary = await summarizeReviews(reviews);
  return { reviews, summary };
}
