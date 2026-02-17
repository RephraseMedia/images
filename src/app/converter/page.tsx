'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConverterForm from '@/components/converter/ConverterForm';
import ConverterHowItWorks from '@/components/converter/ConverterHowItWorks';
import ConverterFeatures from '@/components/converter/ConverterFeatures';
import ConverterUseCases from '@/components/converter/ConverterUseCases';
import ConverterTips from '@/components/converter/ConverterTips';
import ConverterFAQ from '@/components/converter/ConverterFAQ';

export default function ConverterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Image Converter
            </h1>
            <p className="mt-3 text-muted text-lg">
              Convert images between JPG, PNG, and WebP instantly. All processing happens in your browser — nothing is uploaded.
            </p>
          </div>
          <ConverterForm />
        </section>
        <ConverterHowItWorks />
        <ConverterFeatures />
        <ConverterUseCases />
        <ConverterTips />
        <ConverterFAQ />
      </main>
      <Footer />
    </div>
  );
}
