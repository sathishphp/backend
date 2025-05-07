const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT a.*,b.branch_name_eng as branch_name FROM `shed` as a JOIN branch as b on a.branch_id = b.branch_id ORDER BY shed_id DESC";
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
    "SELECT a.*,b.branch_name_eng as branch_name FROM `shed` as a JOIN branch as b on a.branch_id = b.branch_id WHERE shed_id =? ORDER BY branch_id DESC";
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
  const shed = req.body;
  const query = "SELECT shed_code FROM SHED WHERE shed_code=?";
  dbConn.query(query, [shed.shed_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Shed Code already exists." });
      }
      else{
        const query = "INSERT INTO SHED(branch_id,shed_code,shed_name_eng,shed_name_lang,flag)VALUES(?,?,?,?,1)";
        dbConn.query(query,[shed.branch_id,shed.shed_code,shed.shed_name_eng,shed.shed_name_eng],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"Shed Details Saved Successfully."})
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
    const shed = req.body;
    dbConn.query(
        "UPDATE SHED SET branch_id=?,shed_code=?,shed_name_eng=?,shed_name_lang=? WHERE shed_id = ?",
        [
          shed.branch_id,
          shed.shed_code,
          shed.shed_name_eng,
          shed.shed_name_eng,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Shed Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const shed = req.body;
    dbConn.query(
        "UPDATE SHED SET flag=? WHERE shed_id = ?",
        [
          shed.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Shed Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM SHED WHERE shed_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Shed Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
