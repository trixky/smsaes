import { writable } from "svelte/store";

function createLaunched() {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    launch: () => set(true),
    stop: () => set(false),
    reset: () => set(false),
  };
}

const launched = createLaunched();

export default launched;
