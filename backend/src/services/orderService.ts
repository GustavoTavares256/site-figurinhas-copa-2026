const connection = require("../database/connection");
const AppError = require("../utils/AppError");
const {
  assertRequired,
  normalizePhone,
  toPositiveInteger
} = require("../utils/validators");

async function getOrCreateCustomer(conn, customer) {
  assertRequired(customer.name, "customer.name");
  assertRequired(customer.email, "customer.email");
  assertRequired(customer.phone, "customer.phone");
  assertRequired(customer.address, "customer.address");

  const phone = normalizePhone(customer.phone);

  if (phone.length < 8) {
    throw new AppError("Telefone invalido.", 400, "VALIDATION_ERROR");
  }

  const [existing] = await conn.execute(
    "SELECT id FROM customers WHERE phone = ? LIMIT 1",
    [phone]
  );

  if (existing.length > 0) {
    await conn.execute(
      `
        UPDATE customers
        SET name = ?, email = ?, address = ?
        WHERE id = ?
      `,
      [
        customer.name.trim(),
        customer.email.trim().toLowerCase(),
        customer.address.trim(),
        existing[0].id
      ]
    );

    return existing[0].id;
  }

  const [result] = await conn.execute(
    `
      INSERT INTO customers (name, email, phone, address)
      VALUES (?, ?, ?, ?)
    `,
    [
      customer.name.trim(),
      customer.email.trim().toLowerCase(),
      phone,
      customer.address.trim()
    ]
  );

  return result.insertId;
}

async function createOrder(items, customer, couponCode = null) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Carrinho vazio.", 400, "EMPTY_CART");
  }

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    const customerId = await getOrCreateCustomer(conn, customer);
    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = toPositiveInteger(item.id, "product.id");
      const quantity = toPositiveInteger(item.quantity || 1, "quantity");

      const [products] = await conn.execute(
        `
          SELECT id, name, price, stock
          FROM products
          WHERE id = ? AND is_active = 1
          FOR UPDATE
        `,
        [productId]
      );

      if (products.length === 0) {
        throw new AppError("Produto indisponivel.", 404, "PRODUCT_NOT_FOUND");
      }

      const product = products[0];

      if (product.stock < quantity) {
        throw new AppError(
          `Estoque insuficiente para ${product.name}.`,
          409,
          "INSUFFICIENT_STOCK"
        );
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      normalizedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: unitPrice,
        line_total: Number(lineTotal.toFixed(2))
      });

      await conn.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [quantity, product.id]
      );
    }

    const coupon = await resolveCoupon(conn, couponCode, subtotal);
    const discount = coupon ? coupon.discount : 0;
    const total = Number(Math.max(subtotal - discount, 0).toFixed(2));

    const [orderResult] = await conn.execute(
      `
        INSERT INTO orders
          (customer_id, coupon_id, subtotal, discount, total, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `,
      [
        customerId,
        coupon ? coupon.id : null,
        Number(subtotal.toFixed(2)),
        discount,
        total
      ]
    );

    const orderId = orderResult.insertId;
    const values = normalizedItems.map((item) => [
      orderId,
      item.product_id,
      item.product_name,
      item.quantity,
      item.unit_price,
      item.line_total
    ]);

    await conn.query(
      `
        INSERT INTO order_items
          (order_id, product_id, product_name, quantity, unit_price, line_total)
        VALUES ?
      `,
      [values]
    );

    const stockMovementValues = normalizedItems.map((item) => [
      item.product_id,
      orderId,
      "out",
      item.quantity,
      "Venda no checkout"
    ]);

    await conn.query(
      `
        INSERT INTO stock_movements
          (product_id, order_id, type, quantity, reason)
        VALUES ?
      `,
      [stockMovementValues]
    );

    await conn.commit();

    return {
      id: orderId,
      customer,
      items: normalizedItems,
      subtotal: Number(subtotal.toFixed(2)),
      discount,
      total,
      status: "pending"
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function resolveCoupon(conn, code, subtotal) {
  if (!code) return null;

  const [rows] = await conn.execute(
    `
      SELECT id, code, type, value, starts_at, expires_at, usage_limit, used_count, is_active
      FROM coupons
      WHERE code = ? AND is_active = 1
      LIMIT 1
    `,
    [String(code).trim().toUpperCase()]
  );

  if (rows.length === 0) {
    throw new AppError("Cupom invalido.", 400, "INVALID_COUPON");
  }

  const coupon = rows[0];
  const now = new Date();

  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    throw new AppError("Cupom ainda nao esta ativo.", 400, "INVALID_COUPON");
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    throw new AppError("Cupom expirado.", 400, "INVALID_COUPON");
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new AppError("Cupom esgotado.", 400, "INVALID_COUPON");
  }

  const discount =
    coupon.type === "percent"
      ? subtotal * (Number(coupon.value) / 100)
      : Number(coupon.value);

  await conn.execute(
    "UPDATE coupons SET used_count = used_count + 1 WHERE id = ?",
    [coupon.id]
  );

  return {
    id: coupon.id,
    code: coupon.code,
    discount: Number(Math.min(discount, subtotal).toFixed(2))
  };
}

module.exports = {
  createOrder
};
