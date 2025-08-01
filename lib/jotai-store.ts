import { atom } from "jotai";
import React from "react";

const selectedAtom = atom<Movable | null>(null);
const canvasAtom = atom<Movable[]>([]);
const mouseAtom = atom<Mouse>({
  x: 0,
  y: 0,
  down: false,
  dragArea: { top: 0, left: 0, width: 0, height: 0 },
});
const cameraAtom = atom<Camera>({ x: 0, y: 0, lastX: 0, lastY: 0 });
const refAtom = atom<React.RefObject<HTMLDivElement>>(
  React.createRef<HTMLDivElement>()
);
const panModeAtom = atom<boolean>(false);
const deviceInfoAtom = atom<Device>({ width: 0, height: 0, isMobile: false });
const editorAtom = atom((get) => ({
  movables: get(canvasAtom),
  selected: get(selectedAtom),
  mouse: get(mouseAtom),
  ref: get(refAtom),
  panMode: get(panModeAtom),
  cameraAtom: get(cameraAtom),
  deviceInfo: get(deviceInfoAtom),
}));

export {
  selectedAtom,
  canvasAtom,
  mouseAtom,
  refAtom,
  editorAtom,
  panModeAtom,
  cameraAtom,
  deviceInfoAtom,
};

export type Movable = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type Mouse = {
  x: number;
  y: number;
  down: boolean;
  dragArea: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export type Camera = {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
};

export type Device = {
  width: number;
  height: number;
  isMobile: boolean;
};
