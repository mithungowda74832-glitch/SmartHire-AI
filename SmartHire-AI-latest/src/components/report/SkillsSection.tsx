import React from 'react';
import { Card } from '../ui/Card';
import { CategorizedSkills } from '../../types/resume';
import { Code2, Wrench, Users2 } from 'lucide-react';

interface SkillsSectionProps {
  skills: CategorizedSkills;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const groups = [
    {
      title: 'Technical & Systems Competencies',
      icon: <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      items: skills.technical,
    },
    {
      title: 'Tools, Frameworks & Cloud',
      icon: <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      items: skills.toolsAndFrameworks,
    },
    {
      title: 'Leadership & Domain Strengths',
      icon: <Users2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      items: skills.leadershipAndSoft,
    },
  ];

  const totalSkillsCount =
    skills.technical.length + skills.toolsAndFrameworks.length + skills.leadershipAndSoft.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Detected Skills & Keywords
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Normalized against engineering and industry job taxonomies.
          </p>
        </div>
        <span className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
          {totalSkillsCount} keywords mapped
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card
            key={group.title}
            className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                {group.icon}
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {group.title}
                </span>
                <span className="ml-auto text-xs font-mono tabular-nums text-neutral-400">
                  ({group.items.length})
                </span>
              </div>

              {group.items.length > 0 ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                  {group.items.map((skill, idx) => (
                    <React.Fragment key={skill}>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {skill}
                      </span>
                      {idx < group.items.length - 1 && (
                        <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic pt-1">
                  No distinct keywords parsed in this category.
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
