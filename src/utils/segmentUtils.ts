export const isSegmentInvalid = (segment: Segment): boolean => {
  return segment.dose <= 0 || segment.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0 */
export const isSegmentPlaceholder = (segment: Segment): boolean => {
  if (!segment) return false;
  return segment.dose === 0 && segment.daysForDose === 0;
};

export const sumSegmentsDose = (segments: Segment[]): number => {
  return segments.reduce((sum, segment) => sum + segment.dose * segment.daysForDose, 0);
};

export const sumSegmentsDays = (segments: Segment[]): number => {
  return (
    segments.reduce((sum, segment) => sum + segment.daysForDose, 0)
  );
};

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

export function segmentIsOrDirectlyAfterPlaceholder(segments: Segment[], index: number) {
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