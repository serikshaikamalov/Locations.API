import citiesService from "../services/cities.service";

export default new class CitiesController {
    async getAll(c) {
        const { stateCode } = await c.req.query()
        let cities = await citiesService.findAll(stateCode);
        return c.json(cities);
    }
} 