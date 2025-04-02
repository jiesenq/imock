import Data from "../data/types";
import * as fs from "fs";
import { readFileSync } from "fs";
import * as path from "path";

interface WebviewContext {
  extensionPath: string;
  webviewUri: string;
}
export const mockViewTemplate = (webviewContext: WebviewContext) => {
  // 假设原本读取 mock-api.html 的代码如下
  // const htmlFilePath = path.join(__dirname, 'mock-api.html');

  let html = readFileSync(
    webviewContext.extensionPath + "src/views/pages/menus.html",
    "utf8"
  );
  return html;
};
