import React from 'react';

export const metadata = {
  title: "Texas Hold'em Poker | Kevin Delong Portfolio",
  description: "Texas Hold'em poker demo",
};

export default function PokerPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Texas Hold'em Poker</h1>
      <p className="text-gray-600 mb-4">Demonstrates complex UI, game logic, and responsiveness.</p>
      <div className="rounded-lg border bg-black/5">
        <iframe
          src="/projects/PokerApp/PokerApp.html"
          title="Poker App Demo"
          className="w-full h-[800px] rounded-lg"
        />
      </div>
    </main>
  );
}
