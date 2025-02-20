# Love2D for VSCode README

> STILL UPDATING THIS README!

This is a simple auto complete extension for the LOVE 2D game framework. It makes use of the LOVE API written in a lua table from [here](https://github.com/love2d-community/love-api)

* Autocomplete for modules, functions, types, and enums
* Signature suggestions for functions of modules and types
* Ctrl+Alt+D tries to open the Love2D documentation for whatever the cursor is currently on
* Alt+Shift+I tries to open the Love2D documentation for whatever the user entered in the input
* Alt+L launches Love2D in the current directory
* Alt+Shift+L launches Love2D in the current directory with a --debuglog arg

## Requirements

Make sure you add the `love` command to your path / profile with the [following directions](https://love2d.org/wiki/Getting_Started) based on your platform:

## Extension Settings

No settings - planning on putting in ability to change hotkeys

## Known Issues

* **Versions before 0.3.5 may not have the proper dependencies installed for the extension to work, please update if you have an older version.**
* When a function has multiple signatures, if you select anyone but the 1st and try to type a param it will switch back to the first signature.
* Command to launch love expects "love" to be in the path

## Release Notes

### 0.3.6

Realized that I didn't add the proper dependencies to make things work properly, so that's fixed now.

### 0.3.2

Small changes

### 0.3.0

Added hotkey command to launch LOVE 2D from the current directory.

### 0.2.0

Added opening of LOVE 2D documentation

### 0.1.0

Initial release of LOVE-Autocomplete
