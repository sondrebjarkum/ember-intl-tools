import * as vscode from "vscode";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { Message } from "../feedback/messages";

export async function updateTranslationsFile(
  filePath: string,
  translationKey: string,
  translationValue: string
) {
  try {
    // Read the existing YAML content
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContent) as any;

    // Split the translation key by "." to create a nested structure
    const keys = translationKey.split(".");
    let currentLevel = data;

    // Traverse the nested structure and create missing paths
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentLevel[key]) {
        currentLevel[key] = {};
      }
      currentLevel = currentLevel[key];
    }

    if (currentLevel[keys[keys.length - 1]]) {
      const response = await vscode.window.showInformationMessage(
        "Overwrite existing translation?",
        { modal: true },
        "Yes",
        "No"
      );

      if (!response || response === "No") {
        throw new Error("No change made");
      }
    }

    // Set the translation value at the final key
    currentLevel[keys[keys.length - 1]] = translationValue;

    // Convert the updated data back to YAML
    const updatedYAML = yaml.dump(data, {
      noRefs: true, // Prevent replacing duplicate references,
      forceQuotes: true,
      quotingType: '"',
    });

    // Write the updated YAML back to the file
    fs.writeFileSync(filePath, updatedYAML, "utf8");
  } catch (error) {
    const err = error as any;
    Message.error(`Error updating YAML file: ${err.message}`);
    throw new Error(err.message);
  }
}
