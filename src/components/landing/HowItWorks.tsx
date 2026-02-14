const steps = [
  {
    step: '1',
    title: 'Upload',
    description: 'Drag and drop or browse to upload your image. We support JPEG, PNG, WebP, and HEIC.',
  },
  {
    step: '2',
    title: 'Edit',
    description: 'Choose from AI-powered tools: enhance, remove backgrounds, fill, replace, or remove objects.',
  },
  {
    step: '3',
    title: 'Download',
    description: 'Export your edited image in PNG or JPG at your preferred quality and resolution.',
  },
];

export default function HowItWorks() {
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
