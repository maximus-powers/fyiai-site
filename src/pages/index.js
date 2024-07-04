import { useState } from 'react';
import Head from 'next/head';
import DarkModeToggle from '../components/DarkModeToggle';
import HeroSection from '../components/HeroSection';
import TopArticles from '../components/TopArticles';
import TrendingTopics from '../components/TrendingTopics';
import SearchBar from '../components/SearchBar';
import { ChakraProvider, Box, Skeleton, VStack } from '@chakra-ui/react';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setShowResults(true);  // Ensure the results section is displayed immediately
    try {
      const response = await fetch('/api/semantic_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, num_results: 10 }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const articles = data.results;
      console.log('Search results:', articles);
      setSearchResults(articles);
    } catch (error) {
      console.error('Error fetching search results:', error.message);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <ChakraProvider>
      <div className="min-h-screen bg-gray-200 dark:bg-zinc-900 text-black dark:text-white">
        <Head>
          <title>The Daily Byte</title>
          <meta name="description" content="AI-curated AI news, and trend analysis [!-)]" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          />
        </Head>

        <div className="py-2 px-4 bg-black dark:bg-black flex justify-between items-center">
          <div className="flex items-center"><DarkModeToggle /></div>
          <div className="flex-grow pl-10 py-2 md:pl-48"><SearchBar onSearch={handleSearch} /></div>
        </div>

        <main className="container mx-auto px-4 py-3">
          <HeroSection />
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="col-span-1 md:col-span-3">
              {showResults ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Search Results</h3>
                    <button
                      className="text-red-400"
                      onClick={handleCloseResults}
                    >
                      <i className="fas fa-times"></i> Close
                    </button>
                  </div>
                  <div className="mt-4">
                    {isLoading ? (
                      <div className="mt-5 px-3 pb-48">
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
                      <ul className="list-disc px-3 space-y-2">
                        {searchResults
                          .filter(result => result.title && result.source) // Filter results that have both title and source
                          .map((result, index) => (
                            <div key={index} className="border-b border-zinc-400 pb-5 mb-2">
                              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                <h4 className="text-lg font-semibold text-zinc-600 dark:text-zinc-200">{result.title}</h4>
                                <p className="text-gray-400">{result.source}</p>
                              </a>
                            </div>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="col-span-1 md:col-span-3 md:col-start-2 md:pb-10">
                      <TopArticles />
                  </div>
                  <TrendingTopics />
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="p-4 bg-black text-center text-zinc-300">
          <p>&copy; 2024 maxie productions</p>
          <p>no rights reserved ;)</p>
        </footer>
      </div>
    </ChakraProvider>
  );
}
