const tips = [
  {
    title: 'Use high-resolution images',
    description: 'Higher resolution images give the AI more detail to work with, producing cleaner edges and better results.',
  },
  {
    title: 'Ensure clear contrast',
    description: 'Images where the subject clearly stands out from the background tend to produce the best results.',
  },
  {
    title: 'Choose PNG for quality',
    description: 'PNG format preserves transparency and maintains sharp edges without compression artifacts.',
  },
  {
    title: 'Start with simple backgrounds',
    description: 'Solid or blurred backgrounds are easier for AI to remove cleanly compared to complex, busy scenes.',
  },
  {
    title: 'Check the edges',
    description: 'After removal, zoom in to check edges around hair, fur, or fine details for the best result.',
  },
];

export default function BackgroundRemoverTips() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Tips for Best Results</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {tips.map((tip, index) => (
          <div key={tip.title} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div>
              <h3 className="font-semibold mb-1">{tip.title}</h3>
              <p className="text-sm text-muted">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
