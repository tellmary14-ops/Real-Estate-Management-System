const PREFIX = "[Golden Eggs UI]";

export const logger = {
  info: (step, detail) => {
    if (import.meta.env.DEV) console.log(PREFIX, step, detail ?? "");
  },
  error: (step, detail) => console.error(PREFIX, step, detail ?? ""),
};
