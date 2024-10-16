import { globals } from './globals'
import { Migrations } from './migrations'

const countriesColumns = {
    "id": 'text PRIMARY KEY',    
    "currency": 'text',
    'currency_name': 'text',
    currency_symbol: 'text',
    latitude: 'text',
    longitute: 'text',
    name: 'text',
    iso2: 'text',
    iso3: 'text',
    native: 'text',
    phone_code: 'text',
    region: 'text',
    region_id: 'text',
    subregion: 'text',
    subregion_id: 'text'
}
const statesColumns = {
    "id": 'text PRIMARY KEY',    
    "country_code": 'text',
    'country_id': 'text',
    country_name: 'text',
    latitude: 'text',
    longitute: 'text',
    name: 'text',
    state_code: 'text',
    type: 'text' 
}
const citiesColumns = {
    "id": 'text PRIMARY KEY',    
    "name": 'text',
    "state_id": 'text',
    "state_code": 'text',
    "state_name": 'text',
    "country_id": 'text',
    "country_code": 'text',
    "country_name": 'text',
    "latitude": 'text',
    "longitude": 'text',
    "wikiDataId": 'text'
}

export const tables = [
    {
        table: 'countries',
        columns: countriesColumns
    },
    {
        table: 'states',
        columns: statesColumns
    },
    {
        table: 'cities',
        columns: citiesColumns
    },
]

export const DB_TABLES = Object.fromEntries(tables.map(x => [x.table, x.columns]))

export async function runMigrations(env) { 
    let migrations = new Migrations(env.DB)

    migrations.add(createSQLTable('countries', DB_TABLES['countries']))
    migrations.add(createSQLTable('states', DB_TABLES['states']))
    migrations.add(createSQLTable('cities', DB_TABLES['cities']))    
    await migrations.run()
}

/**
 * Please use this script to drop tables
 */
export async function dropTables(env, tablesString) {
    let tablesForDropping = ['migrations']

    if (tablesString == 'all') {
        // Drop all tables
        tablesForDropping = [...tablesForDropping, ...tables.map(x => x.table)]
    } else if (tablesString) {
        const tables = String(tablesString).split(',')
        tablesForDropping.push(...tables)
    }

    Object.values(tablesForDropping).forEach(async t => {
        await env.DB.prepare(
            `DROP TABLE IF EXISTS ${t}`
        ).run()
    })
    console.log("tablesForDropping:", tablesForDropping);

    tablesForDropping = tablesForDropping.map(t => {
        return new Promise((res, rej) => {
            try {
                const promise = globals.db.drop(t)
                res(promise)
            } catch (ex) {
                rej(ex)
            }
        })
    })
    return await Promise.all(tablesForDropping)
}

function createSQLTable(tableName, columns = {}) {
    const columnsSQL = Object.entries(columns).reduce((acc, [k, type]) => {
        return [...acc, `${k} ${type}`]
    }, []).join(',')
    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSQL})`
}