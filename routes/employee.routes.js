const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const dbConn = require("../connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../services/authentication");

router.post("/signup", (req, res) => {
  let employee = req.body;
  console.log(employee);
  const query = "SELECT * FROM employee WHERE employee_code=?";
  dbConn.query(query, [employee.employee_code], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        const query =
          "INSERT INTO employee(branch_id,department_id,employee_code,employee_name_eng,employee_name_lang,designation_id,user_level,password,confirm_password,salary,flag)VALUES(?,?,?,?,?,?,?,?,?,?,1)";
        dbConn.query(
          query,
          [
            employee.branch_id,
            employee.department_id,
            employee.employee_code,
            employee.employee_name_eng,
            employee.employee_name_eng,
            employee.designation_id,
            employee.user_level,
            employee.password,
            employee.confirm_password,
            employee.salary,
          ],
          (err, results) => {
            if (!err) {
              return res.status(200).json({ message: "Successfully Created" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const employee = req.body;
  const query =
    "SELECT employee_id,employee_code,employee_name_eng FROM employee WHERE employee_code=? AND password=?";
  dbConn.query(
    query,
    [employee.employee_code, employee.password],
    (err, results) => {
      if (!err) {
        if (results.length === 1) {
          const response = {
            employee_code: results[0].employee_code,
            employee_name_eng: results[0].employee_name_eng,
          };
          const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
            expiresIn: "8h",
          });
          const refreshToken = jwt.sign(response, process.env.REFRESH_TOKEN, {
            expiresIn: "1d",
          });
          // Assigning refresh token in http-only cookie
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });

          results[0]["access_token"] = accessToken;
          results[0]["refresh_token"] = refreshToken;
          return res.status(200).json(results[0]);
        }
        if (results.length === 0) {
          return res
            .status(400)
            .json({ message: "Invalid Username / Password." });
        }
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.post('/refresh-token', (req, res) => {
  if (req.cookies?.jwt) {

      // Destructuring refreshToken from cookie
      const refreshToken = req.cookies.jwt;

      // Verifying refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN,
          (err, decoded) => {
              if (err) {

                  // Wrong Refesh Token
                  return res.status(406).json({ message: 'Unauthorized' });
              }
              else {
                  // Correct token we send a new access token
                  const accessToken = jwt.sign({
                      username: userCredentials.username,
                      email: userCredentials.email
                  }, process.env.ACCESS_TOKEN_SECRET, {
                      expiresIn: '10m'
                  });
                  return res.json({ accessToken });
              }
          })
  } else {
      return res.status(406).json({ message: 'Unauthorized' });
  }
})

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: true });
});

router.get("/list", (req, res) => {
  const query =
    "SELECT branch.branch_name_eng as branch,department.department_name_eng as department,designation.designation_name_eng as designation,employee.* FROM employee JOIN branch ON branch.branch_id = employee.branch_id JOIN department ON department.department_id = employee.department_id JOIN designation ON designation.designation_id = employee.designation_id  ORDER BY employee_id ASC";
  dbConn.query(query, (err, results) => {
    if (!err) {
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).json({ message: "No Records Found." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/:id", (req, res) => {
  //const employee = res.body;
  const query =
    "SELECT branch.branch_name_eng as branch,department.department_name_eng as department,designation.designation_name_eng as designation,employee.branch_id,employee.department_id,employee.designation_id,employee.employee_id,employee.employee_name_eng,employee.user_level FROM employee JOIN branch ON branch.branch_id = employee.branch_id JOIN department ON department.department_id = employee.department_id JOIN designation ON designation.designation_id = employee.designation_id WHERE employee_id=?";
  dbConn.query(query, [req.params.id], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(200).json({ message: "No Records Found." });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.put("/update/:id", (req, res) => {
  const employee = req.body;
  const query =
    "UPDATE employee SET branch_id=?,department_id=?,employee_code=?,employee_name_eng=?,employee_name_lang=?,designation_id=?,user_level=?,salary=?,password=?,confirm_password=? WHERE employee_id=?";
  dbConn.query(
    query,
    [
      employee.branch_id,
      employee.department_id,
      employee.employee_code,
      employee.employee_name_eng,
      employee.employee_name_eng,
      employee.designation_id,
      employee.user_level,
      employee.salary,
      employee.password,
      employee.confirm_password,
      req.params.id,
    ],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(400).json({ message: "No Records Updated" });
        }
        return res
          .status(200)
          .json({ message: "Employee Updated Successfully." });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.put("/update-status/:id", (req, res) => {
  const employee = req.body;
  const query = "UPDATE employee SET flag=? WHERE employee_id = ?";
  dbConn.query(query, [employee.flag, req.params.id], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Status Updated Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const employee = req.body;
  const query = "DELETE FROM employee WHERE employee_id = ?";
  dbConn.query(query, [req.params.id], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Employee Deleted Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
