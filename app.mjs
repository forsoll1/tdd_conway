import { getFileNameFromUser, getNumberOfGenerationsFromUser } from "./src/UI.mjs"
import { game } from "./src/game.mjs";

let getFileName;
let numberOfGenertaions;
try {
    getFileName = await getFileNameFromUser()
} catch (error) {
    console.log(error)
    process.exit()
}

try {
    numberOfGenertaions = await getNumberOfGenerationsFromUser()
} catch (error) {
    console.log(error)
    process.exit()
}

const newGame = new game(getFileName)
for (let i = 0; i < numberOfGenertaions; i++) {
    newGame.tick()
}

console.log(newGame.toString())