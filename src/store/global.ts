import ylsj from "./data/ylsj";

let useGlobalStore: any;

if (import.meta.env.VITE_APP_MODEL == "ylsj") {
  useGlobalStore = ylsj;
}

export { useGlobalStore };
