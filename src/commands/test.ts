import * as vscode from "vscode";
import { Message } from "../feedback/messages";

const TranslationsFileName = "nb-no.yml";

export default function registerTestCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-gen.test",
    async () => {
      Message.error("Error working fine");
      Message.info("Info working fine");
      Message.warning("Warning working fine");
    }
  );

  context.subscriptions.push(disposable);
}
