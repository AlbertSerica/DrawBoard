# DrawBoard

![Hex.pm](https://img.shields.io/hexpm/l/plug.svg?style=flat-square)![Hex.pm](https://img.shields.io/badge/language-JavaScript-green.svg?style=flat-square)![Hex.pm](https://img.shields.io/badge/build-passing-green.svg?style=flat-square)![Hex.pm](https://img.shields.io/badge/electron-1.7.6-blue.svg?style=flat-square)

## Intro

Written in JavaScript ( with the help of jQuery, which is a terrible choice comparing with using Vue ), built on electron.

WebGL Lib: glfx.js

> Quick-Start:
>
> **IMPORTANT, OTHERWISE THE APP CANNOT BE BUILT. OPENING THE FILE `app.html` IN A WEB BROWSER MAKES NO USE. ** 
>
> To fetch dependencies: `npm install` 
>
> To build the desktop app: `npm start` 

## Features

### Layout

- [x] Fluent, self-adaption
- [x] Material UI
- [x] Design concept: WYSIWYG (  "what you see is what you get" ) 
- [ ] Scaleable Canvas ( zoom in/out the visible area, differ from stretching the image )

### Canvas

- [x] Create a fluent canvas which can adapt its size according to window size
- [x] Create a fixed canvas according to custom settings
- [ ] Drag borders to resize 

### Draw

- [x] Basic shapes ( line, pencil, rectangle, circle, polygons, etc. )
- [x] Erasable
- [x] Pick stroke & fill color
- [x] Edit line width
- [ ] Brush ( like Chinese brush )
- [ ] Text

### Image

- [ ] Basic edit ( rotate, stretch, etc. )
- [ ] Filters ( Gaussian Blur, etc. )
- [ ] Selection ( Like Photoshop, I will try my best to make it functional )

### File

- [x] Open ( New )
- [x] Save ( .png )
- [x] Revoke
- [x] Clear

### Program

- [x] Modularization