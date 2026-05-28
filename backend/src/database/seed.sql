INSERT INTO coupons (code, type, value, usage_limit, is_active)
VALUES ('COPA10', 'percent', 10.00, NULL, 1)
ON DUPLICATE KEY UPDATE value = VALUES(value), is_active = 1;

INSERT INTO products (sku, name, description, price, category, icon, stock, image_url, is_active)
VALUES
  ('PANINI-2026-STARTER', 'Starter Pack Copa 2026', 'Album + 5 envelopes para comecar a colecao Copa 2026.', 49.90, 'pacotes', 'PACK', 80, NULL, 1),
  ('PANINI-2026-BOX50', 'Box 50 Envelopes Copa 2026', 'Caixa premium com 50 envelopes lacrados estilo colecionador.', 299.90, 'pacotes', 'BOX', 24, NULL, 1),
  ('BRA-2026-TEAM', 'Set Selecao Brasil 2026', 'Figurinhas especiais da Selecao Brasileira em acabamento premium.', 79.90, 'selecoes', 'BR', 18, NULL, 1),
  ('ARG-2026-TEAM', 'Set Argentina 2026', 'Pacote especial com craques da Argentina para completar o album.', 79.90, 'selecoes', 'AR', 16, NULL, 1),
  ('LEGEND-GOLD-01', 'Legend Gold Edition', 'Figurinha rara dourada com tiragem limitada.', 129.90, 'raras', 'STAR', 6, NULL, 1),
  ('ROOKIE-FOIL-01', 'Rookie Foil 2026', 'Carta metalizada de jovem promessa da Copa 2026.', 89.90, 'raras', 'FOIL', 9, NULL, 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  category = VALUES(category),
  icon = VALUES(icon),
  stock = VALUES(stock),
  is_active = 1;
