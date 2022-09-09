import { writable } from "svelte/store";
import { getHeader, setHeader } from "../db/theme";

function createHeader() {
  const { subscribe, set } = writable("");

  return {
    subscribe,
    refresh: async () => {
      let value = await getHeader();

      if (value === null || value === undefined || value.length === 0) {
        set("");
      } else {
        set(value);
      }
    },
    set: async (value) => {
      const result = await setHeader(value);

      if (result != null) {
        set(value);
      }
    },
    reset: async () => {
      const value = "";

      const result = await setHeader(value);

      if (result != null) {
        set(value);
      }
    },
  };
}

const header = createHeader();

export default header;
