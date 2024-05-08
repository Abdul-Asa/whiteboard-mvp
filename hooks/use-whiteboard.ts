import { CANVAS_SIZE } from "@/lib/constants";
import { cameraAtom, canvasAtom, mouseAtom } from "@/lib/jotai-store";
import { useAtom } from "jotai";
import { useViewportSize } from "./use-viewport-size";
import { useState } from "react";
import { color } from "framer-motion";

export const useWhiteboard = () => {
  const [cursor, setCursor] = useAtom(mouseAtom);
  const [movables, setMovables] = useAtom(canvasAtom);
  const [, setCamera] = useAtom(cameraAtom);
  const dimensions = useViewportSize();
  const viewWidth = dimensions.width;
  const viewHeight = dimensions.height;
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const updateCursorPos = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const borderSize = (rect.width - event.currentTarget.clientWidth) / 2;
    const x = event.clientX - rect.left - borderSize;
    const y = event.clientY - rect.top - borderSize;
    setCursor((prev) => ({ ...prev, x, y }));
  };
  const updateCursorState = (isDown: boolean) => {
    setCursor((prev) => ({ ...prev, down: isDown }));
  };
  const updateCameraPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    setCamera((prev) => {
      if (!prev.lastX || !prev.lastY) return prev;
      let newX = prev.x + event.clientX - prev.lastX;
      let newY = prev.y + event.clientY - prev.lastY;

      const maxX = CANVAS_SIZE / 2 - viewWidth / 2;
      const maxY = CANVAS_SIZE / 2 - viewHeight / 2;
      const minX = -(CANVAS_SIZE / 2) + viewWidth / 2;
      const minY = -(CANVAS_SIZE / 2) + viewHeight / 2;

      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      return { x: newX, y: newY, lastX: event.clientX, lastY: event.clientY };
    });
  };
  const updateCameraWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setCamera((prev) => {
      let newX = prev.x - event.deltaX;
      let newY = prev.y - event.deltaY;

      const maxX = CANVAS_SIZE / 2 - viewWidth / 2;
      const maxY = CANVAS_SIZE / 2 - viewHeight / 2;
      const minX = -(CANVAS_SIZE / 2) + viewWidth / 2;
      const minY = -(CANVAS_SIZE / 2) + viewHeight / 2;

      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      return { ...prev, x: newX, y: newY };
    });
  };
  const updateOffset = (event: React.PointerEvent<HTMLDivElement>) => {
    setCamera((prev) => ({
      ...prev,
      lastX: event.clientX,
      lastY: event.clientY,
    }));
  };
  const startDragArea = () => {
    setDragStart({ x: cursor.x, y: cursor.y });
  };
  const updateDragArea = () => {
    if (cursor.down) {
      setCursor((prev) => ({
        ...prev,
        dragArea: {
          top: Math.min(cursor.y, dragStart.y),
          left: Math.min(cursor.x, dragStart.x),
          width: Math.abs(cursor.x - dragStart.x),
          height: Math.abs(cursor.y - dragStart.y),
        },
      }));
    }
  };
  const endDragArea = () => {
    if (cursor.down) {
      createMovable(
        cursor.dragArea.left,
        cursor.dragArea.top,
        cursor.dragArea.height,
        cursor.dragArea.width
      );
    }
    setCursor((prev) => ({
      ...prev,
      dragArea: { top: 0, left: 0, width: 0, height: 0 },
    }));
  };

  const createMovable = (
    x: number,
    y: number,
    height: number,
    width: number
  ) => {
    const newMovable = {
      id: crypto.randomUUID().slice(0, 8),
      x,
      y,
      width,
      height,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setMovables((prev) => [...prev, newMovable]);
  };

  return {
    updateCursorPos,
    updateCursorState,
    updateCameraPointer,
    updateCameraWheel,
    updateOffset,
    startDragArea,
    updateDragArea,
    endDragArea,
    createMovable,
  };
};
const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
