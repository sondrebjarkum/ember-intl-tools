import * as vscode from "vscode";
import getTranslationsPathFromSelectedFile from "../helpers/get-translations-path";
import { Message } from "../feedback/messages";

export default function registerGoToTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-gen.goToTranslation",
    async (...args: any[]) => {
      const [selectedArg] = args as [string];
      // const chosenPath = await handleSelectTranslationFile(context, true);
      const chosenPath = await getTranslationsPathFromSelectedFile(context);

      if (!chosenPath) {
        return;
      }

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selectedTranslation =
          selectedArg || editor.document.getText(editor.selection).trim();

        if (selectedTranslation === "") {
          throw new Error("No translation string selected");
        }

        if (chosenPath) {
          try {
            const document = await vscode.workspace.openTextDocument(
              chosenPath
            );

            const yamlContent = document.getText();

            const translationKeys = selectedTranslation.split(".");

            if (translationKeys.length < 1) {
              throw new Error("The chosen translation string was empty");
            }

            const rootKey = translationKeys[0];

            const yamlContentLines = yamlContent.split("\n");
            let keyLocation = -1;

            for (let i = 0; i < yamlContentLines.length; i++) {
              //nå er vi på rotnivå, sjekk at det ikke er noen mellomrom
              if (yamlContentLines[i].includes(" ")) {
                yamlContentLines[i] = replaceAllChars(yamlContentLines[i]);
                continue;
              }

              //på rotnivå, men inneholder ikke rotkey
              if (!yamlContentLines[i].includes(rootKey)) {
                yamlContentLines[i] = replaceAllChars(yamlContentLines[i]);
                continue;
              }

              //nå har jeg funnet riktig rot!
              for (let j = i; j < yamlContentLines.length; j++) {
                //nå bare ser jeg etter første treff som stemmer med siste key
                if (
                  yamlContentLines[j].includes(
                    translationKeys[translationKeys.length - 1] + ":"
                  )
                ) {
                  keyLocation = yamlContentLines
                    .join("\n")
                    .indexOf(yamlContentLines[j]);
                  break;
                }
              }
            }

            if (keyLocation === -1) {
              return Message.error("Could not find translation key");
            }

            const translationFile = await vscode.window.showTextDocument(
              document
            );
            const position = translationFile.document.positionAt(keyLocation);
            translationFile.selection = new vscode.Selection(
              position,
              position
            );
            translationFile.revealRange(new vscode.Range(position, position));
          } catch (error) {
            // throw new Error(
            //   `Could not find translation file. Try running "Intl: Set Default Localization File"`
            // );
            return Message.error(
              `Could not find translation file "${chosenPath
                .split("/")
                .at(-1)}"!
                Are you trying to use a localization that does not exist?
                Change local with "Intl: Set Default Localization File"`
            );
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function replaceAllChars(text: string, symbol: string = "#") {
  return text.replace(/./g, symbol);
}
