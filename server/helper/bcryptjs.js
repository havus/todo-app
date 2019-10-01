const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hashPassword(input) {
    return bcrypt.hashSync(input, salt)
}

module.exports = {
    hashPassword
}