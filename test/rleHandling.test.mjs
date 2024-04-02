import { describe, test, beforeEach } from "vitest";
import { expect } from "chai";
import { rleHandler } from "../src/rleHandler.mjs"
const fs = require("fs")


describe("File reading", () => {

  let filePath = "./patterns/foo.txt"
  let fileName = "foo.txt"
  let msg = "Hello!"
  let rle;
  try {
    fs.writeFileSync(filePath, msg)
  } catch (error) {
    console.log(error)
  }
  beforeEach(()=>{
    rle = new rleHandler()
  })

  test("Read file", () => {
    let data = rle.readFile(fileName)
    expect(data).to.equal("Hello!")
  });
});
