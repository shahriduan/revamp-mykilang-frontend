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
}