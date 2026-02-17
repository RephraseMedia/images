'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundRemoverForm from '@/components/background-remover/BackgroundRemoverForm';
import BackgroundRemoverHowItWorks from '@/components/background-remover/BackgroundRemoverHowItWorks';
import BackgroundRemoverFeatures from '@/components/background-remover/BackgroundRemoverFeatures';
import BackgroundRemoverUseCases from '@/components/background-remover/BackgroundRemoverUseCases';
import BackgroundRemoverTips from '@/components/background-remover/BackgroundRemoverTips';
import BackgroundRemoverFAQ from '@/components/background-remover/BackgroundRemoverFAQ';

export default function BackgroundRemoverPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              AI Background Remover
            </h1>
            <p className="mt-3 text-muted text-lg">
              Remove backgrounds from any image instantly with AI. Download with a transparent, white, black, or custom color background.
            </p>
          </div>
          <BackgroundRemoverForm />
        </section>
        <BackgroundRemoverHowItWorks />
        <BackgroundRemoverFeatures />
        <BackgroundRemoverUseCases />
        <BackgroundRemoverTips />
        <BackgroundRemoverFAQ />
      </main>
      <Footer />
    </div>
  );
}
