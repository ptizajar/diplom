const express = require("express");
  
const app = express();

const bodyParser= require('body-parser');

 const multer = require('multer');

 const upload = multer();
 
const { Pool } = require('pg');

const cors = require('cors')

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "intex_db"
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


app.put("/api/admin/category", upload.none(), async function(req,res){
    const { category_name} = req.body;
    try{
   const result = await pool.query('INSERT INTO category (category_name) values ($1) returning *', [category_name]);
   res.status(201).json(result.rows[0]);
}
catch (err){
    res.status(500).json({ error: err.message });
}
})
app.listen(3001);