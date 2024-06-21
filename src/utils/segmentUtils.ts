export const isSegmentInvalid = (segment: Segment): boolean => {
  return segment.dose <= 0 || segment.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0 */
export const isSegmentPlaceholder = (segment: Segment): boolean => {
  return segment.dose === 0 && segment.daysForDose === 0;
};

export const sumScheduleDose = (segments: Segment[]): number => {
  return segments.reduce((sum, segment) => sum + segment.dose * segment.daysForDose, 0);
};

export const sumScheduleDays = (segments: Segment[]): number => {
  return (
    segments.reduce((sum, segment) => sum + segment.daysForDose, 0) +
    segments.length - 2
  );
};

export function isSegmentAfterPlaceholder(segment: Segment, segments: Segment[]) {
  if (!segment) return false;
  const thisSegmentIndex: number = segments.findIndex((s) => s === segment);

  if (thisSegmentIndex === -1) {
    return false;
  }

  const prevSegment = segments[segments.indexOf(segment) - 1];
  if (!prevSegment) return false;
  return isSegmentPlaceholder(prevSegment);
}

export function segmentIsOrAfterPlaceholder(segment: Segment, segments: Segment[]) {
  if (!segment) return false;

  if (isSegmentPlaceholder(segment)) {
    return true;
  }
  if (isSegmentAfterPlaceholder(segment, segments)) {
    return true;
  }
  return false;
}