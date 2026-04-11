-- ============================================================
-- SETUP ADMIN USER - EXECUTAR NO SUPABASE SQL EDITOR
-- ============================================================
-- Este script marca um usuário existente como admin
-- Para usar: 
-- 1. Substitua 'seu@email.com' pelo email do seu usuário admin
-- 2. Vá para Supabase Dashboard → SQL Editor
-- 3. Cole este script
-- 4. Clique em "RUN"

-- ============================================================
-- OPÇÃO 1: Se você conhece o email do usuário
-- ============================================================
UPDATE users_profile
SET role = 'admin'
WHERE email = 'seu@email.com';

-- Verificar se foi atualizado:
SELECT id, email, role FROM users_profile WHERE email = 'seu@email.com';

-- ============================================================
-- OPÇÃO 2: Ver todos os usuários (para escolher qual será admin)
-- ============================================================
-- Descomente a linha abaixo para ver todos os usuários cadastrados:
-- SELECT id, email, role FROM users_profile ORDER BY created_at DESC;

-- ============================================================
-- OPÇÃO 3: Marcar múltiplos usuários como admin (se necessário)
-- ============================================================
-- UPDATE users_profile SET role = 'admin' WHERE email IN ('admin1@email.com', 'admin2@email.com');

-- ============================================================
-- RESETAR UM USUÁRIO PARA CUSTOMER (desfazer admin)
-- ============================================================
-- UPDATE users_profile SET role = 'customer' WHERE email = 'seu@email.com';
