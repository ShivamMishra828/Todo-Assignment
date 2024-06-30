class CrudRepository {
    constructor(model) {
        this.model = model; // Initialize with the Mongoose model for the repository
    }

    // Method to create a new document in the database
    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    // Method to fetch a document by its ID from the database
    async fetchById(id) {
        const response = await this.model.findById(id);
        return response;
    }

    // Method to update a document by its ID in the database
    async update(id, data) {
        const response = await this.model.findByIdAndUpdate(
            id,
            { $set: data }, // Update fields specified in the `data` object
            { new: true } // Return the updated document instead of the old one
        );
        return response;
    }

    // Method to create multiple documents in the database
    async createMany(data) {
        const response = await this.model.insertMany(data);
        return response;
    }
}

module.exports = CrudRepository;
