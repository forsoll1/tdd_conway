import { describe, test, beforeEach, afterEach, beforeAll } from "vitest";
import { expect } from "chai";
import { rleHandler } from "../src/rleHandler.mjs"
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


describe("File reading", () => {
  let rle;

  beforeEach(()=>{
    rle = new rleHandler()
  })

  beforeAll(() => {
    try {
      fs.unlinkSync(filePath)
    } catch (error) {}
  })

  afterEach(() => {
    try {
      fs.unlinkSync(filePath)
    } catch (error) {}
  })

  test("Read file", () => {
    let msg = "Hello!"
    createFile(msg)
    let data = rle.readFile(fileName)
    expect(data).to.equal("Hello!")
  });

  test("Return only useful lines of RLE file", () => {
    let msg = `#N Glider
    #O Richard K. Guy
    #C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
    #C www.conwaylife.com/wiki/index.php?title=Glider
    x = 3, y = 3, rule = B3/S23
    bob$2bo$3o!`
    createFile(msg)
    let data = rle.readFile(fileName)
    let result = rle.removeUselessLines(data)
    expect(result).to.equal(["x = 3, y = 3, rule = B3/S23", "bob$2bo$3o!"])
  })

});
