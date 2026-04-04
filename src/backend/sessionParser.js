import { pool, redisConnection, client } from "./connections";
export async function sessionParser(req, res, next) {
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