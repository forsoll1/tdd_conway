import { rleHandler } from "./rleHandler.mjs"

export class game{

    constructor(fileName = null){
        if(fileName){
            const rle = new rleHandler(fileName)
            this.rules = rle.rules
            this.coordinates = rle.coordinates
        }else{
            this.coordinates = []
        }
    }

    tick(){
        let newCoordinates = []
        let emptySpacesAroundPoints = []
        
        for (const i of this.coordinates) {
            let pointsAround = 0
            let spacesAroundPoint = this.getSpacesAroundPoint(i)
            for (const j of spacesAroundPoint) {
                if(this.coordinates.findIndex(point => point[0] === j[0] && point[1] === j[1]) === -1){
                    emptySpacesAroundPoints.findIndex(point => point[0] === j[0] && point[1] === j[1]) === -1 ? emptySpacesAroundPoints.push(j) : {}
                }else{ 
                    pointsAround += 1
                }
            }
            if (this.rules.S.includes(pointsAround)){
                newCoordinates.push(i)
            }
        }

        for (const i of emptySpacesAroundPoints) {
            let pointsAround = 0
            let spacesAroundPoint = this.getSpacesAroundPoint(i)
            for (const j of spacesAroundPoint) {
                this.coordinates.findIndex(point => point[0] === j[0] && point[1] === j[1]) === -1 ? {} : pointsAround += 1
            }
            if (this.rules.B.includes(pointsAround)){
                newCoordinates.push(i)
            }
        }
        this.coordinates = newCoordinates
    }

    getSpacesAroundPoint(point){
        let x = point[0]
        let y = point[1]
        let spacesAroundPoint = [[x-1,y-1],[x,y-1],[x+1,y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]]
        return spacesAroundPoint
    }

    patternFromCoordinates(coordinates){
        let XY = this.getMinMax(coordinates)
        
        let patternChars = []
        for (let y = XY.minY; y < XY.maxY + 1; y++) {
            let rowChars = ["$"]
            for (let x = XY.maxX; x > XY.minX - 1; x--) {
                if(coordinates.findIndex(point => point[0] === x && point[1] === y) !== -1){
                    rowChars.unshift("o")
                }else if(rowChars.length > 1){
                    rowChars.unshift("b")
                }
            }
            patternChars = patternChars.concat(rowChars)
        }
        patternChars[patternChars.length-1] = "!"
        
        let tempArr = []
        for (const i of patternChars) {
            if(tempArr.length === 0){
                tempArr.push([i])
                continue
            }
            if(tempArr[tempArr.length-1][0] === i){
                tempArr[tempArr.length-1].push(i)
                continue
            }
            tempArr.push([i])
        }
        
        let result = [""]
        for (const i of tempArr) {
            let newString = ""
            if(i.length > 1){
                newString = `${i.length}${i[0]}`
            }else{
                newString = i[0]
            }
            if(result[result.length-1].length + newString.length <= 70){
                result[result.length-1] += newString
            }else{
                result.push(newString)
            }
        }
        return result.join("\n")
    }

    ruleToString(parsedRule){
        let ruleString = `rule = B${parsedRule.B.join("")}/S${parsedRule.S.join("")}`
        return ruleString
    }

    XYToString(coordinates){
        let XY = this.getMinMax(coordinates)
        return `x = ${XY.maxX - XY.minX + 1}, y = ${XY.maxY - XY.minY + 1},`
    }

    getMinMax(coordinates){
        let minY = coordinates.map((val => val[1])).reduce((a,b) => Math.min(a,b))
        let minX = coordinates.map((val => val[0])).reduce((a,b) => Math.min(a,b))
        let maxY = coordinates.map((val => val[1])).reduce((a,b) => Math.max(a,b))
        let maxX = coordinates.map((val => val[0])).reduce((a,b) => Math.max(a,b))
        return {minY: minY, minX: minX, maxY: maxY, maxX: maxX}
    }

    toString(){
        let XY = this.XYToString(this.coordinates)
        let rules = this.ruleToString(this.rules)
        let pattern = this.patternFromCoordinates(this.coordinates)
        let result = `${XY} ${rules}\n${pattern}`
        return result
    }
}