import { describe, test, beforeEach, afterEach, beforeAll, vi } from "vitest";
import { expect } from "chai";
import { getFileNameFromUser } from "../src/UI.mjs"

const mockInterface = {
    question: vi.fn(),
    close: vi.fn()
}

vi.mock('readline', () => ({
    createInterface: vi.fn( () => mockInterface)
}))

describe("Tests for user interaction", () => {
    let userInput;
    
    test("Empty input returns error", async () => {
        userInput = ""
        mockInterface.question.mockImplementationOnce((question, cb) => { cb(userInput) })
        await expect(getFileNameFromUser()).rejects.toBe("User did not give a filename")
    })
})