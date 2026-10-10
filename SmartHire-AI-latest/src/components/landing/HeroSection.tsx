import React, { useState } from 'react';
import { Button } from '../ui/Button';
import {
  UploadCloud,
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Target,
} from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onHowItWorksClick?: () => void;
  onTryDemoClick?: () => void;
}

type NodeCategory = 'skills' | 'experience' | 'achievements' | 'fit';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeClick,
  onHowItWorksClick,
  onTryDemoClick,
}) => {
  const [selectedNode, setSelectedNode] = useState<NodeCategory>('skills');

  interface NodeInfo {
    id: NodeCategory;
    label: string;
    layerLabel: string;
    title: string;
    badge: string;
    description: string;
    highlights: string[];
    icon: React.ComponentType<{ className?: string }>;
  }

  const nodesMap: Record<NodeCategory, NodeInfo> = {
    skills: {
      id: 'skills',
      label: 'Skills',
      layerLabel: 'SKILLS OVERVIEW',
      title: 'Your Skills & Strengths',
      badge: 'AI-Powered Insights',
      description:
        'Identifies your technical competencies, tools, and platforms, highlighting your core strengths and areas of expertise.',
      highlights: ['Skill Recognition', 'Related Skills', 'Industry Expertise'],
      icon: Cpu,
    },
    experience: {
      id: 'experience',
      label: 'Experience',
      layerLabel: 'CAREER PROGRESSION',
      title: 'Work History & Growth',
      badge: 'Timeline Analysis',
      description:
        'Evaluates your roles, career advancement, leadership scope, and practical ownership across positions.',
      highlights: ['Career Growth', 'Leadership Scope', 'Role Relevance'],
      icon: Layers,
    },
    achievements: {
      id: 'achievements',
      label: 'Achievements',
      layerLabel: 'MEASURABLE IMPACT',
      title: 'Quantified Results & Wins',
      badge: 'Impact Assessment',
      description:
        'Surfaces measurable outcomes, business metrics, and high-impact accomplishments that catch a recruiter’s eye.',
      highlights: ['Quantified Outcomes', 'Action-Driven Wins', 'Scope & Delivery'],
      icon: Zap,
    },
    fit: {
      id: 'fit',
      label: 'Career Fit',
      layerLabel: 'ROLE COMPATIBILITY',
      title: 'Target Role Alignment',
      badge: 'Fit Benchmarking',
      description:
        'Compares your unique background against target role benchmarks to reveal clear steps that increase your competitiveness.',
      highlights: ['Requirement Match', 'Role Readiness', 'Actionable Steps'],
      icon: Target,
    },
  };

  const activeNode = nodesMap[selectedNode];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Headline, Description, and CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-cyan-300 backdrop-blur-xs shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>AI-POWERED CAREER INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1] text-balance">
              Your experience has a signal. Let&apos;s find it.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Transform your resume into actionable career insights. Discover your strengths, improve your ATS readiness, identify opportunities for growth, and prepare for your next interview.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={onAnalyzeClick}
                className="bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold px-6 shadow-md shadow-cyan-500/20 border-cyan-500 transition-all cursor-pointer"
                icon={<UploadCloud className="w-4 h-4" />}
              >
                Analyze My Resume →
              </Button>

              {onTryDemoClick && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onTryDemoClick}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs hover:bg-slate-100 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-300/80 dark:border-slate-700/80 px-5 transition-all cursor-pointer"
                  icon={<Play className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500/20" />}
                >
                  Explore a Sample
                </Button>
              )}
            </div>

            {/* Assurance footer */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Account Requirement</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>Private In-Memory Processing</span>
              </div>
              {onHowItWorksClick && (
                <button
                  type="button"
                  onClick={onHowItWorksClick}
                  className="hover:text-slate-900 dark:hover:text-slate-200 underline underline-offset-4 cursor-pointer"
                >
                  See how it works →
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Career Profile Insights Engine */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-[#091124] dark:bg-[#060c1c] border border-cyan-900/40 dark:border-cyan-900/50 p-6 sm:p-7 shadow-2xl shadow-cyan-950/25 text-slate-100 backdrop-blur-md overflow-hidden transition-all duration-300">
              {/* Subtle ambient cyan glow */}
              <div
                aria-hidden="true"
                className="absolute -top-20 -right-20 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
              />

              {/* Header Bar */}
              <div className="relative flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  </span>
                  <span className="text-xs font-mono font-semibold tracking-wider text-slate-200 uppercase">
                    YOUR CAREER PROFILE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>AI-Powered Analysis</span>
                </div>
              </div>

              {/* 4 Interactive Options */}
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5">
                {(
                  [
                    { id: 'skills' as NodeCategory, label: 'Skills', icon: Cpu },
                    { id: 'experience' as NodeCategory, label: 'Experience', icon: Layers },
                    { id: 'achievements' as NodeCategory, label: 'Achievements', icon: Zap },
                    { id: 'fit' as NodeCategory, label: 'Career Fit', icon: Target },
                  ]
                ).map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedNode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedNode(item.id)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e223d] border-cyan-400/70 text-cyan-200 shadow-[0_0_16px_rgba(6,182,212,0.22)] ring-1 ring-cyan-400/40'
                          : 'bg-[#09142b]/90 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-cyan-700/50 hover:bg-[#0d1d3d]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isSelected
                            ? 'text-cyan-400 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                            : 'text-slate-400 group-hover:text-cyan-400'
                        }`}
                      />
                      <span className="text-xs font-semibold tracking-wide">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Conceptual Layer Detail Display */}
              <div className="relative p-5 rounded-xl bg-[#0b1633]/90 border border-cyan-950/80 space-y-3.5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400/90 font-medium">
                      {activeNode.layerLabel}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight mt-0.5">
                      {activeNode.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{activeNode.badge}</span>
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {activeNode.description}
                </p>

                {/* 3 Information Chips */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {activeNode.highlights.map((hl) => (
                    <span
                      key={hl}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-[#070e22] border border-cyan-900/50 hover:border-cyan-500/40 text-slate-200 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Guidance */}
              <div className="relative mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  <span className="text-slate-300 font-medium">Insights based on your resume</span>
                </div>
                <button
                  type="button"
                  onClick={onAnalyzeClick}
                  className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer transition-colors group"
                >
                  <span>Analyze My Resume →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
