const steps = [
  {
    step: '1',
    title: 'Describe',
    description: 'Type a detailed text prompt describing the image you want to create.',
  },
  {
    step: '2',
    title: 'Customize',
    description: 'Pick an artistic style and aspect ratio to match your vision.',
  },
  {
    step: '3',
    title: 'Generate',
    description: 'Click generate, then download your images or send them to the editor.',
  },
];

export default function GeneratorHowItWorks() {
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
