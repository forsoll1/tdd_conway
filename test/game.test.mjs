import { describe, test, beforeEach, afterEach, beforeAll } from "vitest";
import { expect } from "chai";
import { rleHandler } from "../src/rleHandler.mjs"
import { game } from "../src/game.mjs"
const fs = require("fs")

describe("Tests for Conway's Game of Life mechanics", () => {

    let newGame;

    test("Turn point coordinates back into RLE pattern line", () => {
        let coordinates = [[0,0],[1,0],[0,1],[1,1]]
        newGame = new game()
        let result = newGame.patternFromCoordinates(coordinates)
        expect(result).to.equal("2o$2o!")
    })

    test("Return rule in as a string", () => {
        let parsedRule = {B:[3], S:[2,3]}
        newGame = new game()
        let result = newGame.ruleToString(parsedRule)
        expect(result).to.equal("rule = B3/S23")
    })
})
