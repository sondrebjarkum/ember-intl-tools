import * as vscode from "vscode";

export const Message = {
  error: (message: string, ...items: string[]) =>
    vscode.window.showErrorMessage(message, ...items),
  info: (message: string, ...items: string[]) =>
    vscode.window.showInformationMessage(message, ...items),
  warning: (message: string, ...items: string[]) =>
    vscode.window.showWarningMessage(message, ...items),
};
