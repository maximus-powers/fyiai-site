import { useEffect, useState, useRef } from 'react';

const TopArticles = () => {
  const [heroData, setHeroData] = useState(null);
  const [error, setError] = useState(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("https://fyiai-api.maximus-powers.com/daily_hero");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error.message);
        setError(error.message);
      }
    };

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (headlineRef.current) {
      const headlineLength = headlineRef.current.textContent.length;
      const baseFontSize = 3; // base font size in rem
      const maxFontSize = 4; // max font size in rem
      const minFontSize = 1.2; // min font size in rem
      const lengthThreshold = 40; // adjust this value as needed
      const newFontSize = Math.max(minFontSize, Math.min(baseFontSize - (headlineLength / lengthThreshold), maxFontSize));
      headlineRef.current.style.fontSize = `${newFontSize}rem`;
    }
  }, [heroData]);

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">{`Error: ${error}`}</div>;
  }

  if (!heroData) {
    return <div>Loading...</div>;
  }

  const { main_headline, main_subline, main_url, other_stories_summary = [], story_2_url, story_3_url, gif_url } = heroData;
  const otherStoriesUrls = [story_2_url, story_3_url];

  return (
    <section className="px-2">
      <div className="flex">
        <div className="w-full h-full pr-5 pt-2">
          {gif_url && (
            <div className="w-36 h-36 overflow-hidden relative">
              <iframe 
                src={gif_url} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                frameBorder="0" 
                allowFullScreen 
                title="Hero"
              ></iframe>
            </div>
          )}
        </div>
        <div className="w-full md:mt-0">
          {main_headline && (
            <a href={main_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              <h2 ref={headlineRef} className="text-black leading-tight dark:text-white">{main_headline}</h2>
            </a>
          )}
        </div>
      </div>
      {main_subline && <p className="text-xl italic mt-2 pb-5 border-b border-zinc-400">{main_subline}</p>}
      {other_stories_summary.map((summary, index) => (
        <p key={index} className="text-lg mt-5 pb-5 border-b border-zinc-400">
          {otherStoriesUrls[index] ? (
            <a href={otherStoriesUrls[index]} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:underline dark:text-zinc-400">
              {summary}
            </a>
          ) : (
            summary
          )}
        </p>
      ))}
    </section>
  );
};

export default TopArticles;
