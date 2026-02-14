const tips = [
  {
    title: 'Be specific and descriptive',
    description: 'Mention colors, lighting, composition, and perspective for better results.',
  },
  {
    title: 'Add style keywords',
    description: 'Use terms like cinematic, neon, watercolor, photorealistic, or minimalist.',
  },
  {
    title: 'Match aspect ratios to your platform',
    description: '16:9 for YouTube, 9:16 for Stories, 1:1 for Instagram.',
  },
  {
    title: 'Describe what you don\'t want',
    description: 'Avoid unwanted details by specifying what to exclude from the image.',
  },
  {
    title: 'Think like a photographer',
    description: 'Consider angles, mood, time of day, and depth of field.',
  },
];

export default function GeneratorTips() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Prompt Writing Tips</h2>
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
