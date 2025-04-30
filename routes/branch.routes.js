const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT branch_id,branch_code,branch_name_eng,address,city,email,flag FROM BRANCH ORDER BY branch_id DESC";
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
    "SELECT branch_id,branch_code,branch_name_eng,pin_code,address,city,email,flag FROM BRANCH WHERE branch_id =? ORDER BY branch_id DESC";
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
  const branch = req.body;
  const query = "SELECT branch_code FROM BRANCH WHERE branch_code=?";
  dbConn.query(query, [branch.branch_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Branch Code already exists." });
      }
      else{
        const query = "INSERT INTO BRANCH(branch_code,branch_name_eng,branch_name_lang,address,city,pin_code,email,flag)VALUES(?,?,?,?,?,?,?,1)";
        dbConn.query(query,[branch.branch_code,branch.branch_name_eng,branch.branch_name_eng,branch.address,branch.city,branch.pin_code,branch.email],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"Branch Details Saved Successfully."})
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
    const branch = req.body;
    dbConn.query(
        "UPDATE BRANCH SET branch_code=?,branch_name_eng=?,address=?,city=?,pin_code=?,email=? WHERE branch_id = ?",
        [
          branch.branch_code,
          branch.branch_name_eng,
          branch.address,
          branch.city,
          branch.pin_code,
          branch.email,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Branch Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const branch = req.body;
    dbConn.query(
        "UPDATE BRANCH SET flag=? WHERE branch_id = ?",
        [
          branch.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Branch Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM BRANCH WHERE branch_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Branch Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
