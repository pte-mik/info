import { describe, expect, test } from 'bun:test';
import { decide, windowAllows } from './gate';

const at = (iso: string) => new Date(iso);

describe('update window (Europe/Budapest)', () => {
  // Summer time: UTC+2.
  test.each([
    ['2026-07-01T05:59:00Z', false], ['2026-07-01T06:17:00Z', true], ['2026-07-01T15:17:00Z', true],
    ['2026-07-01T16:17:00Z', true], ['2026-07-01T17:17:00Z', false], ['2026-07-01T18:17:00Z', true],
    ['2026-07-01T19:17:00Z', false], ['2026-07-01T20:17:00Z', true], ['2026-07-01T21:17:00Z', false],
    ['2026-07-01T22:00:00Z', false], ['2026-07-01T04:17:00Z', false]
  ])('summer %s -> %p', (iso, expected) => expect(windowAllows(at(iso))).toBe(expected));

  // Winter time: UTC+1.
  test.each([
    ['2026-01-15T06:59:00Z', false], ['2026-01-15T07:17:00Z', true], ['2026-01-15T16:17:00Z', true],
    ['2026-01-15T17:17:00Z', true], ['2026-01-15T18:17:00Z', false], ['2026-01-15T19:17:00Z', true],
    ['2026-01-15T20:17:00Z', false], ['2026-01-15T21:17:00Z', true], ['2026-01-15T22:17:00Z', false]
  ])('winter %s -> %p', (iso, expected) => expect(windowAllows(at(iso))).toBe(expected));

  test('follows the clock change days', () => {
    // 2026-03-29: clocks move forward; 06:17 UTC is 08:17 local.
    expect(windowAllows(at('2026-03-29T05:17:00Z'))).toBe(false);
    expect(windowAllows(at('2026-03-29T06:17:00Z'))).toBe(true);
    // 2026-10-25: clocks move back; 06:17 UTC is 07:17 local, 07:17 UTC is 08:17.
    expect(windowAllows(at('2026-10-25T06:17:00Z'))).toBe(false);
    expect(windowAllows(at('2026-10-25T07:17:00Z'))).toBe(true);
  });

  test('a late scheduled run is judged by its real local time', () => {
    expect(windowAllows(at('2026-07-01T15:50:00Z'))).toBe(true); // 17:50 local: still the 17:17 slot
    expect(windowAllows(at('2026-07-01T17:05:00Z'))).toBe(false); // 19:05 local: the 18:17 slot was skipped
  });

  test('only scheduled runs are limited', () => {
    const night = at('2026-07-01T00:17:00Z');
    expect(decide('schedule', night).run).toBe(false);
    for (const event of ['push', 'workflow_dispatch', '']) expect(decide(event, night).run).toBe(true);
  });
});
