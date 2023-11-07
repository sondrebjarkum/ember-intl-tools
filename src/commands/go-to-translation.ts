import * as vscode from "vscode";
import getTranslationsPathFromSelectedFile from "../helpers/translations-paths";
import { Message } from "../feedback/messages";

export default function registerGoToTranslationCommand(
  context: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(
    "ember-intl-tools.goToTranslation",
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

            let yamlContentLines = yamlContent.split("\n");
            let keyLocation = -1;

            keyLocation = findTranslationKey(
              0,
              yamlContentLines,
              translationKeys
            );

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

function findTranslationKey(
  rootIndex: number,
  yamlLines: string[],
  translationKeys: string[]
) {
  let to = rootIndex;
  let transKeyIndex = 0;

  for (let i = rootIndex; i < yamlLines.length; i++) {
    to = i;
    const translationKey = makeKey(
      transKeyIndex,
      translationKeys[transKeyIndex]
    );
    const yamlLine = yamlLines[i];

    if (indents(yamlLine) !== indents(translationKey)) {
      yamlLines[i] = replaceAllChars(yamlLine);
      continue;
    }

    if (!yamlLine.includes(translationKey)) {
      yamlLines[i] = replaceAllChars(yamlLine);
      continue;
    }

    if (translationKeys.length - 1 === transKeyIndex) {
      break;
    }

    yamlLines[i] = replaceAllChars(yamlLine);
    transKeyIndex++;
  }

  if (to === yamlLines.length - 1) {
    //reached end of yaml with no matches
    return -1;
  }

  const keyLocation = yamlLines.join("\n").indexOf(yamlLines[to]);

  return keyLocation;
}

const indents = (s: string) => {
  const spaces = s.match(/^\s*/);
  if (!spaces) {
    return 0;
  }
  return spaces[0].length;
};

const makeKey = (indents: number, s: string) => {
  return " ".repeat(indents * 2) + s + ":";
};
