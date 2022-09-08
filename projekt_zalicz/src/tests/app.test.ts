import request from 'supertest';
const baseURL = "http://localhost:3000"

describe("GET /", () => {

    it("should return 200 from application main URL", async () => {
      const response = await request(baseURL).get("/");
      expect(response.statusCode).toBe(200);
    });

});