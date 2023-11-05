"use client";
import { useRef, useState, useEffect, ReactNode } from "react";

const Overlay = ({
  children,
  divRef,
  newDistance,
  newStartingPoint,
  resizingHandle,
  onStartingPointChange,
}: {
  children: ReactNode;
  divRef: React.RefObject<HTMLDivElement>;
  newDistance: number;
  newStartingPoint: number | undefined;
  resizingHandle: string | undefined;
  onStartingPointChange: ({
    startingPoint,
    width,
  }: {
    startingPoint: number;
    width: number;
  }) => void;
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [overlayStart, setOverlayStart] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(0);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [oldX, setOldX] = useState(0);

  useEffect(() => {
    if (newStartingPoint) {
      setOverlayStart(newStartingPoint);
    }
  }, [newStartingPoint]);
  useEffect(() => {
    if (overlayRef.current) {
      setOverlayWidth(overlayRef.current.offsetWidth);
      setOverlayStart(0);
    }
  }, []);
  const mouseDownHandler = () => {
    if (!resizingHandle) {
      setIsMousePressed(true);
    }
  };

  const mouseUpHandler = () => {
    setIsMousePressed(false);
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

  useEffect(() => {
    onStartingPointChange({ startingPoint: overlayStart, width: overlayWidth });
  }, [onStartingPointChange, overlayStart, overlayWidth]);
  return (
    <div
      draggable="false"
      onDragStart={(e) => {
        e.preventDefault();
      }}
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
