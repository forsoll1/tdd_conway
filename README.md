# Javascript project for Conway's Game of Life

This is an application that simulates Conway's Game of Life. It reads a Game of Life pattern from an RLE-format file, asks for the amount of generations that pattern "lives" and outputs the resulting RLE pattern to console. 

## How to use

1. Add the RLE file you wish to use to /patterns directory
2. Run "node app.mjs" at root
3. The application asks for the pattern file name and the number of generations the game simulates
4. The resulting RLE pattern is outputed to console

## Prerequisites

You'll need a recent [Node.js](https://nodejs.org/) version. Then download this project's dependencies with:

    npm install

## Developing

Run tests once

    npm run test

Run tests continuously

    npm run autotest
