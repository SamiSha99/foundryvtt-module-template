# Foundry VTT Module Template with Intellisense

A template based on the wiki page [Improving Intellisense](https://foundryvtt.wiki/en/development/guides/improving-intellisense) and the [FoundryVTT Module Template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template).

Focuses on having local Intellisense without using package library like `fvtt-types`.

## Usage

Create a repository from this template, the module's `id` will be renamed to match the repository's name.

Then run the following command:

```
npm i
```

And done! You can now develop using local intellisense, and your module is symlinked into Foundry's modules folder.

If Foundry isn't installed in its default location, clone [example-foundry-config.yaml](./example-foundry-config.yaml) and call it `foundry-config.yaml`, then set `installPath` and/or `dataPath` inside.

## Acknowledgment

- [FoundryVTT Module Template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template) for the base project to create releases.
- [Improving Intellisense](https://foundryvtt.wiki/en/development/guides/improving-intellisense) for implementing Intellisense locally.

## To-Do

- I can see there's potential to improve this and even further simplify it.
