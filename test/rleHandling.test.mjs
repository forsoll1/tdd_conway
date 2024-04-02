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
    let msg = 
`#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!
IGNORELINE
IGNORELINE2`
    createFile(msg)
    let data = rle.readFile(fileName)
    let result = rle.removeUselessLines(data)
    expect(result).to.deep.equal(["x = 3, y = 3, rule = B3/S23", "bob$2bo$3o!"])
  })

  test("Return 'rules' of RLE file", () => {
    let rleLines = ["x = 3, y = 3, rule = B3/S23", "bob$2bo$3o!"]
    let result = rle.getRuleFromRLELine(rleLines[0])
    expect(result).to.deep.equal({B:[3], S:[2,3]})
  })

  test("Separate pattern code into individual characters", () => {
    let pattern = "bob$2bo$3o!"
    let result = rle.patternAsChars(pattern)
    expect(result).to.deep.equal(["b","o","b","$","b","b","o","$","o","o","o"])
  })

  test("Get XY coordinates for 'o' symbols in pattern", () => {
    let chars = ["b","o","b","$","b","b","o","$","o","o","o"]
    let result = rle.getActiveCoordinates(chars)
    expect(result).to.deep.equal([[1,0],[2,1],[0,2],[1,2],[2,2]])
  })


  test("Give filename to rleHandler constructor, get active coordinates and pattern rules as properties", () => {
    let msg = 
`#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!
IGNORELINE
IGNORELINE2`
    createFile(msg)
    let handler = new rleHandler(fileName)
    expect(handler.coordinates).to.deep.equal([[1,0],[2,1],[0,2],[1,2],[2,2]])
    expect(handler.rules).to.deep.equal({B:[3], S:[2,3]})
  })
});
