"use client";

import useDisableScrollBounce from "@/hooks/use-disable-bounce";
import Cursor from "./cursor";
import DebugBar from "./debug-bar";
import Toolbar from "./toolbar";
import Canvas from "./canvas";
import { useAtom, useAtomValue } from "jotai";
import {
  canvasAtom,
  mouseAtom,
  Movable,
  refAtom,
  selectedAtom,
} from "@/lib/jotai-store";
import { motion, PanInfo } from "framer-motion";
import { set } from "lodash";
import { useState } from "react";

const Whiteboard = () => {
  useDisableScrollBounce();

  return (
    <div className="relative overflow-hidden h-[100svh] flex items-center justify-center">
      <Canvas>
        <MyCursor />
        <SelectionArea />
        <CanvasItems />
      </Canvas>
      <Toolbar />
      <DebugBar />
    </div>
  );
};

const MyCursor = () => {
  const cursor = useAtomValue(mouseAtom);
  return <Cursor color={"blue"} cursor={cursor} />;
};

const SelectionArea = () => {
  const cursor = useAtomValue(mouseAtom);

  return (
    cursor.down && (
      <div
        style={{
          position: "absolute",
          border: "1px dashed red",
          background: "rgba(0,0,0,0.2)",
          ...cursor.dragArea,
        }}
      />
    )
  );
};

const CanvasItems = () => {
  const [movables, setMovables] = useAtom(canvasAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [ref] = useAtom(refAtom);

  // const updateMovables = (id: string, x: number, y: number) => {
  //   setMovables((prev) =>
  //     prev.map((movable) => {
  //       if (movable.id === id) {
  //         return { ...movable, x, y };
  //       }
  //       return movable;
  //     })
  //   );
  // };
  // const handleDrag = (e: any, info: PanInfo, movable: Movable) => {
  //   const { id, x, y } = movable;
  //   const newX = x + info.offset.x;
  //   const newY = y + info.offset.y;
  //   console.log("dragging", id);
  //   updateMovables(id, x, y);
  // };

  return movables.map((movable) => {
    return (
      <motion.div
        // drag
        // dragMomentum={false}
        // dragConstraints={ref}
        key={movable.id}
        style={{
          position: "absolute",
          width: movable.width,
          height: movable.height,
          background: movable.color,
          left: movable.x,
          top: movable.y,
        }}
        // onDrag={(e, info) => handleDrag(e, info, movable)}
        onPointerDown={(e) => {
          setSelected(movable);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setMovables((prev) => prev.filter((m) => m.id !== movable.id));
        }}
      >
        {selected?.id === movable.id && (
          <div className="absolute border-2 border-yellow-200 -inset-1">
            <div className="absolute w-3 h-3 bg-yellow-200 -top-1 -left-1"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -top-1 -right-1"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -bottom-1 -left-1"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -bottom-1 -right-1"></div>
          </div>
        )}
        <p>
          {movable.x.toFixed(1)}, {movable.y.toFixed(1)}
        </p>
      </motion.div>
    );
  });
};

export default Whiteboard;
