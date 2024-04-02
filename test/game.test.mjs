import { describe, test, beforeEach, afterEach, beforeAll } from "vitest";
import { expect } from "chai";
import { rleHandler } from "../src/rleHandler.mjs"
import { game } from "../src/game.mjs"
const fs = require("fs")

let filePath = "./patterns/foo.txt"
let fileName = "foo.txt"

function createFile(content){
  try {
    fs.writeFileSync(filePath, content)
  } catch (error) {
    console.log(error)
  }
}

describe("Tests for printing out RLE pattern", () => {

    let newGame;
    beforeEach(() => {
        newGame = new game()
    })

    test("Turn point coordinates back into RLE pattern line", () => {
        let coordinates = [[0,0],[1,0],[0,1],[1,1]]
        let result = newGame.patternFromCoordinates(coordinates)
        expect(result).to.equal("2o$2o!")
    })

    test("Return rule in as a string", () => {
        let parsedRule = {B:[3], S:[2,3]}
        let result = newGame.ruleToString(parsedRule)
        expect(result).to.equal("rule = B3/S23")
    })

    test("Return XY header string", () => {
        let coordinates = [[0,0],[1,0],[0,1],[1,1]]
        let result = newGame.XYToString(coordinates)
        expect(result).to.equal("x = 2, y = 2")
    })
})

describe("Tests for game mechanics", () => {

    let newGame;

    beforeAll(() => {
        try {
          fs.unlinkSync(filePath)
        } catch (error) {}
    })

    beforeEach(() => {
        newGame = new game()
    })    
    
    afterEach(() => {
        try {
            fs.unlinkSync(filePath)
        } catch (error) {}
    })

    test("Game gets rules and coordinates from RLE file", () => {
        let msg = 
`x = 1, y = 1, rule = B3/S23
o!`
        createFile(msg)
        const testGame = new game(fileName)
        expect(testGame.coordinates).to.deep.equal([[0,0]])
        expect(testGame.rules).to.deep.equal({B:[3], S:[2,3]})
    })

    test("tick makes single point pattern disappear", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0]]
        newGame.tick()
        expect(newGame.coordinates).to.deep.equal([])
    })

    test("tick doesn't change 2x2 block", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0],[0,1],[1,0],[1,1]]
        newGame.tick()
        expect(newGame.coordinates).to.deep.equal([[0,0],[0,1],[1,0],[1,1]])
    })

    test("tick makes pattern disappear partially", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0],[1,1],[0,2]]
        newGame.tick()
        expect(newGame.coordinates).to.deep.equal([[1,1]])
    })
})
