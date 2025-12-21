const express = require("express");
const app = express();
exports.app = app;
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
import { serialize } from "v8";
import { adminRouter } from "./adminRouter";
import { pool, redisConnection, client } from "./connections";
import path from "path";
const multer = require("multer");
const upload = multer();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

async function sessionParser(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    next();
    return;
  }
  const currentUser = JSON.parse(await client.get(sessionId));
  req.user = currentUser;
  next();
}

app.use(sessionParser);
app.use("/api/admin", adminRouter);

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
    if (req.user.user_id) {
      const liked = (await pool.query(
        "select item_id from favourites where user_id=$1",
        [req.user.user_id]
      )).rows.map((row)=>row.item_id);//возвращает массив объектов, берём только числа
      console.log(liked.rows);
      for (const row of result.rows) {
        row.liked = liked.includes(row.item_id); //Каждой строке-товару добавляется значение наличия в избранном или нет
      }
    }
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
    const result = await pool.query(
      "select item_id,item_name,article,length,width,height,price,description,quantity from item where show=$1 ",
      [true]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function hashPasswordMD5(password) {
  const hash = crypto.createHash("md5").update(password).digest("hex");
  return hash;
}

app.get("/api/refresh-session", async function (req, res) {
  return res.status(200).json({ user: req.user });
});

app.put("/api/registrate", upload.none(), async function (req, res) {
  const { login, user_name, phone, password } = req.body;

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
      await redisConnection;
      await client.set(cookie, JSON.stringify(currentUser));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", upload.none(), async function (req, res) {
  const { login, password } = req.body;
  try {
    const findLogin = await pool.query("select * from users where login=$1", [
      login,
    ]);
    if (findLogin.rowCount === 0) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }
    const savedPassword = findLogin.rows[0].password;
    const givenPassword = hashPasswordMD5(password);
    if (savedPassword !== givenPassword) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }
    const cookie = crypto.randomBytes(64).toString("base64");
    const currentUser = findLogin.rows[0];
    res.status(200).cookie("sessionId", cookie).json(currentUser);
    await redisConnection;
    await client.set(cookie, JSON.stringify(currentUser));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logout", upload.none(), async function (req, res) {
  try {
    await redisConnection;
    const sessionId = req.cookies.sessionId;
    await client.del(sessionId);
    res.status(200).clearCookie("sessionId").json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/favourites", upload.none(), async function (req, res) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ error: "Войдите чтобы добавлять товары в избранное" });
      return;
    }
    const { item_id, liked } = req.body;
    const findItem = await pool.query(
      "select * from favourites where item_id=$1 and user_id=$2",
      [item_id, req.user.user_id]
    );
    if (!findItem.rowCount && liked==='true') {
      //если товара нет а его надо лайкнуть
      await pool.query(
        "insert into favourites(item_id,user_id) values ($1,$2)",
        [item_id, req.user.user_id]
      );
    }
    if (findItem.rowCount && liked==='false') {
      //если товар есть, а его надо дизлайкнуть
      await pool.query(
        "delete from favourites where item_id=$1 and user_id=$2",
        [item_id, req.user.user_id]
      );
      //другие случаи не обрабатываются потому что при них не нужно ничего делать
    }
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static("static"));

app.get("/*splat", (req, res) => {
  res.sendFile(path.resolve("./static", "index.html"));
});

app.listen(3001);
