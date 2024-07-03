import { useEffect, useState } from 'react';

const HeroSection = ({ vol }) => {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <section className="hero flex flex-col justify-center items-center w-full">
      <section className="logo mobile-visible flex items-center justify-center text-center mt-2 text-5xl font-serif">
        <h1 className="theDailyByte font-bold">The Daily Byte</h1>
      </section>

      <section className="dateBar flex justify-between items-center w-full py-1 border-t border-b border-black mt-2 mb-5">
        <h5 className="vol text-left flex-1">Vol. {vol}</h5>
        <h5 className="date text-center flex-4">{formattedDate}</h5>
        <h5 className="price text-right flex-1">$0.00</h5>
      </section>
    </section>
  );
};

export default HeroSection;
