import { describe, test, beforeEach, afterEach, beforeAll, vi } from "vitest";
import { expect } from "chai";
import { getFileNameFromUser } from "../src/UI.mjs"
const fs = require("fs")

let filePath = "./patterns/foo.txt"
let fileName = "foo.txt"

const mockInterface = {
    question: vi.fn(),
    close: vi.fn()
}

vi.mock('readline', () => ({
    createInterface: vi.fn( () => mockInterface)
}))

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
    
    test("Empty input returns error", async () => {
        userInput = ""
        mockInterface.question.mockImplementationOnce((question, cb) => { cb(userInput) })
        await expect(getFileNameFromUser()).rejects.toBe("User did not give a filename")
    })

    test("Incorrect filename returns error", async () => {
        userInput = "doesnotexist.rle"
        mockInterface.question.mockImplementationOnce((question, cb) => { cb(userInput) })
        await expect(getFileNameFromUser()).rejects.toBe("File does not exist in /patterns directory")
    })

    test("Valid filename input returns filename", async () => {
        try {
            fs.writeFileSync(filePath, "test")
        } catch (error) {
            console.log(error)
        }
        mockInterface.question.mockImplementationOnce((question, cb) => { cb(fileName) })
        let result = await getFileNameFromUser()
        try {
            fs.unlinkSync(filePath)
        } catch (error) {}
        expect(result).to.equal(fileName)
    })
})