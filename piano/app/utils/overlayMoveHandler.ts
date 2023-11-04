import { SetStateAction, MutableRefObject } from "react";

const overlayMoveHandler = (
  oldX: number | null,
  isMousePressed: boolean,
  setOverlayStart: {
    (value: SetStateAction<number>): void;
    (arg0: (prev: any) => any): void;
  },
  overlayWidth: number,
  divRef: MutableRefObject<null>,
  clientX: number
) => {
  if (oldX !== null && isMousePressed) {
    const deltaX = clientX - oldX;
    setOverlayStart((prev: number) => {
      if (prev + deltaX < 0) {
        return 0;
      } else if (prev + deltaX + overlayWidth > divRef.current.offsetWidth) {
        return divRef.current.offsetWidth - overlayWidth;
      } else {
        return prev + deltaX;
      }
    });
  }
};
export default overlayMoveHandler;
