import { Hono } from "hono";
import { cors } from "hono/cors"
import citiesController from "./controller/cities.controller";

const api = new Hono().basePath('/api')

api.use("/*", cors())

api.get('/ping', (c) => {
    return c.json({ message: 'Pong' })
})

// Cities
api.get("/cities", citiesController.getAll)

// Catch exception    
api.onError(async (ex, c) => {
    console.error("Catch ex: ", ex)
    return c.json({ error: { message: ex.message, status: ex.status || 400 } }, ex.status || 400)
})



export default api