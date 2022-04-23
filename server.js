const express = require("express");
const app = express();
const { read, write } = require("./utils/FS");

app.use(express.json());

const cars = read("cars.json");
const customers = read("customers.json");
const showcars = read("showcars.json");

app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  const foundCustomers = customers.filter((e) => e.id == id);
  if (!foundCustomers) {
    res.sendStatus(401);
  }
  res.send(foundCustomers);
});

app.get("/customers", (req, res) => {
  res.send(customers);
});

app.get("/cars/:id", (req, res) => {
  const { id } = req.params;
  const foundCars = cars.filter((e) => {
    if (e.id == id)
      return (e.customers = customers.filter((c) => c.car == e.id));
  });
  foundCars.filter((e) => delete e.showcars_id);
  customers.filter((d) => delete d.car);
  res.send(foundCars);
});

app.get("/cars", (req, res) => {
  const { id } = req.params;
  const foundCars = cars.filter(
    (e) => (e.customers = customers.filter((c) => c.car == e.id))
  );
  foundCars.filter((e) => delete e.showcars_id);
  customers.filter((d) => delete d.car);
  res.send(foundCars);
});

app.get("/showcars/:id", (req, res) => {
  const { id } = req.params;
  const foundCars = showcars.filter((e) => {
    if (e.id == id)
      return (e.cars = cars.filter((c) => c.car == e.showcars_id));
  });
  foundCars.filter((e) => delete e.showcars_id);
  res.send(foundCars);
});

app.get("/showcars", (req, res) => {
  const foundCars = showcars.filter(
    (e) => (e.cars = cars.filter((c) => c.car == e.showcars_id))
  );
  cars.filter((e) => delete e.showcars_id);
  res.send(foundCars);
});

app.post("/customers", (req, res) => {
  const { id, name, car } = req.body;
  customers.push({ id, name, car });

  write("customers.json", customers);

  res.send("creted");
});

app.post("/cars", (req, res) => {
  const { id, name, color } = req.body;
  cars.push({ id, name, color });

  write("cars.json", cars);

  res.send("creted");
});

app.post("/showcars", (req, res) => {
  const { id, adress, showcars_id } = req.body;
  showcars.push({ id, adress, showcars_id });

  write("showCars.json", showcars);

  res.send("creted");
});

app.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  const { name, car } = req.body;
  const foundCustomers = customers.find((f) => (f.id = id));

  foundCustomers.name = name || foundCustomers.name;
  foundCustomers.car = car || foundCustomers.car;
  write("customers.json", customers);

  res.send("OK");
});

app.put("/cars/:id", (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const foundCars = cars.find((f) => (f.id = id));

  foundCars.name = name || foundCars.name;
  foundCars.color = color || foundCars.color;
  write("cars.json", cars);

  res.send("OK");
});

app.put("/showcars/:id", (req, res) => {
  const { id } = req.params;
  const { adress } = req.body;
  const foundcars = showcars.find((f) => (f.id = id));

  foundcars.adress = adress || foundcars.adress;
  write("showcars.json", showcars);

  res.send("OK");
});

app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  const deleted = cars.findIndex((d) => d.id == id);
  cars.splice(deleted, 1);

  write("cars.json", cars);
  res.send("deleted");
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  const deleted = customers.findIndex((d) => d.id == id);
  customers.splice(deleted, 1);

  write("customers.json", customers);
  res.send("deleted");
});

app.delete("/showcars/:id", (req, res) => {
  const { id } = req.params;
  const deleted = showcars.findIndex((d) => d.id == id);
  showcars.splice(deleted, 1);

  write("showcars.json", showcars);
  res.send("deleted");
});

app.listen(9000, console.log("runig", 1000));
