const steps = [
  {
    step: '1',
    title: 'Upload',
    description: 'Drag and drop your image or click to browse. Supports PNG, JPG, WebP, and more.',
  },
  {
    step: '2',
    title: 'Remove Background',
    description: 'Our AI model analyzes your image and removes the background in seconds.',
  },
  {
    step: '3',
    title: 'Download',
    description: 'Pick a background color or keep it transparent, then download your PNG.',
  },
];

export default function BackgroundRemoverHowItWorks() {
  return (
    <section className="py-16 px-4 bg-secondary/50">
      <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        {steps.map((item) => (
          <div key={item.step} className="flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
              {item.step}
            </div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
