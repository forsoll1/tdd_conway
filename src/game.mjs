export class game{


    patternFromCoordinates(coordinates){
        let minY = coordinates.map((val => val[1])).reduce((a,b) => Math.min(a,b))
        let minX = coordinates.map((val => val[0])).reduce((a,b) => Math.min(a,b))
        let maxY = coordinates.map((val => val[1])).reduce((a,b) => Math.max(a,b))
        let maxX = coordinates.map((val => val[0])).reduce((a,b) => Math.max(a,b))
        
        let patternChars = []
        for (let y = minY; y < maxY + 1; y++) {
            let rowChars = ["$"]
            for (let x = maxX; x > minX - 1; x--) {
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
        
        let result = ""
        for (const i of tempArr) {
            let newString = ""
            if(i.length > 1){
                newString = `${i.length}${i[0]}`
            }else{
                newString = i[0]
            }
            result += newString
        }
        return result
    }

    ruleToString(parsedRule){
        // "rule = B3/S23" {B:[3], S:[2,3]}
        let ruleString = `rule = B${parsedRule.B.join("")}/S${parsedRule.S.join("")}`
        return ruleString
    }
}