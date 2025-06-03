import ylsj from "./data/ylsj";
import znwlqcjs from "./data/znwlqcjs";

let useGlobalStore: any;

if (import.meta.env.VITE_APP_MODEL == "ylsj") {
  useGlobalStore = ylsj;
} else if (import.meta.env.VITE_APP_MODEL == "znwlqcjs") {
  useGlobalStore = znwlqcjs;
}

export { useGlobalStore };
