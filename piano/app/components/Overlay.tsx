"use client";
import { useRef, useState, useEffect, ReactNode } from "react";

const Overlay = ({
  children,
  divRef,
  newDistance,
  isResizing,
  resizingHandle,
}: {
  children: ReactNode;
  divRef: React.RefObject<HTMLDivElement>;
  newDistance: number;
  isResizing: boolean;
  resizingHandle: string;
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [overlayStart, setOverlayStart] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(300);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [oldX, setOldX] = useState(0);

  useEffect(() => {
    if (overlayRef.current) {
      setOverlayWidth(overlayRef.current.offsetWidth);
      setOverlayStart(0);
    }
  }, []);
  const mouseDownHandler = () => {
    if (!isResizing) {
      setIsMousePressed(true);
    }
  };

  const mouseUpHandler = () => {
    if (!isResizing) {
      setIsMousePressed(false);
    }
  };

  const mouseMoveHandler: React.MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (oldX !== null && isMousePressed) {
      const deltaX = e.clientX - oldX;

      const newStart = overlayStart + deltaX;

      if (newStart < 0) {
        setOverlayStart(0);
      } else if (
        divRef.current?.offsetWidth &&
        newStart + overlayWidth > divRef.current?.offsetWidth
      ) {
        setOverlayStart(divRef.current?.offsetWidth - overlayWidth);
      } else {
        setOverlayStart(newStart);
      }
    }
    setOldX(e.clientX);
  };

  useEffect(() => {
    setOverlayWidth((prev) => prev + newDistance);
    setIsMousePressed(false);
    if (resizingHandle === "left") {
      setOverlayStart((prev) => prev - newDistance);
    }
  }, [newDistance, resizingHandle]);

  return (
    <div
      ref={overlayRef}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
      className={`absolute top-0 flex resize-none flex-row-reverse justify-between bg-red opacity-60 hover:resize`}
      style={{
        left: `${overlayStart}px`,
        height: "100%",
        width: `${overlayWidth}px`,
      }}
    >
      {children}
    </div>
  );
};
export default Overlay;
