const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);

it("gets all persons", async done => {
  return request.get("/api/persons").then(res => {
    expect(res.status).toBe(200);
  });
});
