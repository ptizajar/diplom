const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const multer = require("multer");

const upload = multer();

const { Pool } = require("pg");

const cors = require("cors");

const crypto = require("crypto");

const path = require("path");

const cookieParser = require("cookie-parser");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "intex_db",
});

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function sessionParser(req, res, next) {
  const sessionId = req.cookies.sessionId;
  const currentUser = sessions.get(sessionId);
  req.user = currentUser;
  next();
}

app.use(sessionParser);

app.put(
  "/api/admin/category",
  upload.single("category_image"),
  async function (req, res) {
    const { category_name, category_id } = req.body;

    try {
      const binaryData = req.file?.buffer;
      if (category_id) {
        if (!binaryData) {
          await pool.query(
            "update category set category_name=$1 where category_id=$2",
            [category_name, category_id]
          );
        } else {
          await pool.query(
            "update category set category_name=$1, category_picture=$2 where category_id=$3",
            [category_name, binaryData, category_id]
          );
        }
        res.status(200).json({});
      } else {
        const result = await pool.query(
          "INSERT INTO category (category_name, category_picture) values ($1, $2) returning *",
          [category_name, binaryData]
        );
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete("/api/admin/delete_category/:id", async function (req, res) {
  try {
    const param = req.params.id;
    await pool.query("delete from category where category_id=$1", [param]);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    res.status(200).contentType("image/jpeg");
    res.send(result.rows[0].category_picture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/category/:id", async function (req, res) {
  try {
    const param = req.params.id;
    const result = await pool.query(
      "select category_name from category where category_id=$1",
      [param]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/category/:id/items", async function (req, res) {
  try {
    const param = req.params.id;
    const result = await pool.query(
      "select item_id, item_name, price from item where category_id=$1 ",
      [param]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/item/image/:id", async function (req, res) {
  try {
    const param = req.params.id;
    const result = await pool.query(
      "select item_picture from item where item_id= $1",
      [param]
    );
    res.status(200).contentType("image/jpeg");
    res.send(result.rows[0].item_picture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/delete_item/:id", async function (req, res) {
  try {
    const param = req.params.id;
    await pool.query("delete from item where item_id=$1", [param]);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(
  "/api/admin/item",
  upload.single("item_image"),
  async function (req, res) {
    const {
      item_id,
      article,
      item_name,
      length,
      width,
      height,
      quantity,
      price,
      description,
      show,
      category_id,
    } = req.body;

    try {
      const binaryData = req.file?.buffer;
      if (item_id) {
        if (!binaryData) {
          await pool.query(
            "update item set article=$1, item_name=$2, length=$3, width=$4, height=$5, quantity=$6, price=$7, description=$8, show=$9 where item_id=$10",
            [
              parseInt(article),
              item_name,
              parseFloat(length),
              parseFloat(width),
              parseFloat(height),
              parseInt(quantity),
              parseFloat(price),
              description,
              show == "on",
              item_id,
            ]
          );
        } else {
          await pool.query(
            "update item set article=$1, item_name=$2, length=$3, width=$4, height=$5, quantity=$6, price=$7, description=$8, show=$9, item_picture=$10 where item_id=$11",
            [
              parseInt(article),
              item_name,
              parseFloat(length),
              parseFloat(width),
              parseFloat(height),
              parseInt(quantity),
              parseInt(price),
              description,
              show == "on",
              binaryData,
              item_id,
            ]
          );
        }
        res.status(200).json({});
      } else {
        console.log(JSON.stringify(req.body));
        const result = await pool.query(
          "INSERT INTO item (item_name,article,length,width,height,item_picture,price,description,show,category_id,quantity) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11) returning *",
          [
            item_name,
            parseInt(article),
            parseFloat(length),
            parseFloat(width),
            parseFloat(height),
            binaryData,
            parseInt(price),
            description,
            show == "on",
            category_id,
            parseInt(quantity),
          ]
        );
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.get("/api/item/:id", async function (req, res) {
  try {
    const param = req.params.id;
    const result = await pool.query(
      "select item_id,item_name,article,length,width,height,item_picture,price,description,quantity from item where item_id=$1 ",
      [param]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/showed_items", async function (req, res) {
  try {
    // const sessionId = req.cookies.sessionId;
    // const currentUser = sessions.get(sessionId);
    // console.log(JSON.stringify(currentUser));
    console.log(req.user);
    const result = await pool.query(
      "select item_id,item_name,article,length,width,height,price,description,quantity from item where show=$1 ",
      [true]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const sessions = new Map();

app.put("/api/registrate", upload.none(), async function (req, res) {
  const { login, user_name, phone, password } = req.body;

  function hashPasswordMD5(password) {
    const hash = crypto.createHash("md5").update(password).digest("hex");
    return hash;
  }

  try {
    const findLogin = await pool.query("select * from users where login=$1", [
      login,
    ]);
    console.log(findLogin.rowCount);
    if (findLogin.rowCount > 0) {
      res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    } else {
      const result = await pool.query(
        "INSERT INTO users (login, password, user_name, phone, is_admin) values ($1, $2, $3, $4, $5) returning *",
        [login, hashPasswordMD5(password), user_name, phone, false]
      );
      const cookie = crypto.randomBytes(64).toString("base64");
      const currentUser = result.rows[0];
      res.status(200).cookie("sessionId", cookie).json(currentUser);
      sessions.set(cookie, currentUser);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static("static"));

app.listen(3001);
