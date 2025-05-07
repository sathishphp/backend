const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT * FROM department ORDER BY department_id DESC";
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
    "SELECT * FROM department WHERE department_id =? ORDER BY department_id DESC";
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
  const department = req.body;
  const query = "SELECT department_code FROM department WHERE department_code=?";
  dbConn.query(query, [department.department_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Department Code already exists." });
      }
      else{
        const query = "INSERT INTO department(department_code,department_name_eng,department_name_lang,flag)VALUES(?,?,?,1)";
        dbConn.query(query,[department.department_code,department.department_name_eng,department.department_name_eng],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"department Details Saved Successfully."})
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
    const department = req.body;
    dbConn.query(
        "UPDATE department SET department_code=?,department_name_eng=?,department_name_lang=? WHERE department_id = ?",
        [
          department.department_code,
          department.department_name_eng,
          department.department_name_lang,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Department Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const department = req.body;
    dbConn.query(
        "UPDATE department SET flag=? WHERE department_id = ?",
        [
          department.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Department Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM department WHERE department_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Department Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
