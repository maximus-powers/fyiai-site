export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { query, num_results } = req.body;
  
      try {
        const response = await fetch('https://fyiai-api.maximus-powers.com/semantic_search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, num_results }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  