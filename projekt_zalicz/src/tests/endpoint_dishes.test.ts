describe("GET /", () => {

    it("should return 200 from application main URL", async () => {
      const response = await request(baseURL).get("/");
      expect(response.statusCode).toBe(200);
    });

});

describe("POST /", () => {

    const dish = {
        id: crypto.randomUUID(),
        item: "Drink water",
        completed: false,
        Name: "koktail pomarańczowy",
        Price: number,
        Category: string,
    }

    it("should return 200 from application main URL", async () => {
        
      const response = await request(baseURL).post("/").
      expect(response.statusCode).toBe(200);
    });

});