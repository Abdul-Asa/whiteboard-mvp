import { useViewportSize } from "@/hooks/use-viewport-size";
import { useWhiteboard } from "@/hooks/use-whiteboard";
import { CANVAS_SIZE } from "@/lib/constants";
import {
  cameraAtom,
  mouseAtom,
  panModeAtom,
  refAtom,
  selectedAtom,
} from "@/lib/jotai-store";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";

const Canvas = ({ children }: { children: React.ReactNode }) => {
  const [canvasRef] = useAtom(refAtom);
  const [panMode] = useAtom(panModeAtom);
  const [camera] = useAtom(cameraAtom);
  const [, setSelected] = useAtom(selectedAtom);
  const [isDragging, setIsDragging] = useState(false);
  const {
    updateCursorPos,
    updateCursorState,
    updateCameraPointer,
    updateCameraWheel,
    updateOffset,
    startDragArea,
    updateDragArea,
    endDragArea,
  } = useWhiteboard();

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    updateCameraWheel(event);
    updateCursorPos(event);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const isBubbled = event.target !== event.currentTarget;
    console.log("isBubbled", isBubbled);
    updateCursorPos(event);
    updateCursorState(true);
    setSelected(null);
    if (!panMode) startDragArea();
    if (!panMode) return;
    setIsDragging(true);
    updateOffset(event);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updateCursorPos(event);
    if (!panMode) updateDragArea();
    if (!panMode) return;
    if (!isDragging) return;
    updateCameraPointer(event);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    updateCursorState(false);
    endDragArea();
  };

  return (
    <motion.div
      className={`border-8 absolute border-yellow-500 ${
        panMode ? " cursor-move" : "cursor-auto"
      }`}
      ref={canvasRef}
      style={{
        x: camera.x,
        y: camera.y,
        height: CANVAS_SIZE,
        width: CANVAS_SIZE,
        backgroundImage:
          "linear-gradient(to right, white 0.3px, transparent 1px), linear-gradient(to bottom, white 0.3px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onWheel={handleScroll}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </motion.div>
  );
};

export default Canvas;
