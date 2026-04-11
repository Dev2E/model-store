-- Script SQL para popular Vellenia Store com 20 produtos
-- Execute este script no SQL Editor do Supabase
-- https://supabase.com/dashboard (SQL Editor > New Query)

-- Desativar produtos antigos
UPDATE products SET active = false;

-- Inserir 20 novos produtos Vellenia Store
INSERT INTO products (name, description, price, category, image, stock, active) VALUES
('Camiseta Básica Branca', 'Camiseta essencial em algodão 100%. Perfeita para combinar com qualquer look. Conforto máximo e durabilidade garantida.', 89.90, 'Camisetas', '👕', 50, true),
('Camiseta Preta Lisa', 'Essencial do guarda-roupa minimalista. Camiseta preta clássica em algodão premium para qualquer ocasião.', 89.90, 'Camisetas', '👕', 50, true),
('Camiseta Cinza Mescla', 'Camiseta versátil em cinza mescla. Soft ao toque e resistente à lavagem. A base perfeita para qualquer estilo.', 89.90, 'Camisetas', '👕', 45, true),
('Camiseta Oversized Bege', 'Camiseta descontraída em corte oversized. Tecido macio e respirável, ideal para um visual confortável e elegante.', 109.90, 'Camisetas', '👕', 40, true),
('Calça Jeans Slim Azul', 'Calça jeans clássica em corte slim. Modelagem perfeita que alonga as pernas. Durável e versátil para todo dia.', 199.90, 'Calças', '👖', 35, true),
('Calça Jeans Preta Premium', 'Jeans premium em tom preto profundo. Excelente caimento e qualidade superior que dura anos.', 219.90, 'Calças', '👖', 30, true),
('Calça Chino Bege', 'Calça chino confortável em bege neutro. Perfeita para um visual casual e sofisticado ao mesmo tempo.', 189.90, 'Calças', '👖', 28, true),
('Calça Alfaiataria Cinza', 'Calça alfaiataria em cinza mescla. Elegante e confortável para reuniões e eventos especiais.', 249.90, 'Calças', '👖', 25, true),
('Blazer Oversized Branco', 'Blazer estruturado em corte oversized. Perfeito para arrasar em qualquer ocasião. Tecido de qualidade impecável.', 349.90, 'Blazers', '🧥', 20, true),
('Blazer Preto Clássico', 'Blazer preto intemporal. Elevate seu guarda-roupa com essa peça essencial que funciona em qualquer contexto.', 349.90, 'Blazers', '🧥', 18, true),
('Blazer Caramelo', 'Blazer em tom caramelo quente. Adiciona sofisticação e aconchego ao seu look de forma elegante.', 349.90, 'Blazers', '🧥', 16, true),
('Vestido Preto Minimalista', 'Vestido preto simples e elegante. A peça básica que toda mulher minimalista precisa no guarda-roupa.', 279.90, 'Vestidos', '👗', 22, true),
('Vestido Branco Longo', 'Vestido longo em branco puro. Elegância atemporal para cerimônias e eventos especiais.', 329.90, 'Vestidos', '👗', 15, true),
('Vestido Midi Cinza', 'Vestido midi em tom cinza elegante. Comprimento perfeito para um visual sofisticado e confortável.', 299.90, 'Vestidos', '👗', 18, true),
('Cardigan Creme', 'Cardigan suave em tom creme. Perfeito para camadas em dias mais frescos com máximo conforto.', 169.90, 'Cardigans', '🧶', 32, true),
('Cardigan Preto Elegante', 'Cardigan preto versátil em lã mistura. Essencial para elevar qualquer outfit casual ou formal.', 179.90, 'Cardigans', '🧶', 28, true),
('Cardigan Bege Oversized', 'Cardigan oversized em bege quente. Conforto máximo com estilo minimalista e casual chique.', 189.90, 'Cardigans', '🧶', 24, true),
('Bolsa Minimalista Preta', 'Bolsa estruturada em couro sintético preto. Funcionalidade e elegância em uma peça atemporal.', 159.90, 'Acessórios', '👜', 40, true),
('Cinto Couro Marrom', 'Cinto clássico em couro genuíno marrom. Detalhes de qualidade que completam qualquer look.', 79.90, 'Acessórios', '⌚', 60, true),
('Óculos de Sol Vintage', 'Óculos com armação vintage em metal. Proteção UV com estilo atemporal minimalista.', 129.90, 'Acessórios', '😎', 35, true);

-- Verificar que os produtos foram inseridos
SELECT COUNT(*) as total_produtos, SUM(stock) as total_estoque FROM products WHERE active = true;
