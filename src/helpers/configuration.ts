import * as vscode from "vscode";

class ConfigurationBase {
  workspace;
  constructor() {
    this.workspace = vscode.workspace;
  }

  get<TConfigValue>(configuration: string) {
    return this.workspace
      .getConfiguration("ember-intl-tools")
      .get(configuration) as TConfigValue | undefined;
  }

  set<TValue extends boolean | string>(configuration: string, value: TValue) {
    return this.workspace
      .getConfiguration("ember-intl-tools")
      .update(configuration, value);
  }
}

export const Configuration = new ConfigurationBase();
