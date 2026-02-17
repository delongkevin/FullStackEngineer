export const metadata = {
  title: 'Blackjack Game | Kevin Delong Portfolio',
  description: 'Interactive Blackjack card game demo',
};

export default function BlackjackPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Blackjack Game</h1>
      <p className="text-gray-600 mb-4">Interactive card game showcasing UI, state management, and animations.</p>
      <div className="rounded-lg border bg-black/5">
        <iframe
          src="/projects/blackjack/index.html"
          title="Blackjack Game Demo"
          className="w-full h-[800px] rounded-lg"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>
    </main>
  );
}
