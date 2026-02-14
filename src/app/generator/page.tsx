'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GeneratorForm from '@/components/generator/GeneratorForm';
import GeneratorHowItWorks from '@/components/generator/GeneratorHowItWorks';
import GeneratorFeatures from '@/components/generator/GeneratorFeatures';
import GeneratorUseCases from '@/components/generator/GeneratorUseCases';
import GeneratorTips from '@/components/generator/GeneratorTips';
import GeneratorFAQ from '@/components/generator/GeneratorFAQ';

export default function GeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              AI Image Generator
            </h1>
            <p className="mt-3 text-muted text-lg">
              Describe what you want to see and AI will create it for you. Choose a style, aspect ratio, and generate up to 4 images at once.
            </p>
          </div>
          <GeneratorForm />
        </section>
        <GeneratorHowItWorks />
        <GeneratorFeatures />
        <GeneratorUseCases />
        <GeneratorTips />
        <GeneratorFAQ />
      </main>
      <Footer />
    </div>
  );
}
