import * as vscode from "vscode";
import registerAddTranslationCommand from "./commands/add-translation";
import registerCopyTranslationValueCommand from "./commands/copy-translation-value";
import registerGoToTranslationCommand from "./commands/go-to-translation";
import registerHandlebarsCodelens from "./code-lens/handlebars";
import registerTestCommand from "./commands/test";
import registerSetDefaultLocalizationFileCommand from "./commands/set-default-localization-file";
import registerInsertTranslationCommand from "./commands/insert-translation";
import registerSetAddTranslationsToAllFilesCommand from "./commands/set-add-translations-to-all-files";
import registerQuickConfigureCommand from "./commands/quick-configure";

export function activate(context: vscode.ExtensionContext) {
  /* Codelens */
  registerHandlebarsCodelens(context);

  /* Commands */
  registerAddTranslationCommand(context);
  registerInsertTranslationCommand(context);
  registerCopyTranslationValueCommand(context);
  registerGoToTranslationCommand(context);

  /* Settings Commands */
  registerSetDefaultLocalizationFileCommand(context);
  registerSetAddTranslationsToAllFilesCommand(context);
  registerQuickConfigureCommand(context);

  /* Test */
  registerTestCommand(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
