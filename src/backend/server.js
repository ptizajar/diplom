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
import { emailService } from "./sendEmail";
const multer = require("multer");
const upload = multer();

require("./sendEmail");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

async function sessionParser(req, res, next) {
  const sessionId = req.cookies.sessionId;
  // Если нет sessionId в куки, просто пропускаем (пользователь не авторизован)
  if (!sessionId) {
    next();
    return;
  }
  try {
    const userData = await client.get(sessionId);
    // Если данные не найдены - сессия истекла (Redis автоматически удалил)
    if (!userData) {
      res.clearCookie("sessionId");
      return res.status(401).json({
        error: "Сессия истекла",
        code: "SESSION_EXPIRED",
      });
    }
    // Сессия активна - парсим данные пользователя
    req.user = JSON.parse(userData);

    // продлеваем сессию при активности
    const ttl = await client.ttl(sessionId);
    const testTTL = 10;
    const maxTTL = 24 * 60 * 60; // 24 часа

    if (ttl < maxTTL / 2) {
      await client.expire(sessionId, maxTTL);
      console.log("Сессия продлена");
    }

    next();
  } catch (err) {
    console.error("Ошибка при проверке сессии:", err);
    // В случае ошибки - очищаем куки для безопасности
    res.clearCookie("sessionId");
    next(err);
  }
}
app.use(sessionParser);
app.use("/api/admin", adminRouter);

