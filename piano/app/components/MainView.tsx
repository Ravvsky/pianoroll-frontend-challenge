"use client";
import { useAppSelector } from "../redux/hooks";
import parseSvgElement from "../utils/parseSvgElement";
import { redirect } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import Overlay from "./Overlay";

const MainView = ({ itemId }: { itemId: number }) => {
  const rollsList = useAppSelector((state) => state.rollsList.items);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [distance, setDistance] = useState(0);
  const [resizingHandle, setResizingHandle] = useState("");

  const divRef = useRef(null);
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
  const handleMouseUp = () => {
    setIsMouseDown(false);
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

  return (
    <div className="container m-auto flex h-full  flex-col md:col-span-9 lg:col-span-10">
      Piano Roll number {itemId}
      <div ref={divRef} className="relative">
        <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
          <div
            className="flex h-[50vh] items-start"
            dangerouslySetInnerHTML={{ __html: mainRoll.outerHTML }}
          ></div>

          <Overlay
            divRef={divRef}
            newDistance={distance}
            isResizing={isMouseDown}
            resizingHandle={resizingHandle}
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
    </div>
  );
};

export default MainView;
