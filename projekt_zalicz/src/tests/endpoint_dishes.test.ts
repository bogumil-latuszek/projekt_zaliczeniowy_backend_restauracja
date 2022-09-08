import request from "supertest"
const baseURL = "http://localhost:3000"


//czy wszystkie testy mogą mieć te same nazwy
//dlaczego zamiast test jest it
// dawać afterall żeby jeden test nie przeszkadzał kolejnemu?
//! pamiętaj żeby odpalać je przez osobny powershell po uruchomieniu start

describe("GET /", () => {

    it("should return 200 from application main URL", async () => {
      const response = await request(baseURL).get("/");
      expect(response.statusCode).toBe(200);
    });

});

describe("POST /", () => {

    const dish = {
        Name: "koktail pomarańczowy",
        Price: 7,
        Category: "desery",
    }

    it("should return 200 from application main URL", async () => {
        
      const response = await request(baseURL).post("/").send(dish);
      expect(response.statusCode).toBe(200);
    });

});

describe("PUT /", () => {
    //assume
    const dish1 = {
        Name: "koktail pomarańczowy",
        Price: 7,
        Category: "desery",
    }
    const dish2 = {
        Name: "koktail jabłkowy",
        Price: 5,
        Category: "desery",
    }
    //act

    it("should return 200 from application main URL", async () => {
      let first_id = await request(baseURL).post("/").send(dish1);
      const response = await request(baseURL).put("/").send(dish2);
      expect(response.statusCode).toBe(200);
      expect(response.)
    });

});