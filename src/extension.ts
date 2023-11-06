import * as vscode from "vscode";
import registerAddTranslationCommand from "./commands/add-translation";
import registerCopyTranslationValueCommand from "./commands/copy-translation-value";
import registerGoToTranslationCommand from "./commands/go-to-translation";
import registerHandlebarsCodelens from "./code-lens/handlebars";
import registerTestCommand from "./commands/test";
import registerSetDefaultLocalizationFileCommand from "./commands/set-localization-file";

export function activate(context: vscode.ExtensionContext) {
  /* Commands */
  registerAddTranslationCommand(context);
  registerCopyTranslationValueCommand(context);
  registerGoToTranslationCommand(context);
  registerSetDefaultLocalizationFileCommand(context);

  /* Codelens */
  registerHandlebarsCodelens(context);

  /* Test */
  registerTestCommand(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
