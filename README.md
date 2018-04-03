# React VMWare Clarity

React UI framework, based on [VMWare Clarity](https://vmware.github.io/clarity/).

* Webpack 4
* TypeScript
* SASS

## Done

* VMWare Clarity styles
* Icons
* Alerts
* Badges
* Buttons
* Cards
* Checkboxes
* Code Highlight
* DatePicker

* DropDown
* Radio Buttons

* Labels
* Spinners
* Toggle Switches
* Tooltips

## Feature

* DropDown with async event propagation [[video](https://youtu.be/Q23Z5e8ZZD8)]

## TODO

* storybook
* jest
* npm publish
* documentation

## Use SASS constants from VMWare Clarity

Install WMWare Clarity package & bootstrap dependency
```
npm i @clr/ui@0.11.9 bootstrap@4.0.0-alpha.5
```

Light theme:
```scss
@import "~@clr/ui/src/main.scss";
```

Dark theme:
```scss
@import "~@clr/ui/src/dark-theme.scss";
```

## PS

* [React Boilerplate by rokoroku](https://github.com/rokoroku/react-redux-typescript-boilerplate) is great
* 17.03.2018 - Webpack 4 + Storybook doesnt work together, 💖 open source.