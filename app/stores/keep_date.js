import { writable } from "svelte/store";
import _keepDate from "../utils/keep_date";

function createKeepDate() {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    launch: () => {
      _keepDate();
      set(true);
    },
    reset: () => set(false),
  };
}

const keepDate = createKeepDate();

export default keepDate;
