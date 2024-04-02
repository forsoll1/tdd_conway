import * as fs from "fs"

export class rleHandler{


    readFile(fileName){
        try {
            const data = fs.readFileSync(`./patterns/${fileName}`, {encoding: "utf8"})
            return data
        } catch (error) {
            return error
        }
    }
}