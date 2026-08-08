/**
 * Utility to get color token based on completion percentage threshold:
 * 0–29%: --danger (Red)
 * 30–69%: --warning (Amber/Yellow)
 * 70–100%: --success / --accent-primary (Green)
 */
export const getProgressColor = (percentage = 0) => {
  const p = Math.min(100, Math.max(0, Number(percentage) || 0));
  if (p < 30) {
    return 'var(--danger)';
  }
  if (p < 70) {
    return 'var(--warning)';
  }
  return 'var(--success)';
};
