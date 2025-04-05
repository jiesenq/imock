import {
  CancellationToken,
  ExtensionContext,
  WebviewView,
  WebviewViewResolveContext,
} from "vscode";
import * as vscode from "vscode";

import { bindWebviewEvents } from "../../events/bindWebviewEvents";

class WebviewViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  constructor(
    private readonly template: string,
    private readonly context: ExtensionContext // private readonly data: Data // private readonly _extensionUri: vscode.Uri
  ) {}

  // Resolves and sets up the Webview
  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ): void {
    this._view = webviewView;
    // Configure Webview options
    webviewView.webview.options = {
      enableScripts: true,
    };
    // Set the Webview content
    bindWebviewEvents(webviewView, this.template, this.context);
  }
}

export { WebviewViewProvider };
