## Features

Adds tooling for dealing with EmberJS Intl.

Adds commands to:

- add translations
- insert handlebar translation
- lookup translations (also inline in handlebars)
- copy translations (also inline in handlebars)

## Configuring

To access configurations press <kbd>Cmd</kbd> + <kbd>,</kbd> or <kbd>Ctrl</kbd> + <kbd>,</kbd> and search for `Ember-intl-tools` or run the command `Intl: Configure`

#### Add Translation To All Files (default false)

If enabled, the extension will scan for all available locales in the '/translations' directory and apply the specified translation to each of them (wont translate for you)

#### Set Deafault Locale File (default no-nb.yml)

Set default locale file which to add translations to. This has to be set and defaults to "no-nb.yml".

## Limitations

Not able to do lookups on translations such as this: `{{t "qrscanner.error" error=this.error}}`

## Release Notes

### 1.0.0

Initial release
