'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is an AI image generator?',
    answer: 'An AI image generator uses machine learning models to create images from text descriptions. You type a prompt describing what you want, and the AI produces original images matching your description.',
  },
  {
    question: 'How does the AI image generator work?',
    answer: 'Enter a text prompt, choose an artistic style and aspect ratio, then click generate. The AI interprets your description and creates unique images based on patterns learned from millions of images during training.',
  },
  {
    question: 'What styles are available?',
    answer: 'There are 10 artistic styles to choose from, including photorealistic, anime, pixel art, oil painting, watercolor, digital art, comic book, fantasy art, line art, and cinematic.',
  },
  {
    question: 'What aspect ratios can I use?',
    answer: 'Five aspect ratios are available: 1:1 (square), 16:9 (landscape), 9:16 (portrait), 4:3 (standard), and 3:4 (tall). Choose the one that best fits your intended platform or use case.',
  },
  {
    question: 'How many images can I generate at once?',
    answer: 'You can generate up to 4 images at once from a single prompt. Each image will be a unique interpretation of your description.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, the AI image generator is completely free to use. No sign-up or account is required. Your images are generated on demand and are never stored on our servers.',
  },
  {
    question: 'Can I edit the generated images?',
    answer: 'Yes. After generating an image, you can send it directly to the editor where you can use AI-powered tools like enhance, remove background, generative fill, and more.',
  },
  {
    question: 'What resolution are the generated images?',
    answer: 'Generated images can be up to 1344 pixels on the longest side, depending on the aspect ratio you choose. This resolution is suitable for both digital use and many print applications.',
  },
];

export default function GeneratorFAQ() {
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
