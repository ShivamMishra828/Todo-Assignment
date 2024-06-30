const CrudRepository = require("./crud-repository");
const { User } = require("../models");

class UserRepository extends CrudRepository {
    constructor() {
        super(User); // Initialize the CrudRepository with the User model
    }

    // Method to fetch a user by their email address
    async getUserByEmail(email) {
        const user = await User.findOne({ email: email }); // Find user by email
        return user; // Return the found user document
    }
}

module.exports = UserRepository;
