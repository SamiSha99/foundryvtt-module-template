# Foundry VTT Module Template with Intellisense

A template based on the wiki page [Improving Intellisense](https://foundryvtt.wiki/en/development/guides/improving-intellisense) and the [FoundryVTT Module Template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template).

Focuses on having local Intellisense without using package library like `fvtt-types`.

## Usage

When installed clone [example-foundry-config.yaml](./example-foundry-config.yaml) and call it `foundry-config.yaml`, then inside add the path to the root installation directory of your foundry:

```yaml
installPath: "C:\\Path\\To\\Foundry\\Version ??"
```

Then afterward, run the following commands:

```
npm i && npm run createSymlinks
```

And done! You can now develop using local intellisense provided through the symlink you just made running the script.

## Acknowledgment

- [FoundryVTT Module Template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template) for the base project to create releases.
- [Improving Intellisense](https://foundryvtt.wiki/en/development/guides/improving-intellisense) for implementing Intellisense locally.

## To-Do

- I can see there's potential to improve this and even further simplify it.
