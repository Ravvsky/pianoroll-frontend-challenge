"use client";
import { useAppSelector } from "../redux/hooks";
import parseSvgElement from "../utils/parseSvgElement";
import { redirect } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import Overlay from "./Overlay";
import getNumberOfNotesInSelection from "../utils/getNumberOfNotesInSelection";

const MainView = ({ itemId }: { itemId: number }) => {
  const rollsList = useAppSelector((state) => state.rollsList.items);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [distance, setDistance] = useState(0);
  const [resizingHandle, setResizingHandle] = useState<string | undefined>("");

  const divRef = useRef<HTMLDivElement>(null);
  const rightHandleRef = useRef<HTMLDivElement | null>(null);
  const leftHandleRef = useRef<HTMLDivElement | null>(null);

  if (!rollsList || itemId === undefined) {
    redirect("/");
  }
  const mainRoll = parseSvgElement(rollsList[itemId].svgElement);

  const handleMouseDown = (e: MouseEvent, side: string) => {
    if (side === "left") {
      setResizingHandle("left");
      setIsMouseDown(true);
    } else {
      setResizingHandle("right");
      setIsMouseDown(true);
    }
    setDistance(0);
  };

  const [overlayStartingPoint, setOverlayStartingPoint] = useState<number>(0);
  const [overlayWidth, setOverlayWidth] = useState<number>(0);
  const [notesCount, setNotesCount] = useState(0);

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setResizingHandle(undefined);
    const numberOfNotes = getNumberOfNotesInSelection(
      ".note-rectangle",
      mainRoll,
      divRef,
      overlayStartingPoint,
      overlayWidth,
    );
    if (typeof numberOfNotes === "number") {
      setNotesCount(numberOfNotes);
    } else {
      setNotesCount(0);
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown) {
      return;
    }
    if (resizingHandle === "right") {
      if (rightHandleRef.current) {
        const newDistance =
          e.clientX - rightHandleRef.current?.getBoundingClientRect().right;
        setDistance(newDistance);
      }
    } else if (resizingHandle === "left") {
      if (leftHandleRef.current) {
        const newDistance =
          e.clientX - leftHandleRef.current?.getBoundingClientRect().right;
        setDistance(-newDistance);
      }
    }
  };
  const [newOverlayStartingPoint, setNewOverlayStartingPoint] =
    useState<number>();
  const [isOverlayMoveActive, setIsOverlayMoveActive] = useState<boolean>();
  const newOverlayMoveHandler = (e: MouseEvent) => {
    if (isOverlayMoveActive) {
      if (e.movementX > 0) {
        handleMouseDown(e, "right");
      } else if (e.movementX < 0) {
        handleMouseDown(e, "left");
      }
      setIsOverlayMoveActive(false);
    }
  };

  const newOverlayMouseDownHandler = (e: MouseEvent) => {
    if (overlayWidth <= 0 && divRef.current) {
      setNewOverlayStartingPoint(
        e.clientX - divRef.current.getBoundingClientRect().left - 10,
      );
      setDistance(10);
      setIsOverlayMoveActive(true);
    }
  };

  const overlayhandleMouseUp = () => {
    setIsOverlayMoveActive(false);
  };

  return (
    <div className="container m-auto flex h-full flex-col gap-[2rem] text-[2rem] font-medium md:col-span-9 lg:col-span-10">
      <div ref={divRef} className="relative">
        <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
          <div
            className="flex h-[50vh] items-start"
            dangerouslySetInnerHTML={{ __html: mainRoll.outerHTML }}
            onMouseDown={newOverlayMouseDownHandler}
            onMouseMove={newOverlayMoveHandler}
            onMouseUp={overlayhandleMouseUp}
          ></div>

          <Overlay
            divRef={divRef}
            newDistance={distance}
            newStartingPoint={newOverlayStartingPoint}
            resizingHandle={resizingHandle}
            onStartingPointChange={(data) => {
              if (data) {
                setOverlayStartingPoint(data.startingPoint);
                setOverlayWidth(data.width);
              }
            }}
          >
            {" "}
            <div
              ref={rightHandleRef}
              onMouseDown={(e) => handleMouseDown(e, "right")}
              className=" h-full w-[1rem] cursor-col-resize  bg-[#00ff00]"
            ></div>
            <div
              ref={leftHandleRef}
              onMouseDown={(e) => handleMouseDown(e, "left")}
              className=" h-full w-[1rem] cursor-col-resize  bg-[#00ffff]"
            ></div>
          </Overlay>
        </div>
      </div>
      <div>Piano Roll number {itemId}</div>
      <div className="flex flex-col gap-[1rem] text-[1.6rem]">
        <div>Number of notes:{notesCount}</div>
        <div>
          Selection starting point:
          {overlayStartingPoint && overlayStartingPoint}
        </div>
        <div>
          Selection ending point:
          {overlayStartingPoint &&
            overlayWidth &&
            overlayStartingPoint + overlayWidth}
        </div>
      </div>
    </div>
  );
};

export default MainView;
