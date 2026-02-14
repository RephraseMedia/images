import UploadArea from '@/components/upload/UploadArea';

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-16 px-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
        Edit Your Images with{' '}
        <span className="text-primary">AI Power</span>
      </h1>
      <p className="mt-4 text-lg text-muted max-w-2xl">
        Enhance, remove backgrounds, fill in details, and more — all powered by
        advanced AI models. No sign-up required.
      </p>
      <div className="mt-10 w-full max-w-xl">
        <UploadArea />
      </div>
    </section>
  );
}
