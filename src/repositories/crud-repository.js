class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async fetchById(id) {
        const response = await this.model.findById(id);
        return response;
    }
}

module.exports = CrudRepository;
