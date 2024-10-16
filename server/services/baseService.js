import { globals } from "../globals"

export class BaseEntityService {
    constructor(tableName) {
        this._tableName = tableName
    }
    get tableName() {
        return this._tableName
    }
    get globals() {
        return globals
    }
    async create(entity) {
        return await globals.db.create(this._tableName, entity)
    }
    async update(id, entity) {
        return await globals.db.update(this._tableName, id, entity)
    }
    async getByID(id, options={}) {
        return await globals.db.getByID(this._tableName, id, options)
    }
    async delete(id) {
        return await globals.db.delete(this._tableName, id)
    }
    async deleteAll() {
        return await globals.db.deleteAll(this._tableName)
    }
    async findAll(options) {
        return await globals.db.findAll(this._tableName, options)
    }
    async count(orgID) {
        return await globals.db.count(this._tableName, orgID)
    }
}