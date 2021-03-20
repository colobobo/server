<div align="center">
<img src="https://raw.githubusercontent.com/colobobo/client/master/src/assets/logo/logo.gif" alt="logo" width="400" />
</div>

<h4 align="center">A multiplayer mobile game with a shared gaming interface across devices</h4>

<h6 align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="build with love" />
  <br/>
  <br/>
  and :
</h6>

<p align="center">
  <a href="https://www.typescriptlang.org/">TypeScript</a> •
  <a href="https://reactjs.org">React</a> •
  <a href="https://redux.js.org/">Redux</a> •
  <a href="https://phaser.io/">Phaser</a> •
  <a href="https://socket.io/">Socket.IO</a> •
  <a href="https://nodejs.org/">Node</a>
</p>

# Colobobo - Server

This repo is the server part of Colobobo project. The other parts :
- [Client](https://github.com/colobobo/client)
- [Library](https://github.com/colobobo/library)

> To run the project locally you will need at least the client part and the server part.

## Installation

1. Set node version with [nvm](https://github.com/nvm-sh/nvm)

   ```bash
   nvm use
   ```
   
2. Install dependencies

   ```bash
   npm install
   ```
   
3. Start server

   ```bash
   npm run watch
   ```

## Use @colobobo/library locally

Follow these steps if you want to use @colobobo/library in development mode.

1. Install and build [@colobobo/library](https://github.com/colobobo/library)

2. Symlink library package folder 

   1. Go to library folder and run :
   
      ```bash
      npm link
      ```
      
   2. Go to server folder and run :
   
      ```bash
      npm link @colobobo/library
      ```

## Build

Compiles and minifies for production

```bash
npm run build
```