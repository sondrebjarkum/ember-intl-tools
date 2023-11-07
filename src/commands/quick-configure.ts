import * as vscode from "vscode";
import { Message } from "../feedback/messages";

export default function registerQuickConfigureCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.quickConfigure",
    async () => {
      await vscode.commands.executeCommand(
        "ember-intl-tools.setDefaultLocalizationFile"
      );
      await vscode.commands.executeCommand(
        "ember-intl-tools.setAddTranslationsToAllFiles"
      );
    }
  );

  context.subscriptions.push(disposable);
}
