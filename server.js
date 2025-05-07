const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const companyRouter = require("./routes/company.routes");
const branchRouter = require("./routes/branch.routes");
const shedRouter = require("./routes/shed.routes");
const machineBrandRouter = require("./routes/machine-brand.routes");
const departmentRouter = require("./routes/department.routes");
const designationRouter = require("./routes/designation.routes");
const employeeRouter = require("./routes/employee.routes");
const app = express();
app.use(cors());
const auth = require("./services/authentication");
app.get('/', (req, res) => {
    res.send("Hello World");
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/company",auth.authenticateToken, companyRouter);
app.use("/api/v1/branch",auth.authenticateToken, branchRouter);
app.use("/api/v1/shed",auth.authenticateToken, shedRouter);
app.use("/api/v1/department",auth.authenticateToken, departmentRouter);
app.use("/api/v1/designation",auth.authenticateToken, designationRouter);
app.use("/api/v1/machine-brand",auth.authenticateToken, machineBrandRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

module.exports = app;
