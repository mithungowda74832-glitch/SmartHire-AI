import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { Sparkles, Download, Check, Menu, X, ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

interface SiteHeaderProps {
  onStartAnalysis: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onTrySampleReport?: () => void;
  activeView?: 'landing' | 'analyzer' | 'report';
  connectivity?: {
    mode: 'online' | 'offline';
    statusLabel: string;
    statusDetail: string;
    isBackendReachable: boolean;
  };
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onStartAnalysis,
  onNavigateSection,
  onTrySampleReport,
  activeView,
  connectivity,
}) => {
  const { isInstallable, isInstalled, triggerInstall } = usePwaInstall();
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await triggerInstall();
      if (!installed) {
        setShowInstallHelp(true);
      }
    } else {
      setShowInstallHelp(true);
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection('top');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLaunchAnalyzerClick = () => {
    setIsMobileMenuOpen(false);
    onStartAnalysis();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark brand element */}
        <a
          href="#top"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-slate-900 dark:text-slate-50 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-cyan-500 rounded-md"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-600 dark:bg-cyan-500 flex items-center justify-center text-white dark:text-slate-950 shadow-xs group-hover:bg-cyan-700 dark:group-hover:bg-cyan-400 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold">SmartHire AI</span>
        </a>

        {/* Zone 2: Top Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-600 dark:text-slate-400"
          aria-label="Main Navigation"
        >
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, 'how-it-works')}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-500 rounded px-1"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-500 rounded px-1"
          >
            Features
          </a>
          <a
            href="#document-privacy"
            onClick={(e) => handleNavClick(e, 'document-privacy')}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-500 rounded px-1"
          >
            Document Privacy
          </a>
          <a
            href="#analyzer"
            onClick={(e) => handleNavClick(e, 'analyzer')}
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-500 rounded px-1"
          >
            Launch Analyzer
          </a>
          {onTrySampleReport && (
            <button
              type="button"
              onClick={onTrySampleReport}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer text-slate-500 dark:text-slate-400 text-xs font-mono ml-1"
            >
              Demo Sample
            </button>
          )}
        </nav>

        {/* Zone 3: Install + Theme Toggle + Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {!isInstalled ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleInstallClick}
              icon={<Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
              className="hidden lg:inline-flex text-xs text-slate-600 dark:text-slate-300"
              title="Install SmartHire AI as a standalone application"
            >
              Install App
            </Button>
          ) : (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Installed</span>
            </span>
          )}

          {/* Connectivity Status Badge */}
          {connectivity && (
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-colors ${
                connectivity.mode === 'online'
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
              }`}
              title={connectivity.statusDetail}
            >
              {connectivity.mode === 'online' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{connectivity.statusLabel}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span>Offline Mode</span>
                </>
              )}
            </div>
          )}

          <ThemeToggle />

          <Button
            size="sm"
            onClick={handleLaunchAnalyzerClick}
            className="whitespace-nowrap shrink-0 shadow-xs font-medium bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 border-cyan-500 cursor-pointer"
          >
            {activeView === 'report' ? 'New Analysis' : 'Launch Analyzer'}
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2.5 text-sm font-medium" aria-label="Mobile Navigation">
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="py-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between"
            >
              <span>How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="py-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between"
            >
              <span>Features</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="#document-privacy"
              onClick={(e) => handleNavClick(e, 'document-privacy')}
              className="py-1.5 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between"
            >
              <span>Document Privacy</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="#analyzer"
              onClick={(e) => handleNavClick(e, 'analyzer')}
              className="py-1.5 text-cyan-600 dark:text-cyan-400 font-semibold transition-colors flex items-center justify-between"
            >
              <span>Launch Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
            </a>
            {onTrySampleReport && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onTrySampleReport();
                }}
                className="py-1.5 text-left text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-mono transition-colors"
              >
                Sample Demo Report
              </button>
            )}

            {connectivity && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>System Mode</span>
                <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                  connectivity.mode === 'online'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {connectivity.mode === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            )}
          </nav>

          {!isInstalled && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleInstallClick();
                }}
                icon={<Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
                className="w-full justify-start text-xs text-slate-600 dark:text-slate-300"
              >
                Install SmartHire AI App
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Guidance modal for browsers requiring browser-menu PWA install */}
      {showInstallHelp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowInstallHelp(false)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Install SmartHire AI</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallHelp(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-semibold p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SmartHire AI is fully configured as a Progressive Web App for instant desktop and mobile launch.
            </p>

            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside">
              <li>
                <strong>Chrome / Edge:</strong> Click the install icon <span className="font-mono">⊕</span> in the address bar or select <em>Install SmartHire AI</em> from the browser menu.
              </li>
              <li>
                <strong>Safari:</strong> Tap <em>Share</em> and select <em>Add to Home Screen</em>.
              </li>
            </ul>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setShowInstallHelp(false)}>
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
