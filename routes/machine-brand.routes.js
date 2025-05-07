const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT a.*,b.department_name_eng as department_name FROM `machine_brand` as a JOIN department as b on a.department_id = b.department_id ORDER BY machine_brand_id DESC";
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
    "SELECT a.*,b.department_name_eng as department_name FROM `machine_brand` as a JOIN department as b on a.department_id = b.department_id WHERE machine_brand_id =? ORDER BY machine_brand_id DESC";
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
  const machine_brand = req.body;
  const query = "SELECT machine_brand_code FROM machine_brand WHERE machine_brand_code=?";
  dbConn.query(query, [machine_brand.machine_brand_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Machine Brand Code already exists." });
      }
      else{
        const query = "INSERT INTO machine_brand(department_id,machine_brand_code,machine_brand_name_eng,machine_brand_name_lang,flag)VALUES(?,?,?,?,1)";
        dbConn.query(query,[machine_brand.department_id,machine_brand.machine_brand_code,machine_brand.machine_brand_name_eng,machine_brand.machine_brand_name_eng],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"Machine Brand Details Saved Successfully."})
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
    const machine_brand = req.body;
    dbConn.query(
        "UPDATE machine_brand SET department_id=?,machine_brand_code=?,machine_brand_name_eng=?,machine_brand_name_lang=? WHERE machine_brand_id = ?",
        [
          machine_brand.department_id,
          machine_brand.machine_brand_code,
          machine_brand.machine_brand_name_eng,
          machine_brand.machine_brand_name_eng,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Machine Brand Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const machine_brand = req.body;
    dbConn.query(
        "UPDATE machine_brand SET flag=? WHERE machine_brand_id = ?",
        [
          machine_brand.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Machine Brand Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM machine_brand WHERE machine_brand_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Machine Brand Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
