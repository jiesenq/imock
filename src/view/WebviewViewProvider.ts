import {
  CancellationToken,
  ExtensionContext,
  WebviewView,
  WebviewViewResolveContext,
} from "vscode";
import * as vscode from "vscode";

import Data from "../data/types";
import { bindWebviewEvents } from "../helpers/bindWebviewEvents";

class WebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly template: Function,
    private readonly context: ExtensionContext,
    private readonly data: Data
  ) {}

  // Resolves and sets up the Webview
  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ): void {
    // Configure Webview options
    webviewView.webview.options = {
      enableScripts: true,
    };
    const { title, viewType, url } = context.state as Data;
    const state = {
      ...this.data,
      title,
      viewType,
      url,
    };
    // Set the Webview content
    bindWebviewEvents(webviewView, this.template, this.context, state);
    // bindWebviewEvents(webviewView, this.template, this.context);
  }
}

export { WebviewViewProvider };
