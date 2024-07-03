import Head from 'next/head';
import DarkModeToggle from '../components/DarkModeToggle';
import HeroSection from '../components/HeroSection';
import TopArticles from '../components/TopArticles';
import TrendingTopics from '../components/TrendingTopics';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Head>
        <title>AI News Website</title>
        <meta name="description" content="Stay updated with the latest in AI news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-3 px-4 bg-black dark:bg-gray-600">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-xl text-white lowercase">ai news ;)</h2>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-3">
        <HeroSection vol={1} />
        <TopArticles />
        <TrendingTopics />
      </main>

      <footer className="p-4 bg-gray-200 dark:bg-gray-800 text-center">
        <p>&copy; 2024 AI News. All rights reserved.</p>
      </footer>
    </div>
  );
}
