export default class UtilityHelper {
    generateRandomString(length, string = 'abcdefghijklmnopqrstuvwxyz') {
        let result = ''
        const charactersLength = string.length
        let counter = 0

        while (counter < length) {
            result += string.charAt(Math.floor(Math.random() * charactersLength))
            counter += 1
        }

        return result
    }

    shuffleString(string) {
        shuffleString = string.split('').sort(() => 0.5 - Math.random()).join('')

        return shuffleString
    }

    autoGeneratePassword() {
        const upperCase = 'ABZDEFGHIJKLMNOPQRSTUVWXYZ'
        const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
        const number = '1234567890'
    
        var randomUpperCase = this.generateRandomString(2, upperCase)
        var randomLowerCase = this.generateRandomString(4, lowerCase)
        var randomNumber = this.generateRandomString(2, number)
    
        var combine = randomUpperCase + randomLowerCase + randomNumber

        return combine
    }

    filterObjectByKeys(object, keysToKeep) {
        var filter = Object.keys(object).reduce((result, key) => {
            if (keysToKeep.includes(key)) {
                result[key] = object[key]
            }
            
            return result;
        }, {})

        return filter
    }

    ucwords(str) {
        var str = str.toLowerCase()
        return str.replace(/\b\w/g, (match) => match.toUpperCase()) // Converts the first character of each word in a string to uppercase.
    }

    generateRandomColorCode() {
        // Generate random values for red, green, and blue components
        var red = Math.floor(Math.random() * 256)
        var green = Math.floor(Math.random() * 256)
        var blue = Math.floor(Math.random() * 256)
      
        var stringRed = red.toString(16)
        var stringGreen = green.toString(16)
        var stringBlue = blue.toString(16)

        stringRed = stringRed.length < 2 ? stringRed + '0' : stringRed
        stringGreen = stringGreen.length < 2 ? stringGreen + '0' : stringGreen
        stringBlue = stringBlue.length < 2 ? stringBlue + '0' : stringBlue

        // Convert the values to hexadecimal and format the color code
        var colorCode = "#" + stringRed + stringGreen + stringBlue

        return colorCode;
    }

    listRandomColorCode(totalColorNeeded) {
        var baseColor = [
            getComputedStyle(document.documentElement).getPropertyValue('--falcon-primary'),
            getComputedStyle(document.documentElement).getPropertyValue('--falcon-info'),
            getComputedStyle(document.documentElement).getPropertyValue('--falcon-success'),
            getComputedStyle(document.documentElement).getPropertyValue('--falcon-danger'),
            getComputedStyle(document.documentElement).getPropertyValue('--falcon-warning'),
        ]

        var totalBaseColor = baseColor.length

        var additionalColor = []

        // Generate additional color code
        if (totalBaseColor < totalColorNeeded) {
            var totalAdditionalColorNeedToCreate = totalColorNeeded - totalBaseColor

            for (let index = 0; index < totalAdditionalColorNeedToCreate; index++) {
                // const element = array[index];
                additionalColor.push(this.generateRandomColorCode())
            }
            
        }

        var combineColor = [
            ...baseColor,
            ...additionalColor
        ]

        return combineColor
    }
}