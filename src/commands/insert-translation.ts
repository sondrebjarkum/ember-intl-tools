import * as vscode from "vscode";

export default function registerInsertTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.insertTranslation",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;

        const translationKey = await vscode.window.showInputBox({
          placeHolder: "Enter translation key",
          prompt: "Enter a translation key to replace selcted text",
        });

        if (!translationKey) {
          return;
        }

        if (translationKey) {
          editor.edit((editBuilder) => {
            editBuilder.replace(selection, `{{t '${translationKey}'}}`);
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
