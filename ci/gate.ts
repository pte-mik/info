import { appendFileSync } from 'node:fs';

const zone = 'Europe/Budapest';

/**
 * Update window in Hungarian local time: hourly 08–17, then 18, 20 and 22; nothing from 00 to 08.
 * The zone database handles summer and winter time, so there is no hand-kept UTC offset.
 */
export function windowAllows(now: Date): boolean {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', hourCycle: 'h23' }).format(now));
  return (hour >= 8 && hour < 18) || hour === 18 || hour === 20 || hour === 22;
}

export function localTime(now: Date): string {
  return new Intl.DateTimeFormat('hu-HU', { timeZone: zone, dateStyle: 'short', timeStyle: 'short' }).format(now);
}

/** Only scheduled runs are limited to the window; manual runs and pushes to main always go on. */
export function decide(event: string, now: Date): { run: boolean; message: string } {
  if (event !== 'schedule') return { run: true, message: `Started by ${event || 'a manual run'}: the update window does not apply.` };
  const run = windowAllows(now);
  return { run, message: run ? `Inside the update window (${localTime(now)}, ${zone}).` : `Outside the update window (${localTime(now)}, ${zone}): nothing is checked or built.` };
}

if (import.meta.main) {
  const { run, message } = decide(process.env.EVENT_NAME ?? '', new Date());
  console.log(message);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `run=${run}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `**${run ? 'Update window' : 'Skipped'}:** ${message}\n`);
}
