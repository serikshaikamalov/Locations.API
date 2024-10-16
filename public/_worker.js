import { SimpleORM } from "simple-cloudflare-orm";
import api from "../server/api";
import { globals } from "../server/globals";
import { DB_TABLES, dropTables, runMigrations } from "../server/run-migrations";
import { insertInitialData } from "../server/sql-inserts";

let runCount = 0
async function once(req, env) {
    if (runCount > 0) return
    runCount++
    console.log("Running once method");

    try {
        await runMigrations(env)
    } catch (ex) {
        console.error("once ex:", ex)
    }
}

export default {
    async fetch(req, env, ctx) {
        try {
            const url = new URL(req.url);
            // Create db instance for each request            
            console.log("env.D1: ", env.DB);
            console.log("env.R2_URL: ", env.R2_URL);

            globals.db = new SimpleORM(env.DB, DB_TABLES)

            if (url.pathname.startsWith('/sql/droptables')) {
                const table = url.searchParams.get('table')
                console.log("Dropping existing tables");
                // Drop
                const droppedTables = await dropTables(env, table)
                runCount = 0
                return Response.json({ droppedTables, runCount }, { status: 200 })
            }
            if (url.pathname.startsWith('/sql/inserts')) {
                await insertInitialData()
                return Response.json({ message: 'The initial data are inserted' }, { status: 200 })
            }

            await once(req, env, ctx)

            if (url.pathname.startsWith('/api/')) {
                let res = await api.fetch(req, env, ctx)
                return res
            }
            // Otherwise, serve the static assets.
            // Without this, the Worker will error and no assets will be served.
            return env.ASSETS.fetch(req);
        } catch (ex) {
            console.error('Worker ex: ', ex)
            return new Response("Internal server error", { status: 500 })
        }
    },
}