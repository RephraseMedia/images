const tips = [
  {
    title: 'Use WebP for the web',
    description: 'WebP files are up to 30% smaller than JPG with similar quality, making pages load faster.',
  },
  {
    title: 'Choose PNG for transparency',
    description: 'PNG is the only format here that preserves transparency. Use it for logos, icons, and overlays.',
  },
  {
    title: 'Adjust quality to balance size',
    description: 'For JPG and WebP, lowering quality to 75-80% gives a good tradeoff between file size and visual quality.',
  },
  {
    title: 'Use JPG for photographs',
    description: 'JPG handles photographic content well and is universally supported across all devices and platforms.',
  },
  {
    title: 'Batch convert to save time',
    description: 'Upload up to 20 files at once and convert them all in a single click instead of one by one.',
  },
];

export default function ConverterTips() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-10">Image Conversion Tips</h2>
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
