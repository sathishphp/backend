const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT branch.branch_name_eng as branch,department.department_name_eng as department,designation.* FROM designation JOIN branch ON branch.branch_id = designation.branch_id JOIN department ON department.department_id = designation.department_id ORDER BY designation_id DESC";
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
  const query =
    "SELECT branch.branch_name_eng as branch,department.department_name_eng as department,designation.* FROM designation JOIN branch ON branch.branch_id = designation.branch_id JOIN department ON department.department_id = designation.department_id WHERE designation_id =? ORDER BY designation_id DESC";
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

router.post("/create", (req, res) => {
  const designation = req.body;
  const query = "Select * from DESIGNATION where designation_id = ?";
  dbConn.query(query, [designation.designation_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Designation Code already exists." });
      }
      else{
        const query = "INSERT INTO designation(branch_id,department_id,designation_code,designation_name_eng,flag)VALUES(?,?,?,?,1)";
        dbConn.query(query,[designation.branch_id,designation.department_id,designation.designation_code,designation.designation_name_eng],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"Designation Details Saved Successfully."})
            }else{
                return res.status(500).json(err);
            }
        })
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.put("/update/:id",(req,res)=>{
    const designation = req.body;
    dbConn.query(
        "UPDATE designation SET branch_id=?,department_id=?,designation_code=?,designation_name_eng=? WHERE designation_id = ?",
        [
          designation.branch_id,
          designation.department_id,
          designation.designation_code,
          designation.designation_name_eng,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Designation Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const designation = req.body;
    dbConn.query(
        "UPDATE designation SET flag=? WHERE designation_id = ?",
        [
          designation.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Designation Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM designation WHERE designation_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Designation Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
