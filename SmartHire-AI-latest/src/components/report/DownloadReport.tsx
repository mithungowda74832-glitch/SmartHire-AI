import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ResumeAnalysisResult } from '../../types/resume';
import {
  exportReportAsHtml,
  exportReportAsMarkdown,
  exportReportAsJson,
} from '../../services/reportExport';
import { Download, FileCode, FileText, Check } from 'lucide-react';

interface DownloadReportProps {
  result: ResumeAnalysisResult;
}

export const DownloadReport: React.FC<DownloadReportProps> = ({ result }) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleDownload = (format: 'html' | 'markdown' | 'json') => {
    if (format === 'html') {
      exportReportAsHtml(result);
    } else if (format === 'markdown') {
      exportReportAsMarkdown(result);
    } else if (format === 'json') {
      exportReportAsJson(result);
    }

    setDownloadedFormat(format);
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export & Save Your Evaluation Report</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Exports are compiled directly from your session analysis. HTML reports feature embedded print styles suitable for immediate browser PDF generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDownload('html')}
            icon={downloadedFormat === 'html' ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          >
            {downloadedFormat === 'html' ? 'Saved HTML' : 'Download HTML / PDF'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload('markdown')}
            icon={downloadedFormat === 'markdown' ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
          >
            {downloadedFormat === 'markdown' ? 'Saved MD' : 'Markdown (.md)'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload('json')}
            icon={downloadedFormat === 'json' ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
          >
            {downloadedFormat === 'json' ? 'Saved JSON' : 'JSON Raw'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
