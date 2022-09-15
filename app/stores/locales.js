import { writable } from "svelte/store";
import { getLocales, setLocales } from "../db/settings";

import locales from "../locales/global";
import EN from "../locales/en";
import FR from "../locales/fr";

function createLocales() {
  const { subscribe, set } = writable(EN);

  return {
    subscribe,
    refresh: async () => {
      let db_value = await getLocales();

      switch (db_value) {
        case locales.EN:
          set(EN);
          break;
        case locales.FR:
          set(FR);
          break;
        default:
          set(EN);
          break;
      }
      set(value);
    },
    switchToEN: async () => {
      const db_value = locales.EN;
      const result = await setLocales(db_value);

      if (result != null) {
        set(EN);
      }
    },
    switchToFR: async () => {
      const db_value = locales.FR;
      const result = await setLocales(db_value);

      if (result != null) {
        set(FR);
      }
    },
  };
}

const _locales = createLocales();

export default _locales;
