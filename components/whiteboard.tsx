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
  const [cursor] = useAtom(mouseAtom);
  const ref = useAtomValue(refAtom);
  const [resizing, setResizing] = useState(false);
  const [resizePos, setResizePos] = useState({ x: 0, y: 0 });

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    setResizePos({ x: e.clientX, y: e.clientY });
  };

  const doResize = (e: MouseEvent) => {
    if (resizing && selected) {
      const dx = e.clientX - resizePos.x;
      const dy = e.clientY - resizePos.y;
      setMovables((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? { ...m, width: m.width + dx, height: m.height + dy }
            : m
        )
      );
      setResizePos({ x: e.clientX, y: e.clientY });
    }
  };

  const endResize = () => {
    setResizing(false);
  };

  return movables.map((movable) => {
    return (
      <motion.div
        key={movable.id}
        drag
        dragMomentum={false}
        dragConstraints={ref}
        style={{
          position: "absolute",
          width: movable.width,
          height: movable.height,
          background: movable.color,
          x: movable.x,
          y: movable.y,
          zIndex: selected?.id === movable.id ? 10 : 1,
        }}
        onPointerDown={(e) => {
          setSelected(movable);
        }}
        onPointerMove={(e) => {
          if (cursor.down && selected?.id === movable.id) {
            const offsetX =
              e.clientX - e.currentTarget.getBoundingClientRect().left;
            const offsetY =
              e.clientY - e.currentTarget.getBoundingClientRect().top;
            setMovables((prev) =>
              prev.map((m) => {
                if (m.id === movable.id) {
                  return {
                    ...m,
                    x: cursor.x - offsetX,
                    y: cursor.y - offsetY,
                  };
                }
                return m;
              })
            );
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setMovables((prev) => prev.filter((m) => m.id !== movable.id));
        }}
      >
        {selected?.id === movable.id && (
          <div className="absolute border-2 border-yellow-200 -inset-0">
            <div className="absolute w-3 h-3 bg-yellow-200 -top-1 -left-1 cursor-ne-e"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -top-1 -right-1 cursor-ne-e"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -bottom-1 -left-1 cursor-ne-e"></div>
            <div className="absolute w-3 h-3 bg-yellow-200 -bottom-1 -right-1 cursor-ne-e"></div>
          </div>
        )}
        <div className=" select-none w-full h-full flex justify-center items-center">
          {movable.x.toFixed(1)}, {movable.y.toFixed(1)}
        </div>
      </motion.div>
    );
  });
};

export default Whiteboard;
