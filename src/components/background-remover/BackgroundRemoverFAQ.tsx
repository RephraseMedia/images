'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is a background remover?',
    answer: 'A background remover is a tool that uses AI to automatically detect and remove the background from an image, leaving only the main subject with a transparent background.',
  },
  {
    question: 'How does it work?',
    answer: 'Our tool uses an advanced AI model (RemBG) that analyzes your image to identify the foreground subject and separate it from the background. The entire process takes just a few seconds.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'You can upload any common image format including PNG, JPG, JPEG, WebP, BMP, and GIF. The output is always a high-quality PNG file to preserve transparency.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, the background remover is completely free to use. There are no sign-ups required and no watermarks on your output images.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'The tool accepts images up to 10MB in size. For best results, use images that are at least 500x500 pixels.',
  },
  {
    question: 'How does it handle complex edges?',
    answer: 'The AI model is trained to handle complex edges including hair, fur, and semi-transparent objects. While results are generally excellent, very fine details may occasionally need manual touch-up.',
  },
  {
    question: 'Can I replace the background color?',
    answer: 'Yes! After removing the background, you can choose transparent, white, black, or any custom color using the built-in color picker before downloading.',
  },
  {
    question: 'What format is the output?',
    answer: 'The output is always a PNG file. PNG is used because it supports transparency, which is essential when the background is removed. If you choose a solid background color, the PNG will include that color.',
  },
];

export default function BackgroundRemoverFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-secondary/50">
      <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-2">
        {faqs.map((faq, index) => (
          <div key={faq.question} className="border border-border rounded-xl">
            <button
              className="w-full text-left p-4 flex items-center justify-between gap-4 font-medium"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              {faq.question}
              <svg
                className={`w-5 h-5 shrink-0 text-muted transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-muted">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
