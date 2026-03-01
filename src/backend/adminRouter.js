const express = require("express");
const multer = require("multer");
const upload = multer();
export const adminRouter = express.Router();
import { pool } from "./connections";

function isAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    res.status(401).json({});
    return;
  }
  next();
}

adminRouter.use(isAdmin);

adminRouter.put(
  "/category",
  upload.single("category_image"),
  async function (req, res) {
    const { category_name, category_id } = req.body;
    try {
      //Проверки названия
      if (category_id) {
        //редактирование
        // При редактировании
        const checkExisting = await pool.query(
          "SELECT COUNT(*) as count FROM category WHERE LOWER(TRIM(category_name)) = LOWER(TRIM($1)) AND category_id != $2",
          [category_name, category_id],
        );

        if (checkExisting.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Категория с таким названием уже существует",
          });
        }
      } else {
        //создание
        // При создании
        const checkExisting = await pool.query(
          "SELECT COUNT(*) as count FROM category WHERE LOWER(TRIM(category_name)) = LOWER(TRIM($1))",
          [category_name],
        );

        if (checkExisting.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Категория с таким названием уже существует",
          });
        }
      }
      const binaryData = req.file?.buffer;
      if (category_id) {
        if (!binaryData) {
          await pool.query(
            "update category set category_name=$1 where category_id=$2",
            [category_name, category_id],
          );
        } else {
          await pool.query(
            "update category set category_name=$1, category_picture=$2 where category_id=$3",
            [category_name, binaryData, category_id],
          );
        }
        res.status(200).json({});
      } else {
        const result = await pool.query(
          "INSERT INTO category (category_name, category_picture) values ($1, $2) returning *",
          [category_name, binaryData],
        );
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

adminRouter.delete(
  "/delete_category/:id",
  upload.none(),
  async function (req, res) {
    try {
      const param = req.params.id;
      const isEmpty = await pool.query(
        "select count(*) from category where category_id=$1",
        [param],
      );
      if (isEmpty) {
        return res.status(409).json({
          error: "Категория не пуста",
        });
      }
      await pool.query("delete from category where category_id=$1", [param]);
      res.status(200).json({});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

adminRouter.delete(
  "/delete_item/:id",
  upload.none(),
  async function (req, res) {
    try {
      const param = req.params.id;
      const ordersCount = await pool.query(
        "select count(*) from orders where item_id=$1 and status!=$2",
        [param, "Отменен"],
      );
      if (ordersCount.rows[0].count > 0) {
        return res
          .status(409)
          .json({ error: "На этот товар есть неотменённые заказы" });
      }
      await pool.query("delete from item where item_id=$1", [param]);
      res.status(200).json({});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

adminRouter.put(
  "/item",
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
      //Проверки
      if (item_id) {
        //Редактирование
        // проверяем уникальность названия
        const checkExistingName = await pool.query(
          "SELECT COUNT(*) as count FROM item WHERE LOWER(TRIM(item_name)) = LOWER(TRIM($1)) AND item_id != $2",
          [item_name, item_id],
        );

        if (checkExistingName.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Товар с таким названием уже существует",
          });
        } // При редактировании: проверяем уникальность артикула
        const checkExistingArt = await pool.query(
          "SELECT COUNT(*) as count FROM item WHERE article = $1 AND item_id != $2",
          [article, item_id],
        );

        if (checkExistingArt.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Товар с таким артикулом уже существует",
          });
        }
      } else {
        //создание
        // При создании: проверяем уникальность названия
        const checkExistingName = await pool.query(
          "SELECT COUNT(*) as count FROM item WHERE LOWER(TRIM(item_name)) = LOWER(TRIM($1))",
          [item_name],
        );
        if (checkExistingName.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Товар с таким названием уже существует",
          });
        }
        // При создании: проверяем уникальность артикула
        const checkExistingArt = await pool.query(
          "SELECT COUNT(*) as count FROM item WHERE article = $1",
          [article],
        );

        if (checkExistingArt.rows[0]?.count > 0) {
          return res.status(409).json({
            error: "Товар с таким артикулом уже существует",
          });
        }
      }
      const binaryData = req.file?.buffer;
      if (item_id) {
        //редактирование
        await pool.query("SET TIME ZONE 'Europe/Moscow'");
        //  Получаем текущую цену ДО обновления
        const currentItem = await pool.query(
          "SELECT price FROM item WHERE item_id = $1",
          [item_id],
        );
        const oldPrice = currentItem.rows[0]?.price;

        if (!binaryData) {
          //без обновления картинки
          await pool.query(
            "update item set article=$1, item_name=$2, length=$3, width=$4, height=$5, quantity=$6, price=$7, description=$8, show=$9 where item_id=$10",
            [
              article,
              item_name,
              parseFloat(length),
              parseFloat(width),
              parseFloat(height),
              parseInt(quantity),
              parseFloat(price),
              description,
              show == "on",
              item_id,
            ],
          );
        } else {
          //с обновлением картинки
          await pool.query(
            "update item set article=$1, item_name=$2, length=$3, width=$4, height=$5, quantity=$6, price=$7, description=$8, show=$9, item_picture=$10 where item_id=$11",
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
              binaryData,
              item_id,
            ],
          );
        }
        res.status(200).json({});

        //  Сохраняем новую цену в историю (если она изменилась)
        if (oldPrice !== parseFloat(price)) {
          await pool.query(
            "INSERT INTO price_history (item_id, price) VALUES ($1, $2)",
            [item_id, parseFloat(price)],
          );
        }

        res.status(200).json({});
      } else {
        //добавление
        await pool.query("SET TIME ZONE 'Europe/Moscow'");
        const result = await pool.query(
          "INSERT INTO item (item_name,article,length,width,height,item_picture,price,description,show,category_id,quantity,removed) values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning *",
          [
            item_name,
            parseInt(article),
            parseFloat(length),
            parseFloat(width),
            parseFloat(height),
            binaryData,
            parseFloat(price),
            description,
            show == "on",
            category_id,
            parseInt(quantity),
            false,
          ],
        );
        // Сохраняем первую цену в историю 
        const newItemId = result.rows[0].item_id;
        await pool.query(
          "INSERT INTO price_history (item_id, price) VALUES ($1, $2)",
          [newItemId, parseFloat(price)],
        );
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

adminRouter.post("/remove_item/:id", async function (req, res) {
  try {
    const param = req.params.id;
    await pool.query("update item set removed=not removed where item_id=$1", [
      param,
    ]);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get(
  "/category/:id/all_items",
  upload.none(),
  async function (req, res) {
    try {
      const param = req.params.id;
      const result = await pool.query(
        "select item_id, item_name, price, removed from item where category_id=$1 ORDER BY removed ASC",
        [param],
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
  },
);

// adminRouter.get("/bids", async function (req, res) {
//   try {
//     const result = await pool.query(
//       `SELECT o.order_id, u.login, o.user_name, o.item_id, i.article, o.price, o.recall_date, o.phone, o.status
//       FROM orders o
//       LEFT JOIN users u ON o.user_id = u.user_id
//       LEFT JOIN item i ON o.item_id = i.item_id
//       ORDER BY o.date ASC `,
//     );
//     res.status(200).json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

adminRouter.put("/changeStatus", upload.none(), async function (req, res) {
  try {
    const status = req.body.status;
    const o_id = req.body.id;
    await pool.query("update orders set status=$1 where order_id=$2", [
      status,
      o_id,
    ]);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/filterOrders", async function (req, res) {
  try {
    const status = req.query.status;
    const result = await pool.query(
      `SELECT o.order_id, u.login, o.user_name, o.item_id, i.article, o.price, o.recall_date, o.phone, o.status 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.user_id 
      LEFT JOIN item i ON o.item_id = i.item_id 
      where o.status = $1
      ORDER BY o.date ASC `,
      [status],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
