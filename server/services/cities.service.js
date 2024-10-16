import { globals } from "../globals";
import { BaseEntityService } from './baseService'

class CitiesService extends BaseEntityService {
  constructor(tableName) {
    super(tableName)
  }

  async findAll(stateCode) {
    if (stateCode) {
      const { results } = await globals.db.prepare(`SELECT * FROM ${super.tableName} WHERE state_code=?`)
        .bind(stateCode)
        .all();
      return results
    }

    // All cities
    const { results } = await globals.db.prepare(`SELECT * FROM ${super.tableName}`)
      .all();
    return results
  }
}

export default new CitiesService("cities");
