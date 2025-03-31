import Data from "../data/types";
import { readFileSync } from "fs";
// import CONST_WEBVIEW from "../data/webview";

interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}
export const mockViewTemplate = (webviewContext: WebviewContext) => {
  let html = readFileSync(
    webviewContext.extensionPath + "src/views/pages/mock-api.html",
    "utf8"
  );
  return html;
};
