export default async function handler(req, res) {
    try {
      const response = await fetch('http://fyiai-api.maximus-powers.com/trending_topics');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching trending topics:', error.message);
      res.status(500).json({ error: `Failed to fetch trending topics: ${error.message}` });
    }
  }
  