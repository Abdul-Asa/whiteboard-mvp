import { editorAtom } from "@/lib/jotai-store";
import { useAtom } from "jotai";

const DebugBar = () => {
  const [{ movables, panMode, mouse, ref, cameraAtom, selected }] =
    useAtom(editorAtom);
  return (
    <div className="fixed top-0 right-0 p-4  bg-gray-800 text-white text-xs">
      <div>
        Mouse: {mouse.x.toFixed(1)}, {mouse.y.toFixed(1)},{" "}
        {mouse.down ? "down" : "up"}
      </div>
      <div>
        Camera: {cameraAtom.x.toFixed(1)}, {cameraAtom.y.toFixed(1)},{" "}
        {cameraAtom.lastX.toFixed(1)}, {cameraAtom.lastY.toFixed(1)}
      </div>
      <div>Panmode: {panMode ? "on" : "off"}</div>
      <div>
        Drag Area: <pre>{JSON.stringify(mouse.dragArea, null, 2)}</pre>
      </div>
      <div className="max-w-54">
        Selected:
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </div>
      <div>Movables length: {movables.length}</div>
      {/* <div className="max-w-54">
        Movables:
        <pre>{JSON.stringify(movables, null, 2)}</pre>
      </div> */}
      <div>
        Ref size: {ref.current?.clientWidth}px by {ref.current?.clientHeight}px
      </div>
    </div>
  );
};

export default DebugBar;
