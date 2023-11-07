import * as vscode from "vscode";
import * as fs from "fs";
import * as yaml from "js-yaml";
import getTranslationsPathFromSelectedFile from "../helpers/translations-paths";
import { Message } from "../feedback/messages";

export default function registerCopyTranslationValueCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.copyTranslationValue",
    async (...args: any[]) => {
      // const chosenPath = await handleSelectTranslationFile(context, true);
      const chosenPath = await getTranslationsPathFromSelectedFile(context);
      const [selectedArg] = args as [string];

      if (!chosenPath) {
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const selectedTranslation =
          selectedArg || editor.document.getText(selection);

        if (selectedTranslation === "") {
          throw new Error("No translation string selected");
        }

        {
          try {
            // Read the existing YAML content from the file
            const fileContent = fs.readFileSync(chosenPath, "utf8");
            const data = yaml.load(fileContent) as Record<string, any>;

            // Split the translation path by "." to create a nested structure
            const keys = selectedTranslation.split(".");
            let currentLevel = data;
            let result = "";

            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              if (currentLevel[key] === undefined) {
                throw new Error(
                  `Key "${key}" in path "${selectedTranslation}" not found`
                );
              }
              result = `${currentLevel[key]}`;
              currentLevel = currentLevel[key];
            }

            vscode.env.clipboard.writeText(result);
            Message.info(`Copied translation`);
          } catch (error) {
            const err = error as any;
            Message.error(`${err.message}`);
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
