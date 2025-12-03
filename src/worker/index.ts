import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Affiliate endpoints
app.get("/api/affiliates/me", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const affiliate = await c.env.DB.prepare(
    "SELECT * FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  return c.json(affiliate);
});

app.post("/api/affiliates", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();

  const existing = await c.env.DB.prepare(
    "SELECT id FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (existing) {
    return c.json({ error: "Affiliate profile already exists" }, 400);
  }

  await c.env.DB.prepare(
    "INSERT INTO affiliates (user_id, full_name, phone) VALUES (?, ?, ?)"
  )
    .bind(user.id, body.full_name, body.phone)
    .run();

  const affiliate = await c.env.DB.prepare(
    "SELECT * FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  return c.json(affiliate, 201);
});

app.put("/api/affiliates/me", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE affiliates SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
  )
    .bind(body.full_name, body.phone, user.id)
    .run();

  const affiliate = await c.env.DB.prepare(
    "SELECT * FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  return c.json(affiliate);
});

app.get("/api/sales", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const affiliate = await c.env.DB.prepare(
    "SELECT id FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!affiliate) {
    return c.json({ error: "Affiliate not found" }, 404);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM sales WHERE affiliate_id = ? ORDER BY created_at DESC"
  )
    .bind(affiliate.id as number)
    .all();

  return c.json(results);
});

app.post("/api/sales", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();

  const affiliate = await c.env.DB.prepare(
    "SELECT * FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!affiliate) {
    return c.json({ error: "Affiliate not found" }, 404);
  }

  const commissionRate = (affiliate.commission_rate as number) || 10;
  const commissionAmount = body.plan_value * (commissionRate / 100);

  await c.env.DB.prepare(
    `INSERT INTO sales (affiliate_id, customer_name, customer_phone, customer_email, 
     plan_name, plan_value, commission_amount, sale_date, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      affiliate.id as number,
      body.customer_name,
      body.customer_phone,
      body.customer_email || null,
      body.plan_name,
      body.plan_value,
      commissionAmount,
      body.sale_date || new Date().toISOString().split('T')[0],
      'pending'
    )
    .run();

  await c.env.DB.prepare(
    `UPDATE affiliates 
     SET total_sales = total_sales + 1, 
         total_commission = total_commission + ?, 
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`
  )
    .bind(commissionAmount, affiliate.id as number)
    .run();

  return c.json({ success: true }, 201);
});

app.get("/api/dashboard/stats", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  const affiliate = await c.env.DB.prepare(
    "SELECT * FROM affiliates WHERE user_id = ?"
  )
    .bind(user.id)
    .first();

  if (!affiliate) {
    return c.json({ error: "Affiliate not found" }, 404);
  }

  const pendingSales = await c.env.DB.prepare(
    "SELECT COUNT(*) as count, COALESCE(SUM(commission_amount), 0) as total FROM sales WHERE affiliate_id = ? AND status = 'pending'"
  )
    .bind(affiliate.id as number)
    .first();

  const approvedSales = await c.env.DB.prepare(
    "SELECT COUNT(*) as count, COALESCE(SUM(commission_amount), 0) as total FROM sales WHERE affiliate_id = ? AND status = 'approved'"
  )
    .bind(affiliate.id as number)
    .first();

  return c.json({
    totalSales: affiliate.total_sales,
    totalCommission: affiliate.total_commission,
    pendingSales: pendingSales?.count || 0,
    pendingCommission: pendingSales?.total || 0,
    approvedSales: approvedSales?.count || 0,
    approvedCommission: approvedSales?.total || 0,
    commissionRate: affiliate.commission_rate,
  });
});

export default app;
