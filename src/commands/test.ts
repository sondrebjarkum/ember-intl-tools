import * as vscode from "vscode";
import { Message } from "../feedback/messages";

export default function registerTestCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.test",
    async () => {
      Message.error("Error working fine");
      Message.info("Info working fine");
      Message.warning("Warning working fine");
    }
  );

  context.subscriptions.push(disposable);
}
