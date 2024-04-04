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
        expect(result).to.equal("x = 2, y = 2,")
    })

    test("Return complete RLE string", () => {
        let pattern = 
`x = 1, y = 1, rule = B3/S23
o!`
        newGame.coordinates = [[0,0]]
        newGame.rules = {B:[3], S:[2,3]}
        let result = newGame.toString()
        expect(result).to.equal(pattern)
    })

    test("Result line length can't be over 70", () => {
        let pattern = 
`x = 30, y = 30, rule = B3/S23
2o26b2o$2obo22bob2o$4bo20bo$bo26bo$2bob2o18b2obo$4b2o18b2o2$9b2o8b2o$
9bobo6bobo$11bo6bo$9bobo6bobo$9b2o8b2o7$9b2o8b2o$9bobo6bobo$11bo6bo$9b
obo6bobo$9b2o8b2o2$4b2o18b2o$2bob2o18b2obo$bo26bo$4bo20bo$2obo22bob2o$
2o26b2o!`
        let rle = new rleHandler()
        let rleLines = rle.removeUselessLines(pattern)
        newGame.coordinates = rle.getActiveCoordinates(rle.patternAsChars(rleLines[1]))
        newGame.rules = {B:[3], S:[2,3]}
        let result = newGame.toString()
        let resultLines = result.split("\n")
        let tooLong = false
        console.log('res', resultLines)
        for (const i of resultLines) {
            if(i.length > 70) {tooLong = true}
        }
        expect(tooLong).to.equal(false)
    })

    test("Return correct RLE format string from a complex pattern", () => {
        let pattern = 
`x = 30, y = 30, rule = B3/S23
2o26b2o$2obo22bob2o$4bo20bo$bo26bo$2bob2o18b2obo$4b2o18b2o2$9b2o8b2o$
9bobo6bobo$11bo6bo$9bobo6bobo$9b2o8b2o7$9b2o8b2o$9bobo6bobo$11bo6bo$9b
obo6bobo$9b2o8b2o2$4b2o18b2o$2bob2o18b2obo$bo26bo$4bo20bo$2obo22bob2o$
2o26b2o!`
        let rle = new rleHandler()
        let rleLines = rle.removeUselessLines(pattern)
        newGame.coordinates = rle.getActiveCoordinates(rle.patternAsChars(rleLines[1]))
        newGame.rules = {B:[3], S:[2,3]}
        let result = newGame.toString()
        expect(result).to.equal(pattern)
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
        expect(newGame.coordinates).to.have.deep.members([[0,0],[0,1],[1,0],[1,1]])
    })

    test("tick makes pattern disappear partially", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0],[0,1],[1,0],[1,1],[0,4]]
        newGame.tick()
        expect(newGame.coordinates).to.have.deep.members([[0,0],[0,1],[1,0],[1,1]])
    })

    test("tick creates a new point", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0],[1,1],[0,1]]
        newGame.tick()
        expect(newGame.coordinates).to.have.deep.members([[0,0],[1,1],[0,1],[1,0]])
    })

    test("tick handles a blinker pattern correctly", () => {
        newGame.rules = {B:[3], S:[2,3]}
        newGame.coordinates = [[0,0],[1,0],[2,0]]
        newGame.tick()
        expect(newGame.coordinates).to.have.deep.members([[1,-1],[1,0],[1,1]])
        newGame.tick()
        expect(newGame.coordinates).to.have.deep.members([[0,0],[1,0],[2,0]])
    })

    test("Using a complex pattern, game returns correct RLE string after multiple ticks", () => {
        let msg = 
`x = 50, y = 35, rule = B3/S23
4bo3bo21b3o$3bobobobo20b3o$4b2ob2o21b3o$27b3o$bo9bo15b3o$o11bo14b3o$o
3b2ob2o3bo$b3obobob3o$2b2obobob2o$3b2o3b2o3$21bo$20b3o$19b2ob2o$18b2o
3b2o$19b2ob2o18b2o$6b2o34b2o$6b2o18b2ob2o$25b2o3b2o$26b2ob2o$27b3o$28b
o3$40b2o3b2o$39b2obobob2o$38b3obobob3o$37bo3b2ob2o3bo$20b3o14bo11bo$
20b3o15bo9bo$20b3o$17b3o21b2ob2o$17b3o20bobobobo$17b3o21bo3bo!`
        let end =
`x = 52, y = 37, rule = B3/S23
31b3o$5bo3bo24bo$4bobobobo19bo3bo$5b2ob2o19bobo2bo$27bo2bobo$2b3o5b3o
14bo3bo$bo4bobo4bo13bo$o5bobo5bo13b3o$bo4bobo4bo$b2o3bobo3b2o2$3b3o3b
3o$21b3o$20bo3bo$19bo5bo$18bo3bo3bo$18bo7bo$18bobo6bo15b2o$7b2o10b2o3b
o2bo3b2o10b2o$7b2o15bo6bobo$25bo7bo$25bo3bo3bo$26bo5bo$27bo3bo$28b3o$
40b3o3b3o2$38b2o3bobo3b2o$38bo4bobo4bo$21b3o13bo5bobo5bo$24bo13bo4bob
o4bo$20bo3bo14b3o5b3o$19bobo2bo$17bo2bobo19b2ob2o$17bo3bo19bobobobo$17b
o24bo3bo$18b3o!`
        createFile(msg)
        const testGame = new game(fileName)
        testGame.tick()
        testGame.tick()
        testGame.tick()
        let result = testGame.toString()
        expect(result.replace(/\s/g,"")).to.equal(end.replace(/\s/g,""))
    })
})