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
    expect(result).to.deep.equal(["x = 3, y = 3, rule = B3/S23", "bob$2bo$3o"])
  })

  test("Correctly read long multiline pattern", () => {
    let msg = 
`#N p64piheptominohassler2.rle
#C https://conwaylife.com/wiki/Figure_eight
#C https://www.conwaylife.com/patterns/p64piheptominohassler2.rle
x = 30, y = 30, rule = B3/S23
2o26b2o$2obo22bob2o$4bo20bo$bo26bo$2bob2o18b2obo$4b2o18b2o2$9b2o8b2o$
9bobo6bobo$11bo6bo$9bobo6bobo$9b2o8b2o7$9b2o8b2o$9bobo6bobo$11bo6bo$9b
obo6bobo$9b2o8b2o2$4b2o18b2o$2bob2o18b2obo$bo26bo$4bo20bo$2obo22bob2o$
2o26b2o!`
    createFile(msg)
    let data = rle.readFile(fileName)
    let result = rle.removeUselessLines(data)
    expect(result).to.deep.equal(["x = 30, y = 30, rule = B3/S23", "2o26b2o$2obo22bob2o$4bo20bo$bo26bo$2bob2o18b2obo$4b2o18b2o2$9b2o8b2o$9bobo6bobo$11bo6bo$9bobo6bobo$9b2o8b2o7$9b2o8b2o$9bobo6bobo$11bo6bo$9bobo6bobo$9b2o8b2o2$4b2o18b2o$2bob2o18b2obo$bo26bo$4bo20bo$2obo22bob2o$2o26b2o"])
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
