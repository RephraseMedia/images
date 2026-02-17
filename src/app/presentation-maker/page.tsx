'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PresentationMakerForm from '@/components/presentation-maker/PresentationMakerForm';
import PresentationMakerHowItWorks from '@/components/presentation-maker/PresentationMakerHowItWorks';
import PresentationMakerFeatures from '@/components/presentation-maker/PresentationMakerFeatures';
import PresentationMakerUseCases from '@/components/presentation-maker/PresentationMakerUseCases';
import PresentationMakerTips from '@/components/presentation-maker/PresentationMakerTips';
import PresentationMakerFAQ from '@/components/presentation-maker/PresentationMakerFAQ';

export default function PresentationMakerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              AI Presentation Maker
            </h1>
            <p className="mt-3 text-muted text-lg">
              Describe your topic and AI will create a complete presentation with structured slides, speaker notes, and professional styling. Download as PPTX or PDF.
            </p>
          </div>
          <PresentationMakerForm />
        </section>
        <PresentationMakerHowItWorks />
        <PresentationMakerFeatures />
        <PresentationMakerUseCases />
        <PresentationMakerTips />
        <PresentationMakerFAQ />
      </main>
      <Footer />
    </div>
  );
}
