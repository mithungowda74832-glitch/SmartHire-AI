import React from 'react';
import { UploadCloud, Target, FileCheck } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      index: '01',
      title: 'Upload Your Resume',
      subtitle: 'Instant In-Memory Parsing',
      description:
        'Select your PDF, DOCX, or plain text document up to 10 MB. SmartHire extracts sections, chronological experience, and candidate details in browser memory without requiring an account or email.',
      icon: <UploadCloud className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      index: '02',
      title: 'Target Role Alignment',
      subtitle: 'Optional Job Description Benchmark',
      description:
        'Optionally supply the text of a job description you are targeting. The system cross-references required skills against your background to reveal matching prerequisites and critical keyword omissions.',
      icon: <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      index: '03',
      title: 'Receive Evidence-Based Report',
      subtitle: 'Scores, Taxonomies & Rewrites',
      description:
        'Access a comprehensive assessment: overall score, rubric breakdowns, detected technical keywords, identified profile strengths, and line-by-line bullet rewrites ready to export as HTML/PDF, Markdown, or JSON.',
      icon: <FileCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-xs scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            <span>The Evaluation Process</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal normal-case">Streamlined & Transparent</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Three disciplined steps from raw document to recruiter-ready resume.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Engineered for developers, designers, and specialists who want actionable clarity without paywalls, friction, or forced onboarding.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.index}
              className="p-7 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-600">
                    {step.index}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                    {step.subtitle}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
                <span>Phase {step.index} Verification</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
