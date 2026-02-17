'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is the AI Presentation Maker?',
    answer: 'The AI Presentation Maker is a tool that uses artificial intelligence to generate professional presentation slides from a simple topic description. It creates structured content with titles, bullet points, and speaker notes.',
  },
  {
    question: 'How does it work?',
    answer: 'Enter your presentation topic, choose a template style and slide count, then click generate. The AI analyzes your topic and creates a complete slide deck with logical flow, key points, and speaker notes.',
  },
  {
    question: 'What styles are available?',
    answer: 'There are 5 template styles: Professional (clean, corporate), Creative (vibrant, artistic), Minimal (simple, elegant), Bold (high contrast, strong), and Academic (structured, formal).',
  },
  {
    question: 'Can I download as PowerPoint (PPTX)?',
    answer: 'Yes, you can download your presentation as a .pptx file that opens in Microsoft PowerPoint, Google Slides, and other presentation software.',
  },
  {
    question: 'Can I download as PDF?',
    answer: 'Yes, you can download your presentation as a PDF file, perfect for sharing, printing, or presenting from any device.',
  },
  {
    question: 'How many slides can I generate?',
    answer: 'You can generate between 5 and 15 slides per presentation. Choose fewer slides for concise talks or more for detailed presentations.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, the AI Presentation Maker is completely free to use. No sign-up or account is required. Your presentations are generated on demand and never stored on our servers.',
  },
  {
    question: 'Can I edit the slides after downloading?',
    answer: 'Yes. PPTX files can be fully edited in PowerPoint, Google Slides, or Keynote. You can modify text, add images, change formatting, and customize the design to your needs.',
  },
];

export default function PresentationMakerFAQ() {
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
