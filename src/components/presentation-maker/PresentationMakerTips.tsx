const tips = [
  {
    title: 'Be specific about your topic',
    description: 'Instead of "Marketing", try "Q4 Digital Marketing Strategy for E-commerce Startups".',
  },
  {
    title: 'Mention your audience',
    description: 'Add context like "for investors" or "for college students" to tailor the content.',
  },
  {
    title: 'List key points to cover',
    description: 'Include specific subtopics or data points you want the presentation to address.',
  },
  {
    title: 'Choose the right style',
    description: 'Use Professional for business, Academic for research, Creative for pitches, and Minimal for clean talks.',
  },
  {
    title: 'Adjust slide count to fit your needs',
    description: 'Use fewer slides (5-7) for quick talks and more (12-15) for detailed presentations.',
  },
];

export default function PresentationMakerTips() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Tips for Better Presentations</h2>
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
