const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hashPassword(input) {
	return bcrypt.hashSync(input, salt)
}

function verifyPassword(input, hash) {
	return bcrypt.compareSync(input, hash);
}

module.exports = {
	hashPassword,
	verifyPassword,
}