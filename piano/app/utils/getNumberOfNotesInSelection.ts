import { RefObject } from "react";

const getNumberOfNotesInSelection = (
  notesSelector: string,
  roll: Element,
  ref: RefObject<HTMLDivElement>,
  overlayStartingPoint: number,
  overlayWidth: number,
) => {
  if (!ref.current) {
    return;
  }
  const notes = roll.querySelectorAll(notesSelector);
  const startingPointInPercentage =
    overlayStartingPoint / ref.current.offsetWidth;
  const overlayEndingPoint = overlayStartingPoint + overlayWidth;

  const endingPointInPercentage = overlayEndingPoint / ref.current.offsetWidth;

  let count = 0;

  notes.forEach((note) => {
    const xValue = note.getAttribute("x");

    if (xValue !== null) {
      const parsedXValue = parseFloat(xValue);
      if (
        parsedXValue >= startingPointInPercentage &&
        parsedXValue <= endingPointInPercentage
      ) {
        count++;
      }
    }
  });

  return count;
};
export default getNumberOfNotesInSelection;
