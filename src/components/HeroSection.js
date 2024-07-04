import { useEffect, useState } from 'react';

const HeroSection = () => {
  const startDate = new Date('2024-07-03');
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const vol = diffDays;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <section className="hero flex flex-col justify-center items-center w-full dark:text-gray-200">
      <section className="logo mobile-visible flex items-center justify-center text-center mt-2 text-5xl font-serif">
        <h1 className="theDailyByte font-bold dark:text-zinc-300">The Daily Byte</h1>
      </section>

      <section className="dateBar flex justify-between items-center w-full py-1 border-t border-b border-black dark:border-zinc-600 mt-2 mb-5">
        <h5 className="vol text-left flex-1 dark:text-zinc-400">Vol. {vol}</h5>
        <h5 className="date text-center flex-4 dark:text-zinc-400">{formattedDate}</h5>
        <h5 className="price text-right flex-1 dark:text-zinc-400">$0.00</h5>
      </section>
    </section>
  );
};

export default HeroSection;
