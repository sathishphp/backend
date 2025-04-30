const express = require("express");
const router = express.Router();
const dbConn = require("../connection");
router.get("/list", (req, res) => {
  const query =
    "SELECT company_id,company_code,company_name_eng,address,city,email,flag FROM COMPANY ORDER BY company_id DESC";
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
    "SELECT company_id,company_code,company_name_eng,pin_code,address,city,email,flag FROM COMPANY WHERE company_id =? ORDER BY company_id DESC";
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
  const company = req.body;
  const query = "SELECT company_code FROM COMPANY WHERE company_code=?";
  dbConn.query(query, [company.company_code], (err, results) => {
    if (!err) {
      if (results.length > 0) {
        res.status(400).json({ message: "Company Code already exists." });
      }
      else{
        const query = "INSERT INTO COMPANY(company_code,company_name_eng,company_name_lang,address,city,pin_code,email,flag)VALUES(?,?,?,?,?,?,?,1)";
        dbConn.query(query,[company.company_code,company.company_name_eng,company.company_name_eng,company.address,company.city,company.pin_code,company.email],(err,results)=>{
            if(!err){
                return res.status(201).json({insertId:results.insertId,message:"Company Details Saved Successfully."})
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
    const company = req.body;
    dbConn.query(
        "UPDATE COMPANY SET company_code=?,company_name_eng=?,address=?,city=?,pin_code=?,email=? WHERE company_id = ?",
        [
          company.company_code,
          company.company_name_eng,
          company.address,
          company.city,
          company.pin_code,
          company.email,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Company Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.put("/update-status/:id",(req,res)=>{
    const company = req.body;
    dbConn.query(
        "UPDATE COMPANY SET flag=? WHERE company_id = ?",
        [
          company.flag,
          req.params.id
        ],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Company Status Details Updated Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});

router.delete("/delete/:id",(req,res)=>{
    dbConn.query(
        "DELETE FROM COMPANY WHERE company_id = ?",
        [req.params.id],(err,results)=>{
            if(!err){
                if(results.affectedRows > 0){
                    return res.status(200).json({data:results,message:"Company Details Deleted Successfully."})
                }
            }else{
                return res.status(500).json(err);
            }
        });
});
module.exports = router;