app.get("/api/categories", async function (req, res) {
  try {
    const result = await pool.query(
      "SELECT category_name, category_id from category order by category_name desc",
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
      [param],
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
      [param],
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
      "select item_id, item_name, price, length, width, height from item where category_id=$1 and removed=$2",
      [param, false],
    );
    if (req.user?.user_id) {
      const liked = (
        await pool.query("select item_id from favourites where user_id=$1", [
          req.user.user_id,
        ])
      ).rows.map((row) => row.item_id); //возвращает массив объектов, берём только числа
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
      [param],
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
      "select item_id,item_name,article,length,width,height,item_picture,price,description,quantity, show from item where item_id=$1 ",
      [param],
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
      [true],
    );
    if (req.user?.user_id) {
      const liked = (
        await pool.query("select item_id from favourites where user_id=$1", [
          req.user.user_id,
        ])
      ).rows.map((row) => row.item_id); //возвращает массив объектов, берём только числа
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
  const { user_name, phone, email, password, password2 } = req.body;
  const errors = [];
  try {
    // Имя
    !user_name && errors.push("Имя обязательно");
    user_name?.trim().length < 2 &&
      errors.push("Имя должно быть не менее 2 символов");
    user_name?.trim().length > 50 &&
      errors.push("Имя должно быть не более 50 символов");
    user_name &&
      !/^[а-яА-ЯёЁ\s\-]+$/.test(user_name.trim()) &&
      errors.push("Имя может содержать только кириллицу, пробелы и дефисы");

    // Телефон
    !phone && errors.push("Телефон обязателен");
    phone &&
      !/^(\+7|8)/.test(phone) &&
      errors.push("Номер должен начинаться с +7 или 8");
    const digitsOnly = phone?.replace(/\D/g, "");
    digitsOnly?.length !== 11 && errors.push("Номер должен содержать 11 цифр");
    digitsOnly &&
      !/^[78]/.test(digitsOnly) &&
      errors.push("Первая цифра номера должна быть 7 или 8");

    // Валидация email
    !email && errors.push("Email обязателен");
    email?.trim().length < 5 &&
      errors.push("Email должен быть не менее 5 символов");
    email?.trim().length > 100 &&
      errors.push("Email должен быть не более 100 символов");
    email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) &&
      errors.push("Введите корректный email адрес");
    email &&
      email.trim().includes("..") &&
      errors.push("Email не может содержать две точки подряд");
    email &&
      (() => {
        const localPart = email.trim().split("@")[0];
        return (
          localPart && (localPart.startsWith(".") || localPart.endsWith("."))
        );
      })() &&
      errors.push(
        "Локальная часть email не может начинаться или заканчиваться точкой",
      );

    // Пароль
    !password && errors.push("Пароль обязателен");
    password?.length < 6 &&
      errors.push("Пароль должен быть не менее 6 символов");
    password?.length > 50 &&
      errors.push("Пароль должен быть не более 50 символов");
    password &&
      /\s/.test(password) &&
      errors.push("Пароль не должен содержать пробелы");
    password &&
      !/[A-Z]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    password &&
      !/[0-9]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы одну цифру");
    password &&
      !/[\W_]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы один специальный символ");
    password &&
      /[а-яА-ЯёЁ]/.test(password) &&
      errors.push("Пароль должен содержать только латиницу");

    // Если есть ошибки валидации - сразу возвращаем
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(". ") });
    }

    // ПРОВЕРКА УНИКАЛЬНОСТИ
    const findEmail = await pool.query("select * from users where email=$1", [
      email,
    ]);
    if (findEmail.rowCount > 0) {
      res
        .status(400)
        .json({ error: "Пользователь с такой почтой уже существует" });
    } else {
      const result = await pool.query(
        "INSERT INTO users ( email, password, user_name, phone, is_admin) values ($1, $2, $3, $4, $5)  RETURNING user_id, user_name, phone, is_admin, email",
        [email, hashPasswordMD5(password), user_name, phone.trim(), false],
      );
      const cookie = crypto.randomBytes(64).toString("hex");
      const currentUser = result.rows[0];

      await redisConnection;
      const sessionTTL = 24 * 60 * 60; // 24 часа в секундах
      await client.setEx(cookie, sessionTTL, JSON.stringify(currentUser));
      res
        .status(200)
        .cookie("sessionId", cookie, {
          httpOnly: true, //защита от xss атак
          sameSite: "strict", // Защита от CSRF
          //secure: process.env.NODE_ENV === 'production',
          maxAge: sessionTTL * 1000, // Конвертируем в миллисекунды
        })
        .json(currentUser);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const tries = new Map(); //key-email,value-array of tries by time
app.post("/api/login", upload.none(), async function (req, res) {
  const { email, password } = req.body;
  const currentTries = tries.get(email) || [];
  if (currentTries.length === 3) {
    const timeGone = Date.now() - currentTries[2]; //время которое прошло с первой попытки из трёх
    if (timeGone < 5 * 60 * 1000) {
      res.status(429).json({ error: "Слишком много попыток" });
      return;
    }
  }
  try {
    const findEmail = await pool.query("select * from users where email=$1", [
      email,
    ]);
    if (findEmail.rowCount === 0) {
      tries.set(email, [Date.now(), ...(tries.get(email) || []).slice(0, 2)]); //добавляем в начало дату, копируя в хвост что было до этого(первые два элемента) или пустой массив если ничего не было
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }
    const savedPassword = findEmail.rows[0].password;
    const givenPassword = hashPasswordMD5(password);
    if (savedPassword !== givenPassword) {
      tries.set(email, [Date.now(), ...(tries.get(email) || []).slice(0, 2)]);
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }
    const cookie = crypto.randomBytes(64).toString("base64");
    const currentUser = findEmail.rows[0];
    const sessionTTL = 24 * 60 * 60; // 24 часа в секундах
    const testSessionTTl = 10;
    await redisConnection;
    await client.setEx(cookie, sessionTTL, JSON.stringify(currentUser));
    res
      .status(200)
      .cookie("sessionId", cookie, {
        httpOnly: true, //защита от xss атак
        sameSite: "strict", // Защита от CSRF
        //secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTTL * 1000, // Конвертируем в миллисекунды
      })
      .json(currentUser);

    tries.delete(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/logout", async function (req, res) {
  try {
    await redisConnection;
    const sessionId = req.cookies.sessionId;
    await client.del(sessionId);
    res
      .status(200)
      .clearCookie("sessionId", {
        httpOnly: true, //защита от xss атак
        sameSite: "strict", // Защита от CSRF
        //secure: process.env.NODE_ENV === 'production',
      })
      .json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/favourites", upload.none(), async function (req, res) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Не авторизован" });
      return;
    }
    const { item_id, liked } = req.body;
    const findItem = await pool.query(
      "select * from favourites where item_id=$1 and user_id=$2",
      [item_id, req.user.user_id],
    );
    if (!findItem.rowCount && liked === "true") {
      //если товара нет а его надо лайкнуть
      await pool.query(
        "insert into favourites(item_id,user_id) values ($1,$2)",
        [item_id, req.user.user_id],
      );
    }
    if (findItem.rowCount && liked === "false") {
      //если товар есть, а его надо дизлайкнуть
      await pool.query(
        "delete from favourites where item_id=$1 and user_id=$2",
        [item_id, req.user.user_id],
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
    if (!req.user) {
      return res.status(401).json({
        error: "Не авторизован",
      });
    }
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
      [userId],
    );

    res.status(200).json({ favourites: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.post("/api/order/:id",upload.none(), async function (req, res) {

//   const { preferred_datetime, user_name, phone } = req.body;

//   try {
//     await pool.query("SET TIME ZONE 'Europe/Moscow'");
//     const param = req.params.id;
//     const userId = req.user?.user_id;
//     const { rows } = await pool.query(
//       "select price from item where item_id=$1",[param]
//     );
//     const price = rows[0]?.price;
//     const result = await pool.query(
//       "insert into orders (user_id,item_id,date,recall_date,price,status, user_name, phone) values ($1,$2,NOW(),$3,$4,$5,$6,$7) returning *",
//       [userId,param,preferred_datetime,price,'Оформлен',user_name,phone]
//     );
//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.post("/api/order/:id", upload.none(), async function (req, res) {
  const { preferred_datetime, user_name, phone } = req.body;
  const param = req.params.id;
  if (!req.user) {
    return res.status(401).json({
      error: "Не авторизован",
    });
  }
  const userId = req.user?.user_id;
  const errors = [];

  try {
    // --- ВАЛИДАЦИЯ ПОЛЕЙ ---
    // Имя
    !user_name && errors.push("Имя обязательно");
    user_name?.length < 2 && errors.push("Имя должно быть не менее 2 символов");
    user_name?.length > 50 &&
      errors.push("Имя должно быть не более 50 символов");
    user_name &&
      !/^[а-яА-ЯёЁ\s\-]+$/.test(user_name) &&
      errors.push("Только кириллица, пробелы и дефисы");
    user_name &&
      (user_name.startsWith("-") || user_name.startsWith(" ")) &&
      errors.push("Имя не должно начинаться с пробела или дефиса");
    user_name &&
      (user_name.endsWith("-") || user_name.endsWith(" ")) &&
      errors.push("Имя не должно заканчиваться пробелом или дефисом");
    user_name &&
      /\s\s+/.test(user_name) &&
      errors.push("Имя не должно содержать несколько пробелов подряд");

    // Телефон
    !phone && errors.push("Телефон обязателен");
    phone &&
      !/^[+\s\-\(\)0-9]+$/.test(phone) &&
      errors.push(
        "Номер может содержать только цифры, пробелы, скобки, дефисы и знак +",
      );
    phone &&
      !/^(\+7|8)/.test(phone) &&
      errors.push("Номер должен начинаться с +7 или 8");
    const digitsOnly = phone?.replace(/\D/g, "");
    digitsOnly?.length !== 11 && errors.push("Номер должен содержать 11 цифр");

    // Время
    !preferred_datetime && errors.push("Дата и время обязательны");

    if (preferred_datetime) {
      const selectedDate = new Date(preferred_datetime);
      const now = new Date();

      // Проверка на корректную дату
      isNaN(selectedDate.getTime()) && errors.push("Некорректный формат даты");

      if (!isNaN(selectedDate.getTime())) {
        // Текущее время + 30 минут
        const minDateTime = new Date(now.getTime() + 30 * 60000);
        // Текущая дата + две недели
        const maxDateTime = new Date(now.getTime() + 14 * 24 * 60 * 60000);

        // Часы и минуты выбранного времени
        const selectedHours = selectedDate.getHours();
        const selectedMinutes = selectedDate.getMinutes();

        // Проверка на сегодняшнюю дату
        const isToday = selectedDate.toDateString() === now.toDateString();

        // Если выбрана сегодняшняя дата
        if (isToday) {
          // Проверяем, не поздно ли уже (после 16:30)
          const currentHours = now.getHours();
          const currentMinutes = now.getMinutes();
          const currentTotalMinutes = currentHours * 60 + currentMinutes;
          const thresholdTotalMinutes = 16 * 60 + 30; // 16:30

          // Если сейчас больше или равно 16:30
          if (currentTotalMinutes >= thresholdTotalMinutes) {
            errors.push(
              "Сегодня уже нельзя оформить заказ, выберите завтрашний день",
            );
          } else {
            // Если ещё можно выбрать сегодня, проверяем стандартные ограничения
            selectedDate < minDateTime &&
              errors.push(
                "Время должно быть не менее чем через 30 минут от текущего момента",
              );
          }
        } else {
          // Для других дней просто проверяем минимум (но не сегодня)
          selectedDate < minDateTime &&
            errors.push(
              "Время должно быть не менее чем через 30 минут от текущего момента",
            );
        }

        // Общие проверки для любой даты
        selectedDate > maxDateTime &&
          errors.push("Дата не должна превышать две недели от текущей");
        (selectedHours < 10 || selectedHours >= 17) &&
          errors.push("Время должно быть с 10:00 до 17:00");

        // Дополнительная проверка: если время 17:00 и позже - ошибка
        selectedHours === 17 &&
          selectedMinutes > 0 &&
          errors.push("Время должно быть до 17:00");
      }
    }

    // Если есть ошибки, возвращаем их
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // --- ОСНОВНАЯ ЛОГИКА ---
    await pool.query("SET TIME ZONE 'Europe/Moscow'");

    const { rows } = await pool.query(
      "SELECT price FROM item WHERE item_id = $1",
      [param],
    );

    !rows[0] && errors.push("Товар не найден");

    if (errors.length > 0) {
      return res.status(404).json({ errors });
    }

    const price = rows[0].price;

    const result = await pool.query(
      `INSERT INTO orders (user_id, item_id, date, recall_date, price, status, user_name, phone) 
       VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7) RETURNING *`,
      [userId, param, preferred_datetime, price, "Оформлен", user_name, phone],
    );
    const orderData = {
      order_id: result.rows[0].order_id,
      created_at: result.rows[0].date,
    };

    emailService.sendNewOrderNotification(orderData).catch(console.error);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/bids", async function (req, res) {
  if (!req.user) {
    return res.status(401).json({
      error: "Не авторизован",
    });
  }
  const userId = req.user?.user_id;
  try {
    const result = await pool.query(
      `SELECT o.order_id, u.email, o.user_name, o.item_id, i.article, o.price, o.recall_date, o.phone, o.status 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.user_id 
      LEFT JOIN item i ON o.item_id = i.item_id 
      WHERE o.user_id =$1
      ORDER BY o.date ASC `,
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user_data", async function (req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Не авторизован",
      });
    }
    const userId = req.user?.user_id;
    const result = await pool.query(
      "select user_name, phone, email from users where user_id = $1",
      [userId],
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/edit_user", upload.none(), async function (req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Не авторизован",
      });
    }
    const userId = req.user?.user_id;
    const newName = req.body.user_name;
    const newPhone = req.body.phone;
    const email = req.body.email;

    const result = await pool.query(
      "UPDATE users SET user_name=$1, phone=$2, email=$3 WHERE user_id=$4 returning user_id, email, user_name, phone, is_admin",
      [newName, newPhone, email, userId],
    );

    const updatedUser = result.rows[0];
    const sessionCookie = req.cookies?.sessionId;
    if (sessionCookie) {
      await redisConnection;
      await client.set(sessionCookie, JSON.stringify(updatedUser));
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const codes = new Map();
app.post("/api/send_code", upload.none(), async function (req, res) {
  try {
    const email = req.body.email;
    const currentTries = tries.get(email) || [];
    if (currentTries.length === 3) {
      const timeGone = Date.now() - currentTries[2]; //время которое прошло с первой попытки из трёх
      if (timeGone < 5 * 60 * 1000) {
        res.status(429).json({ error: "Слишком много попыток" });
        return;
      }
    }
    const currentUser = await pool.query(
      "select user_id from users where email=$1",
      [email],
    );
    if (currentUser.rows.length === 0) {
      res.status(400).json({ error: "Вы не зарегестрированы" });
      return;
    }

    const code = Math.round(Math.random() * 1000000); //число от 1 до 1000000
    emailService.sendVerificationCode(email, code).catch(console.error);
    const timer = Date.now();
    codes.set(email, { code, timer, tries: 0 });
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/change_password", upload.none(), async function (req, res) {
  const errors = [];
  try {
    const code = req.body.code;
    const email = req.body.email;
    const password = req.body.password;
    const codeInfo = codes.get(email);
    const currentTries = tries.get(email) || [];
    if (currentTries.length === 3) {
      const timeGone = Date.now() - currentTries[2]; //время которое прошло с первой попытки из трёх
      if (timeGone < 5 * 60 * 1000) {
        res.status(429).json({ error: "Слишком много попыток" });
        return;
      }
    }
    if (!codeInfo) {
      res.status(400).json({ error: "Неверный email" });
      return;
    }
    if (codeInfo.code != code) {
      tries.set(email, [Date.now(), ...(tries.get(email) || []).slice(0, 2)]); //добавляем в начало дату, копируя в хвост что было до этого(первые два элемента) или пустой массив если ничего не было
      res.status(400).json({ error: "Неверный код" });
      return;
    }
    const currentUser = await pool.query(
      "select user_id from users where email=$1",
      [email],
    );
    if (!currentUser.rows.length) {
      res.status(400).json({ error: "Вы не зарегестрированы" });
      return;
    }

    const timeDif = (Date.now() - codeInfo.timer) / 1000;
    if (timeDif > 600) {
      res.status(400).json({ error: "Время действия кода истекло" });
      return;
    }
    // Пароль
    !password && errors.push("Пароль обязателен");
    password?.length < 6 &&
      errors.push("Пароль должен быть не менее 6 символов");
    password?.length > 50 &&
      errors.push("Пароль должен быть не более 50 символов");
    password &&
      /\s/.test(password) &&
      errors.push("Пароль не должен содержать пробелы");
    password &&
      !/[A-Z]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы одну заглавную букву");
    password &&
      !/[0-9]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы одну цифру");
    password &&
      !/[\W_]/.test(password) &&
      errors.push("Пароль должен содержать хотя бы один специальный символ");
    password &&
      /[а-яА-ЯёЁ]/.test(password) &&
      errors.push("Пароль должен содержать только латиницу");

    // Если есть ошибки валидации - сразу возвращаем
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(". ") });
    }
    const userId = currentUser.rows[0].user_id;

    await pool.query("update users set password=$1 where user_id=$2", [
      hashPasswordMD5(password),
      userId,
    ]);
    codes.clear();
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/delete_acc", async function (req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Не авторизован" });
    }
    const userId = req.user.user_id;
    const sessionId = req.cookies.sessionId;

    await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);
    await client.del(sessionId);

    res
      .status(200)
      .clearCookie("sessionId")
      .json({ message: "Аккаунт успешно удален" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(express.static("static"));

app.get("/*splat", (req, res) => {
  res.sendFile(path.resolve("./static", "index.html"));
});

app.listen(3001);
