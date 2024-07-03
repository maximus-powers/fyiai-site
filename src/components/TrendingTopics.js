import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const TrendingTopics = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeSubtopics, setActiveSubtopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/trending_topics');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopics(data.curated);
        // Initialize activeSubtopics state
        setActiveSubtopics(new Array(data.curated.length).fill(null));
      } catch (error) {
        console.error('Error fetching topics:', error.message);
        setError(error.message);
      }
    };

    fetchTopics();
  }, []);

  const fetchArticles = async (query) => {
    try {
      const response = await fetch('/api/semantic_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, num_results: 5 }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched articles data:', data);
      const articles = data.results; // this might not work, test later
      const uniqueArticles = removeDuplicateArticles(articles);
      setArticles(uniqueArticles);
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      setError(error.message);
    }
  };

  const removeDuplicateArticles = (articles) => {
    const seenTitles = new Set();
    return articles.filter((article) => {
      if (seenTitles.has(article.title)) {
        return false;
      }
      seenTitles.add(article.title);
      return true;
    });
  };

  const handleTopicClick = (topicIndex, topic) => {
    setActiveTopic(activeTopic === topicIndex ? null : topicIndex);
    setActiveSubtopics((prev) => {
      const newActiveSubtopics = [...prev];
      newActiveSubtopics[topicIndex] = null;
      return newActiveSubtopics;
    });
    if (activeTopic !== topicIndex) {
      fetchArticles(topic);
    }
  };

  const handleSubtopicClick = (topicIndex, subIndex, subtopic) => {
    setActiveTopic(topicIndex);
    setActiveSubtopics((prev) => {
      const newActiveSubtopics = [...prev];
      newActiveSubtopics[topicIndex] = subIndex;
      return newActiveSubtopics;
    });
    fetchArticles(subtopic);
  };

  const buttonColors = [
    'bg-red-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-yellow-300',
    'bg-purple-300',
    'bg-pink-300',
    'bg-indigo-300',
    'bg-teal-300',
  ];

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">{`Error: ${error}`}</div>;
  }

  return (
    <section className="p-3">
      <h2 className="text-3xl font-bold mb-4">🔥Trending Words</h2>
      <div className="space-y-4">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="rounded">
            <div
              className="text-xl font-semibold cursor-pointer flex items-center"
              onClick={() => handleTopicClick(topicIndex, topic.topic)}
            >
              <span className="mr-2">
                {activeTopic === topicIndex ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <span className="text-2xl">{topic.topic}</span>
            </div>
            <div className="flex flex-wrap mt-2 space-x-1">
              {topic.subtopics.map((subtopic, subIndex) => (
                <button
                  key={subIndex}
                  className={`cursor-pointer text-sm px-3 py-1 my-1 rounded-full border ${
                    activeSubtopics[topicIndex] === subIndex
                      ? 'bg-black text-white font-bold'
                      : `${buttonColors[subIndex % buttonColors.length]} dark:bg-gray-700 text-black dark:text-white`
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent click
                    handleSubtopicClick(topicIndex, subIndex, subtopic.name);
                  }}
                >
                  {subtopic.name}
                </button>
              ))}
            </div>
            {activeTopic === topicIndex && (
              <div className="mt-2">
                <p className="mt-2">
                  {activeSubtopics[topicIndex] === null
                    ? topic.news_summary
                    : topic.subtopics[activeSubtopics[topicIndex]].definition}
                </p>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold mb-2">Related Articles</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.isArray(articles) && articles.map((article, index) => (
                      <li key={index} className="border-b pb-2 mb-2">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          <h4 className="text-lg font-semibold">{article.title}</h4><h4 className="text-grey-400">{article.source}</h4>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopics;
