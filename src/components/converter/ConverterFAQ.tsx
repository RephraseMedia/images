'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is an image converter?',
    answer: 'An image converter changes images from one file format to another — for example, from PNG to JPG or from JPG to WebP. This tool runs entirely in your browser using the Canvas API.',
  },
  {
    question: 'What formats can I convert from?',
    answer: 'You can convert from any image format your browser supports, including JPG, PNG, WebP, GIF, BMP, and SVG.',
  },
  {
    question: 'What formats can I convert to?',
    answer: 'You can convert to three formats: JPG (best for photos), PNG (best for graphics and transparency), and WebP (best for web — smaller file sizes with great quality).',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. All conversions happen entirely in your browser. Your images are never uploaded to any server. Nothing leaves your device.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'There is no hard file size limit. However, very large images may take longer to process depending on your device. You can upload up to 20 files at a time.',
  },
  {
    question: 'Can I convert multiple images at once?',
    answer: 'Yes. You can upload up to 20 images and convert them all at once with a single click. Each file is processed sequentially in your browser.',
  },
  {
    question: 'What does the quality slider do?',
    answer: 'The quality slider (available for JPG and WebP) controls the compression level. Higher quality means larger files with more detail; lower quality means smaller files with some loss of detail. The default is 85%, which is a good balance.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, the image converter is completely free. There are no sign-ups, no limits, and no watermarks on your converted images.',
  },
];

export default function ConverterFAQ() {
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
