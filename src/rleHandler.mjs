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

    removeUselessLines(fileData){
        fileData = fileData.replace(" ", "")
        let rleLines = fileData.split("\n")
        let counter = -1
        for (let i = 0; i < rleLines.length; i++) {
            if (rleLines[i][0] === "#"){counter = i}    
        }
        if(counter > -1){
            rleLines.splice(0, counter + 1)
        }
        if(rleLines.length > 2){ rleLines.splice(2)
        }
        return rleLines
    }

    getRuleFromRLELine(line){
        let b = line.match(/[Bb]\d+/)
        let s = line.match(/[Ss]\d+/)
        let bNums = b[0].match(/\d/g).map((val) => Number(val))
        let sNums = s[0].match(/\d/g).map((val) => Number(val))
        let result = {B: bNums, S: sNums}
        return result
    }
}