import * as readline from 'readline'
import * as fs from 'fs'

export function getFileNameFromUser(){
    let rl = readline.createInterface(process.stdin, process.stdout)
    return new Promise((resolve, reject) => {
        rl.question("Give a file name for a RLE pattern within 'patterns' directory (example: glider.rle): ", (input) => {
            if(input.length === 0){
                reject("User did not give a filename")
            }else if (!fs.existsSync(`./patterns/${input}`)){
                reject("File does not exist in /patterns directory")
            }else{
                resolve(input)
            }
            rl.close()
        })
    })
}

export function getNumberOfGenerationsFromUser(){
    let rl = readline.createInterface(process.stdin, process.stdout)
    return new Promise((resolve, reject) => {
        rl.question("Give a number of generations to simulate (must be a positive integer): ", (input) => {
            const nonNumeric = input.match(/[^0-9]/g)
            if(input.length === 0 || nonNumeric){
                reject("Did not input a number >= 0")
            }else{
                resolve(parseInt(input))
            }
            rl.close()
        })
    })
}