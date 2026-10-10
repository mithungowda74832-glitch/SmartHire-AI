import React, { useState, useMemo } from 'react';
import {
  Search,
  Code2,
  Server,
  Layers,
  Terminal,
  Brain,
  BarChart3,
  Palette,
  Briefcase,
  Megaphone,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { JOB_ROLE_PRESETS, JobRolePreset } from '../../data/jobPresets';

interface JobRoleSelectorProps {
  currentText: string;
  selectedRoleTitle: string | null;
  onApplyPreset: (preset: JobRolePreset) => void;
  onClear: () => void;
  disabled?: boolean;
}

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'frontend-developer': Code2,
  'backend-developer': Server,
  'full-stack-developer': Layers,
  'software-engineer': Terminal,
  'python-developer': Terminal,
  'ai-ml-engineer': Brain,
  'data-analyst': BarChart3,
  'ui-ux-designer': Palette,
  'product-manager': Briefcase,
  'digital-marketing-specialist': Megaphone,
};

export const JobRoleSelector: React.FC<JobRoleSelectorProps> = ({
  currentText,
  selectedRoleTitle,
  onApplyPreset,
  onClear,
  disabled = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pendingPreset, setPendingPreset] = useState<JobRolePreset | null>(null);

  // Available categories
  const categories = useMemo(() => {
    const cats = ['All'];
    JOB_ROLE_PRESETS.forEach((p) => {
      if (!cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, []);

  // Filtered presets based on search query and category
  const filteredPresets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return JOB_ROLE_PRESETS.filter((preset) => {
      const matchesCategory =
        selectedCategory === 'All' || preset.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const titleMatch = preset.title.toLowerCase().includes(q);
      const summaryMatch = preset.shortSummary.toLowerCase().includes(q);
      const categoryMatch = preset.category.toLowerCase().includes(q);
      const skillsMatch = preset.keySkills.some((s) => s.toLowerCase().includes(q));

      return titleMatch || summaryMatch || categoryMatch || skillsMatch;
    });
  }, [searchQuery, selectedCategory]);

  // Check if current text has custom edits compared to the currently loaded preset
  const isCustomEdited = useMemo(() => {
    if (!currentText.trim()) return false;
    if (!selectedRoleTitle) return true; // custom text without any preset
    const activePreset = JOB_ROLE_PRESETS.find((p) => p.title === selectedRoleTitle);
    if (!activePreset) return true;
    return currentText.trim() !== activePreset.sampleDescription.trim();
  }, [currentText, selectedRoleTitle]);

  const handleRoleCardClick = (preset: JobRolePreset) => {
    if (disabled) return;

    // If it's already the selected preset and not edited, do nothing
    if (selectedRoleTitle === preset.title && !isCustomEdited) {
      return;
    }

    // If there is existing text and it's custom or was modified, confirm replacement
    if (currentText.trim().length > 20 && isCustomEdited) {
      setPendingPreset(preset);
      return;
    }

    // Otherwise apply directly with zero extra clicks
    onApplyPreset(preset);
  };

  const handleConfirmReplace = () => {
    if (pendingPreset) {
      onApplyPreset(pendingPreset);
      setPendingPreset(null);
    }
  };

  const handleCancelReplace = () => {
    setPendingPreset(null);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Choose a Job Role</span>
            </h3>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
              Sample Templates
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a role to populate a sample description, paste a custom vacancy, or skip for general evaluation.
          </p>
        </div>

        {/* Status indicator: active role or custom */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedRoleTitle ? (
            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Active: {selectedRoleTitle}</span>
              {isCustomEdited && (
                <span className="text-[10px] uppercase font-mono px-1 rounded bg-cyan-200/60 dark:bg-cyan-800/60 text-cyan-900 dark:text-cyan-100">
                  Edited
                </span>
              )}
            </div>
          ) : currentText.trim().length > 0 ? (
            <div className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Custom Job Description</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs px-2 py-1 text-slate-400 font-mono">
              <span>(No Role Selected)</span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Overwrite Confirmation Banner */}
      {pendingPreset && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-amber-900 dark:text-amber-200 block">
                Replace existing description with {pendingPreset.title}?
              </span>
              <span className="text-amber-700 dark:text-amber-300/90">
                You have custom edits in the text area. Loading this template will overwrite them.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleCancelReplace}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850 cursor-pointer"
            >
              Keep My Edits
            </button>
            <button
              type="button"
              onClick={handleConfirmReplace}
              className="px-3 py-1 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-xs cursor-pointer"
            >
              Replace with {pendingPreset.title}
            </button>
          </div>
        </div>
      )}

      {/* Search Input & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            placeholder="Search roles or skills (e.g. Python, Frontend, Product, SQL)..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pill Selectors */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              disabled={disabled}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Role Grid */}
      {filteredPresets.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No preset roles found matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
          >
            Reset search filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {filteredPresets.map((preset) => {
            const Icon = ROLE_ICONS[preset.id] || Briefcase;
            const isSelected = selectedRoleTitle === preset.title;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleRoleCardClick(preset)}
                disabled={disabled}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-50/80 dark:bg-[#0b1b36] border-cyan-400/80 dark:border-cyan-500/70 shadow-sm ring-1 ring-cyan-500/40 text-slate-900 dark:text-slate-100'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800/90 text-slate-700 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-800 hover:bg-slate-50/80 dark:hover:bg-slate-850/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-cyan-500 group-hover:bg-cyan-500/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100/80 dark:bg-cyan-950/80 px-1.5 py-0.5 rounded">
                        <Check className="w-2.5 h-2.5" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {preset.category}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.shortSummary}
                  </p>
                </div>

                {/* Skill tags */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1">
                  {preset.keySkills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                  {preset.keySkills.length > 2 && (
                    <span className="text-[10px] px-1 py-0.5 text-slate-400 font-mono">
                      +{preset.keySkills.length - 2}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Preset Footer Actions & Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Click any role above to instantly load its editable benchmark description.</span>
        </div>

        {selectedRoleTitle && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Preset Selection</span>
          </button>
        )}
      </div>
    </div>
  );
};
