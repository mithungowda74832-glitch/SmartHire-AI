export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getScoreGrade(score: number): {
  label: string;
  tone: 'high' | 'medium' | 'needs-work';
  colorClass: string;
} {
  if (score >= 85) {
    return {
      label: 'Exceptional',
      tone: 'high',
      colorClass: 'text-emerald-700 dark:text-emerald-400',
    };
  }
  if (score >= 70) {
    return {
      label: 'Strong',
      tone: 'high',
      colorClass: 'text-blue-700 dark:text-blue-400',
    };
  }
  if (score >= 55) {
    return {
      label: 'Adequate',
      tone: 'medium',
      colorClass: 'text-amber-700 dark:text-amber-400',
    };
  }
  return {
    label: 'Needs Attention',
    tone: 'needs-work',
    colorClass: 'text-rose-700 dark:text-rose-400',
  };
}
