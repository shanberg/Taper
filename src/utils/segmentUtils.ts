/**
 * @fileoverview Segment helpers: validity, placeholder detection, sums, and position checks.
 */

/** Returns true if segment has invalid dose or daysForDose (≤0). */
export const isSegmentInvalid = (segment: Segment): boolean => {
  return segment.dose <= 0 || segment.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0. */
export const isSegmentPlaceholder = (segment: Segment): boolean => {
  if (!segment) return false;
  return segment.dose === 0 && segment.daysForDose === 0;
};

/** Returns total dose (dose × daysForDose summed) across segments. */
export const sumSegmentsDose = (segments: Segment[]): number => {
  return segments.reduce((sum, segment) => sum + segment.dose * segment.daysForDose, 0);
};

/** Returns total days across segments. */
export const sumSegmentsDays = (segments: Segment[]): number => {
  return (
    segments.reduce((sum, segment) => sum + segment.daysForDose, 0)
  );
};

/** Returns true if the segment at index is immediately after a placeholder. */
export function isSegmentDirectlyAfterPlaceholder(segments: Segment[], index: number) {
  const segment = segments[index]
  if (!segment) return false;

  if (index === -1) {
    return false;
  }

  const prevSegment = segments[index - 1];
  if (!prevSegment) return false;
  return isSegmentPlaceholder(prevSegment);
}

/** Returns true if the segment at index is a placeholder or is after a placeholder. */
export function segmentIsOrAfterPlaceholder(segments: Segment[], index: number) {
  const segment = segments[index]

  if (!segment) return false;
  if (isSegmentPlaceholder(segment)) {
    return true;
  }
  if (isSegmentDirectlyAfterPlaceholder(segments, index)) {
    return true;
  }
  return false;
}