import { readFileSync } from "fs";

export const getTemplate = (extensionPath: string, path: string) => {
  let html = readFileSync(extensionPath + path, "utf8");
  return html;
};
