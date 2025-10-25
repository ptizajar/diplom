const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const multer = require("multer");

const upload = multer();

const { Pool } = require("pg");

const cors = require("cors");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "intex_db",
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.put(
  "/api/admin/category",
  upload.single("category_image"),
  async function (req, res) {
    const { category_name } = req.body;
    try {
      const binaryData = req.file.buffer;
      const result = await pool.query(
        "INSERT INTO category (category_name, category_picture) values ($1, $2) returning *",
        [category_name, binaryData]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/api/categories", async function (req, res) {
  try {
    const result = await pool.query(
      "SELECT category_name, category_id from category order by category_name desc"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/category/image/:id", async function (req, res) {
  try {
    const param = req.params.id;
    const result = await pool.query(
      "select category_picture from category where category_id= $1",
      [param]
    );
    res.status(200).contentType('image/jpeg');
    res.send(result.rows[0].category_picture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/delete_category/:id", async function (req, res) {
  try{
    const param = req.params.id;
    console.log(JSON.stringify(param));
  await pool.query( "delete from category where category_id=$1",[param]);
    res.status(200).json({});
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
  
})

app.listen(3001);
