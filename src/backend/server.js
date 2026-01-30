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
      "select item_id, item_name, price from item where category_id=$1 and removed=$2",
      [param,false]
    );
    if (req.user?.user_id) {
      const liked = (
        await pool.query("select item_id from favourites where user_id=$1", [
          req.user.user_id,
        ])
      ).rows.map((row) => row.item_id); //возвращает массив объектов, берём только числа
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
     if (req.user?.user_id) {
      const liked = (
        await pool.query("select item_id from favourites where user_id=$1", [
          req.user.user_id,
        ])
      ).rows.map((row) => row.item_id); //возвращает массив объектов, берём только числа
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

function hashPasswordMD5(password) {
  const hash = crypto.createHash("md5").update(password).digest("hex");
  return hash;
}

app.get("/api/refresh-session", async function (req, res) {
  return res.status(200).json({ user: req.user });
});

// app.put("/api/registrate", upload.none(), async function (req, res) {
//   const { login, user_name, phone, password } = req.body;

//   try {
//     const findLogin = await pool.query("select * from users where login=$1", [
//       login,
//     ]);
//     console.log(findLogin.rowCount);
//     if (findLogin.rowCount > 0) {
//       res
//         .status(400)
//         .json({ error: "Пользователь с таким логином уже существует" });
//     } else {
//       const result = await pool.query(
//         "INSERT INTO users (login, password, user_name, phone, is_admin) values ($1, $2, $3, $4, $5) returning *",
//         [login, hashPasswordMD5(password), user_name, phone, false]
//       );
//       const cookie = crypto.randomBytes(64).toString("base64");
//       const currentUser = result.rows[0];
//       res.status(200).cookie("sessionId", cookie).json(currentUser);
//       await redisConnection;
//       await client.set(cookie, JSON.stringify(currentUser));
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post("/api/registrate", upload.none(), async function (req, res) {
  const { login, user_name, phone, password, password2 } = req.body;
  const errors = [];

  try {
    // --- ВАЛИДАЦИЯ ПОЛЕЙ ---
    // Логин
    !login && errors.push("Логин обязателен");
    login?.length < 3 && errors.push("Логин должен быть не менее 3 символов");
    login?.length > 50 && errors.push("Логин должен быть не более 50 символов");
    login && !/^[a-zA-Z0-9_.@]+$/.test(login) && errors.push("Логин может содержать только латиницу, цифры, символы _ @ .");
    login && /\s/.test(login) && errors.push("Логин не должен содержать пробелы");

    // Имя
    !user_name && errors.push("Имя обязательно");
    user_name?.trim().length < 2 && errors.push("Имя должно быть не менее 2 символов");
    user_name?.trim().length > 50 && errors.push("Имя должно быть не более 50 символов");
    user_name && !/^[а-яА-ЯёЁ\s\-]+$/.test(user_name.trim()) && errors.push("Имя может содержать только кириллицу, пробелы и дефисы");

    // Телефон
    !phone && errors.push("Телефон обязателен");
    phone && !/^(\+7|8)/.test(phone) && errors.push("Номер должен начинаться с +7 или 8");
    const digitsOnly = phone?.replace(/\D/g, '');
    digitsOnly?.length !== 11 && errors.push("Номер должен содержать 11 цифр");
    digitsOnly && !/^[78]/.test(digitsOnly) && errors.push("Первая цифра номера должна быть 7 или 8");

    // Пароль
    !password && errors.push("Пароль обязателен");
    password?.length < 6 && errors.push("Пароль должен быть не менее 6 символов");
    password?.length > 50 && errors.push("Пароль должен быть не более 50 символов");
    password && /\s/.test(password) && errors.push("Пароль не должен содержать пробелы");
    password && !/[A-Z]/.test(password) && errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    password && !/[0-9]/.test(password) && errors.push("Пароль должен содержать хотя бы одну цифру");
    password && !/[\W_]/.test(password) && errors.push("Пароль должен содержать хотя бы один специальный символ");
    password && /[а-яА-ЯёЁ]/.test(password) && errors.push("Пароль должен содержать только латиницу");

    // Пароли совпадают
    password !== password2 && errors.push("Пароли не совпадают");

    // Если есть ошибки валидации - сразу возвращаем
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('. ') });
    }

    // --- ВАША ПРОВЕРКА УНИКАЛЬНОСТИ (без изменений) ---
    const findLogin = await pool.query("select * from users where login=$1", [
      login,
    ]);
    if (findLogin.rowCount > 0) {
      res
        .status(400)
        .json({ error: "Пользователь с таким логином уже существует" });
    } else {
      const result = await pool.query(
        "INSERT INTO users (login, password, user_name, phone, is_admin) values ($1, $2, $3, $4, $5) returning *",
        [login, hashPasswordMD5(password), user_name, phone.trim(), false]
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
const tries = new Map();//key-login,value-array of tries by time
app.post("/api/login", upload.none(), async function (req, res) {
  const { login, password } = req.body;
  const currentTries = tries.get(login) || [];
  if(currentTries.length===3){
    const timeGone = Date.now() - currentTries[2];//время которое прошло с первой попытки из трёх
    if(timeGone<5*60*1000){
      res.status(429).json({error: "Слишком много попыток"});
      return;
    }
  }
  try {
    const findLogin = await pool.query("select * from users where login=$1", [
      login,
    ]);
    if (findLogin.rowCount === 0) {
      tries.set(login, [Date.now(),...(tries.get(login) || []).slice(0,2)]);//добавляем в начало дату, копируя в хвост что было до этого(первые два элемента) или пустой массив если ничего не было
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }
    const savedPassword = findLogin.rows[0].password;
    const givenPassword = hashPasswordMD5(password);
    if (savedPassword !== givenPassword) {
      tries.set(login, [Date.now(),...(tries.get(login) || []).slice(0,2)]);
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }
    const cookie = crypto.randomBytes(64).toString("base64");
    const currentUser = findLogin.rows[0];
    res.status(200).cookie("sessionId", cookie).json(currentUser);
    await redisConnection;
    await client.set(cookie, JSON.stringify(currentUser));
    tries.delete(login);
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
    if (!findItem.rowCount && liked === "true") {
      //если товара нет а его надо лайкнуть
      await pool.query(
        "insert into favourites(item_id,user_id) values ($1,$2)",
        [item_id, req.user.user_id]
      );
    }
    if (findItem.rowCount && liked === "false") {
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

app.get("/api/liked_items", async function (req, res) {
  try {
    const userId = req.user?.user_id;
    const result = await pool.query(
      `SELECT 
        i.item_id,
        i.item_name,
        i.article,
        i.length,
        i.width,
        i.height,
        i.price,
        i.description,
        i.quantity,
        i.show,
        i.category_id,
        true as liked
       FROM favourites f
       JOIN item i ON f.item_id = i.item_id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.status(200).json({ favourites: result.rows });
  } catch (err) {
    console.error("Ошибка получения избранного:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/order/:id",upload.none(), async function (req, res) {

  const { preferred_datetime, user_name, phone } = req.body;

  try {
    await pool.query("SET TIME ZONE 'Europe/Moscow'");
    const param = req.params.id;
    const userId = req.user?.user_id;
    const { rows } = await pool.query(
      "select price from item where item_id=$1",[param]
    );
    const price = rows[0]?.price;
    const result = await pool.query(
      "insert into orders (user_id,item_id,date,recall_date,price,status, user_name, phone) values ($1,$2,NOW(),$3,$4,$5,$6,$7) returning *",
      [userId,param,preferred_datetime,price,'Оформлен',user_name,phone]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static("static"));

app.get("/*splat", (req, res) => {
  res.sendFile(path.resolve("./static", "index.html"));
});



app.listen(3001);
