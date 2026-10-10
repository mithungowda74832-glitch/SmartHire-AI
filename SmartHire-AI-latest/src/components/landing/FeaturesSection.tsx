import React from 'react';
import { Award, Cpu, Sparkles, Check } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'AI Resume Scoring',
      kicker: '0–100 Standardized Rubric',
      description:
        'Comprehensive multi-dimensional evaluation measuring action verb frequency, quantified outcome metrics, structural brevity, and automated screening compliance.',
      points: [
        'Objective multi-factor scoring rubric',
        'Active vs. passive voice detection',
        'ATS formatting & parsing validation',
      ],
    },
    {
      icon: Cpu,
      title: 'Skill & Keyword Matching',
      kicker: 'Ontological Skill Taxonomy',
      description:
        'Automatically identifies hard competencies, frameworks, developer tooling, and domain skills. Benchmarks directly against target job requirements to reveal coverage gaps.',
      points: [
        'Technical & leadership skill extraction',
        'Job description keyword cross-reference',
        'Direct coverage percentage breakdown',
      ],
    },
    {
      icon: Sparkles,
      title: 'Actionable Sentence Rewrites',
      kicker: 'Targeted Feedback Engine',
      description:
        'Prioritizes highest-leverage revisions to transform passive bullet points into impactful achievement statements featuring verifiable results and metrics.',
      points: [
        'Line-by-line bullet rewrite examples',
        'Quantifiable impact metric guidance',
        'Context-aware keyword placement',
      ],
    },
  ];

  return (
    <section id="features" className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            <span>Core Analytical Capabilities</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">Engineered for Precision</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Objective evaluation standards. Zero generic platitudes.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Every score, skill extraction, and recommendation is grounded in real candidate text and modern hiring rubrics.
          </p>
        </div>

        {/* Features 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-7 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200/60 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
                      {feat.kicker}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                  {feat.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
