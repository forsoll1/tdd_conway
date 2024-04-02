import { describe, test, beforeEach, afterEach, beforeAll } from "vitest";
import { expect } from "chai";
import { rleHandler } from "../src/rleHandler.mjs"
import { game } from "../src/game.mjs"
const fs = require("fs")

describe("Tests for Conway's Game of Life mechanics", () => {

    let newGame;

    test("Turn point coordinates back into RLE pattern line", () => {
        let coordinates = [[1,0],[2,1],[0,2],[1,2],[2,2]]
        newGame = new game()
        let result = newGame.patternFromCoordinates(coordinates)
        expect(result).to.equal("bob$2bo$3o!")
    })
})