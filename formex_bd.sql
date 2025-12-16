-- 1. CREAR BASE DE DATOS (Si no existe)
CREATE DATABASE IF NOT EXISTS formex_db;
USE formex_db;

-- 2. TABLA ROLES
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_name (name)
);

-- 3. TABLA USUARIOS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    enabled BIT(1) DEFAULT 1, 
    created_at DATETIME(6),  
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
);

-- 4. TABLA INTERMEDIA (MUCHOS A MUCHOS)
-- Relaciona usuarios con roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- 5. DATOS OBLIGATORIOS (SEMILLA)
-- Sin esto, el registro de usuarios fallará porque no encontrará el rol 'ROLE_STUDENT'
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_STUDENT');
INSERT INTO roles (name) VALUES ('ROLE_INSTRUCTOR');




-- (Opcional) Confirmar que se crearon los roles
SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM user_roles;