const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const baseUrl = "/api";
const morgan = require('morgan')

const paths = {
  admin: "/admin",
  client: "/client",
  products: "/products",
  auth: "/auth"
};

app.use(express.json());
app.use(morgan('dev'))
app.use(cors());


app.use(baseUrl + paths.auth,require("../src/routes/AuthRoutes"))
app.use(baseUrl + paths.admin, require("../src/routes/AdminRoutes"));
app.use(baseUrl + paths.client, require("../src/routes/ClientRoutes"));
app.use(baseUrl + paths.products, require("../src/routes/ProductsRoutes"));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
