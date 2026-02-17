import Link from 'next/link';

interface HeaderProps {
  showEditor?: boolean;
  onNewImage?: () => void;
  children?: React.ReactNode;
}

export default function Header({ showEditor, onNewImage, children }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-4 bg-background/95 backdrop-blur-sm z-30">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
        <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span>AI Image Editor</span>
      </Link>

      <nav className="hidden sm:flex items-center gap-1 ml-4">
        <Link
          href="/"
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-secondary transition-colors"
        >
          Editor
        </Link>
        <Link
          href="/generator"
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-secondary transition-colors"
        >
          Generator
        </Link>
        <Link
          href="/converter"
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-secondary transition-colors"
        >
          Converter
        </Link>
      </nav>

      {showEditor && onNewImage && (
        <button
          onClick={onNewImage}
          className="ml-4 px-3 py-1.5 text-sm bg-secondary hover:bg-border rounded-lg transition-colors"
        >
          New Image
        </button>
      )}

      <div className="flex-1" />
      {children}
    </header>
  );
}
