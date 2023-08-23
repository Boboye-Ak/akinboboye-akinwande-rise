export const isPasswordValid = (password: string): boolean => {
    // Regular expressions to match the required criteria
    const lengthRegex = /.{8,}/ // At least 8 characters
    const capitalLetterRegex = /[A-Z]/ // At least one capital letter
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/ // At least one special character
    const numberRegex = /\d/ // At least one number

    // Test the password against each regex
    const isLengthValid = lengthRegex.test(password)
    const isCapitalLetterValid = capitalLetterRegex.test(password)
    const isSpecialCharacterValid = specialCharacterRegex.test(password)
    const isNumberValid = numberRegex.test(password)

    // Check if all criteria are met
    if (isLengthValid && isCapitalLetterValid && isSpecialCharacterValid && isNumberValid) {
        return true // Password is valid
    } else {
        return false // Password is invalid
    }
}
