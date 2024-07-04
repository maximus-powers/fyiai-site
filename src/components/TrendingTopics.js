import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useColorMode, Box, Skeleton, VStack } from '@chakra-ui/react';

const TrendingTopics = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeSubtopics, setActiveSubtopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode(); // Access the current color mode

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
    setIsLoading(true);
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
    setIsLoading(false);
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

  const lightButtonColors = [
    'bg-blue-400',
    'bg-green-400',
    'bg-red-400',
    'bg-yellow-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-indigo-400',
    'bg-teal-400',
  ];

  const darkButtonColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const filteredArticles = articles.filter(article => article.title && article.source).slice(0, 3);

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">{`Error: ${error}`}</div>;
  }

  return (
    <section className="p-3 pt-8 md:pt-0">
      <h2 className="text-3xl font-bold mb-4">🔥Trending Topics</h2>
      <div className="space-y-4 pb-8">
        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} className="rounded">
            <div
              className="text-xl font-semibold cursor-pointer flex items-center"
              onClick={() => handleTopicClick(topicIndex, topic.topic)}
            >
              <span className="mr-2 dark:text-zinc-400 text-zinc-600">
                {activeTopic === topicIndex ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <span className="text-2xl dark:text-zinc-300">{topic.topic}</span>
            </div>
            <div className="flex flex-wrap mt-2 space-x-1">
              {topic.subtopics.map((subtopic, subIndex) => (
                <button
                  key={subIndex}
                  className={`cursor-pointer text-sm px-3 py-1 my-1 rounded-full border dark:border dark:border-black dark:border-1 ${
                    activeSubtopics[topicIndex] === subIndex
                      ? 'bg-black text-white font-bold'
                      : `${
                          colorMode === 'light'
                            ? lightButtonColors[subIndex % lightButtonColors.length]
                            : darkButtonColors[subIndex % darkButtonColors.length]
                        } text-black dark:text-zinc-900`
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
                  {isLoading ? (
                    <div className="mt-5 px-3">
                      <VStack spacing={2} alignItems="flex-start" className="border-b border-zinc-400 pb-5 mt-3">
                        <Skeleton height="18px" width="100%" />
                        <Skeleton height="18px" width="78%" />
                        <Skeleton height="13px" width="25%" />
                      </VStack>
                      <VStack spacing={2} alignItems="flex-start" className="border-b border-zinc-400 pb-5 mt-3">
                        <Skeleton height="18px" width="100%" />
                        <Skeleton height="18px" width="78%" />
                        <Skeleton height="13px" width="25%" />
                      </VStack>
                      <VStack spacing={2} alignItems="flex-start" className="border-b border-zinc-400 pb-5 mt-3">
                        <Skeleton height="18px" width="100%" />
                        <Skeleton height="18px" width="78%" />
                        <Skeleton height="13px" width="25%" />
                      </VStack>
                    </div>
                  ) : (
                    <div className="list-disc space-y-2 pt-1">
                      {Array.isArray(filteredArticles) && filteredArticles.map((article, index) => (
                        <div key={index} className="border-b border-zinc-400 pb-2 mb-2">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            <h4 className="text-lg font-semibold dark:text-zinc-300">{article.title}</h4><h4 className="text-grey-400">{article.source}</h4>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
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
