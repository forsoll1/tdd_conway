import { describe, test, beforeEach, afterEach, beforeAll, vi, afterAll } from "vitest";
import { expect } from "chai";
import { getFileNameFromUser, getNumberOfGenerationsFromUser } from "../src/UI.mjs"
import { game } from "../src/game.mjs";
const fs = require("fs")

let filePath = "./patterns/foo.txt"
let fileName = "foo.txt"
let generations = "15"

const mockInterface = {
    question: vi.fn(),
    close: vi.fn()
}

vi.mock('readline', () => ({
    createInterface: vi.fn( () => mockInterface)
}))

let initialPattern =`#N moldon43p54.rle
#C https://conwaylife.com/wiki/43P54
#C https://www.conwaylife.com/patterns/moldon43p54.rle
x = 29, y = 19, rule = B3/S23
8bo$8b3o7b2o$11bo6b2o$10b2o2$3b2o22b2o$4bo22bo$4bobo10b3o5bobo$5b2o10b
o7b2o$17b2o2$b2o$o2bo$obo21bo$bob2o19b2o$2b3o3b2o14b2o$3b2o3bo16bo$9b
o$8b2o!`

let endPattern = `x = 29, y = 19, rule = B3/S23
8bo$8b3o7b2o$11bo5bo2bo$10b2o6b2o2$3b2o8b4o10b2o$4bo7b2ob2o10bo$4bobo
4b2o2bo2bo6bobo$5b2o5bo3b3o6b2o$13bo2bo2bo$17bobo$b2o14b2o$o2bo$obo2b
o18b2o$bo21bo$2b2obo2b2o16bo$4bo3bo15b2o$9bo$8b2o!
`

describe("Tests for user interaction", () => {
    let userInput;

    afterEach(()=> {
        vi.restoreAllMocks()
    })

    beforeAll(() => {
        try {
          fs.unlinkSync(filePath)
        } catch (error) {}
    })

    afterAll(() => {
        try {
            fs.unlinkSync(filePath)
          } catch (error) {}
    })
    
    test("Test project functionality", async () => {
        try {
            fs.writeFileSync(filePath, initialPattern)
        } catch (error) {
            console.log(error)
        }

        mockInterface.question.mockImplementationOnce((question, cb) => { cb(fileName) })
        let getFileName = await getFileNameFromUser()
        vi.restoreAllMocks()
        mockInterface.question.mockImplementationOnce((question, cb) => { cb(generations) })
        let numberOfGenertaions = await getNumberOfGenerationsFromUser()

        const newGame = new game(getFileName)
        for (let i = 0; i < numberOfGenertaions; i++) {
            newGame.tick()
        }

        let result = newGame.toString()
        expect(result.replace(/\s/g,"")).to.equal(endPattern.replace(/\s/g,""))
    })
})