import { canvasAtom, panModeAtom, refAtom } from "@/lib/jotai-store";
import { useAtom } from "jotai";
import { Button } from "./ui/button";

const Toolbar = () => {
  const [panMode, setPanMode] = useAtom(panModeAtom);

  return (
    <div className="gap-4 fixed bottom-4 left-4 flex justify-between  border p-4 rounded-md">
      {/* <Button
        onClick={() => {
          console.log("Add");
          //   createMovable();
        }}
      >
        Add
      </Button> */}
      <Button
        onClick={() => {
          setPanMode((prev) => !prev);
        }}
      >
        Pan
      </Button>
    </div>
  );
};

export default Toolbar;
