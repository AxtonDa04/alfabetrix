-- =========================================================
-- ALFABETRIX - Esquema final base de datos v1
-- Motor recomendado: MySQL 8+ / MariaDB compatible
-- Pensado para usarse con Directus + React/Vite
-- Fecha: 2026-05-22
-- =========================================================

CREATE DATABASE IF NOT EXISTS alfabetrix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alfabetrix;

-- =========================================================
-- 1. Usuarios del sistema
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(150) NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  role ENUM('student','teacher','admin','family') DEFAULT 'student',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 2. Módulos educativos
-- Se crean antes de user_profiles porque el perfil puede guardar
-- current_module_id.
-- =========================================================
CREATE TABLE IF NOT EXISTS modules (
  id CHAR(36) PRIMARY KEY,
  module_key VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  order_index INT NOT NULL,
  minimum_score_to_unlock INT DEFAULT 70,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_modules_order (order_index),
  INDEX idx_modules_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 3. Lecciones por módulo
-- =========================================================
CREATE TABLE IF NOT EXISTS lessons (
  id CHAR(36) PRIMARY KEY,
  module_id CHAR(36) NOT NULL,
  lesson_key VARCHAR(80) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  order_index INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_lesson_per_module (module_id, lesson_key),
  INDEX idx_lessons_module (module_id),
  INDEX idx_lessons_order (module_id, order_index),

  CONSTRAINT fk_lessons_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 4. Perfil del estudiante/adulto mayor
-- =========================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NULL,
  name VARCHAR(120) NOT NULL,
  age INT NULL,
  photo_url TEXT NULL,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  current_module_id CHAR(36) NULL,
  current_lesson_id CHAR(36) NULL,
  current_level INT DEFAULT 1,
  total_stars INT DEFAULT 0,
  last_session_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user_profiles_user (user_id),
  INDEX idx_user_profiles_current_module (current_module_id),
  INDEX idx_user_profiles_current_lesson (current_lesson_id),

  CONSTRAINT fk_user_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_user_profiles_current_module
    FOREIGN KEY (current_module_id) REFERENCES modules(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_user_profiles_current_lesson
    FOREIGN KEY (current_lesson_id) REFERENCES lessons(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 5. Configuración de accesibilidad por perfil
-- =========================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  font_size ENUM('normal','large','extra_large') DEFAULT 'large',
  high_contrast BOOLEAN DEFAULT FALSE,
  volume INT DEFAULT 80,
  voice_enabled BOOLEAN DEFAULT TRUE,
  music_enabled BOOLEAN DEFAULT FALSE,
  navigation_voice BOOLEAN DEFAULT TRUE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_settings (user_profile_id),
  INDEX idx_user_settings_profile (user_profile_id),

  CONSTRAINT fk_user_settings_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 6. Actividades / ejercicios educativos
-- =========================================================
CREATE TABLE IF NOT EXISTS activities (
  id CHAR(36) PRIMARY KEY,
  module_id CHAR(36) NOT NULL,
  lesson_id CHAR(36) NULL,

  activity_type ENUM(
    'select_option',
    'listen_and_choose',
    'match_image_word',
    'complete_word',
    'order_letters',
    'order_phrase',
    'reading_comprehension',
    'memory_game',
    'word_search',
    'target_sound'
  ) NOT NULL,

  instruction TEXT NOT NULL,
  question TEXT NOT NULL,
  content_json JSON NULL,
  correct_answer TEXT NULL,
  audio_text TEXT NULL,
  hint TEXT NULL,
  example_text TEXT NULL,
  image_url TEXT NULL,

  difficulty ENUM('easy','medium','hard') DEFAULT 'easy',
  source ENUM('manual','ai') DEFAULT 'manual',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_activities_module (module_id),
  INDEX idx_activities_lesson (lesson_id),
  INDEX idx_activities_type (activity_type),
  INDEX idx_activities_active (is_active),

  CONSTRAINT fk_activities_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_activities_lesson
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 7. Opciones de respuesta para actividades
-- =========================================================
CREATE TABLE IF NOT EXISTS activity_options (
  id CHAR(36) PRIMARY KEY,
  activity_id CHAR(36) NOT NULL,
  option_text TEXT NOT NULL,
  option_image_url TEXT NULL,
  audio_text TEXT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,

  INDEX idx_activity_options_activity (activity_id),
  INDEX idx_activity_options_order (activity_id, order_index),

  CONSTRAINT fk_activity_options_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 8. Intentos/respuestas de usuario por actividad
-- =========================================================
CREATE TABLE IF NOT EXISTS activity_attempts (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  activity_id CHAR(36) NOT NULL,
  module_id CHAR(36) NOT NULL,

  selected_answer TEXT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INT DEFAULT 1,
  response_time_seconds INT NULL,
  feedback_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_activity_attempts_profile (user_profile_id),
  INDEX idx_activity_attempts_activity (activity_id),
  INDEX idx_activity_attempts_module (module_id),
  INDEX idx_activity_attempts_created (created_at),

  CONSTRAINT fk_activity_attempts_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_activity_attempts_activity
    FOREIGN KEY (activity_id) REFERENCES activities(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_activity_attempts_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 9. Progreso acumulado por usuario y módulo
-- =========================================================
CREATE TABLE IF NOT EXISTS module_progress (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  module_id CHAR(36) NOT NULL,

  completed_activities INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  incorrect_answers INT DEFAULT 0,
  total_responses INT DEFAULT 0,
  current_round INT DEFAULT 1,
  stars INT DEFAULT 0,
  percentage INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,

  error_summary JSON NULL,
  completed_at DATETIME NULL,
  last_activity_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_module_progress (user_profile_id, module_id),
  INDEX idx_module_progress_profile (user_profile_id),
  INDEX idx_module_progress_module (module_id),
  INDEX idx_module_progress_completed (completed),

  CONSTRAINT fk_module_progress_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_module_progress_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 10. Catálogo de recompensas/insignias
-- =========================================================
CREATE TABLE IF NOT EXISTS reward_catalog (
  id CHAR(36) PRIMARY KEY,
  reward_key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  reward_type ENUM('badge','star','certificate','achievement') DEFAULT 'badge',
  module_id CHAR(36) NULL,
  image_url TEXT NULL,
  required_percentage INT DEFAULT 70,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_reward_catalog_module (module_id),
  INDEX idx_reward_catalog_type (reward_type),
  INDEX idx_reward_catalog_active (is_active),

  CONSTRAINT fk_reward_catalog_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 11. Recompensas ganadas por usuario
-- =========================================================
CREATE TABLE IF NOT EXISTS user_rewards (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  reward_id CHAR(36) NOT NULL,
  module_id CHAR(36) NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_reward (user_profile_id, reward_id),
  INDEX idx_user_rewards_profile (user_profile_id),
  INDEX idx_user_rewards_reward (reward_id),
  INDEX idx_user_rewards_module (module_id),

  CONSTRAINT fk_user_rewards_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_user_rewards_reward
    FOREIGN KEY (reward_id) REFERENCES reward_catalog(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_user_rewards_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 12. Ejercicios generados por IA
-- =========================================================
CREATE TABLE IF NOT EXISTS generated_exercises (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NULL,
  module_id CHAR(36) NOT NULL,

  prompt TEXT NOT NULL,
  response_json JSON NOT NULL,
  source_model VARCHAR(100) DEFAULT 'gemini',
  correct_count INT NULL,
  error_summary TEXT NULL,
  words_used JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_generated_exercises_profile (user_profile_id),
  INDEX idx_generated_exercises_module (module_id),
  INDEX idx_generated_exercises_created (created_at),

  CONSTRAINT fk_generated_exercises_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_generated_exercises_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- 13. Certificados generados
-- =========================================================
CREATE TABLE IF NOT EXISTS certificates (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  module_id CHAR(36) NULL,

  certificate_type ENUM('module','final') DEFAULT 'module',
  score INT NOT NULL,
  stars INT DEFAULT 0,
  pdf_url TEXT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_certificates_profile (user_profile_id),
  INDEX idx_certificates_module (module_id),
  INDEX idx_certificates_issued (issued_at),

  CONSTRAINT fk_certificates_profile
    FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_certificates_module
    FOREIGN KEY (module_id) REFERENCES modules(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SEED inicial: módulos base
-- IDs fijos para facilitar relaciones, pruebas y Directus.
-- =========================================================
INSERT INTO modules (
  id, module_key, name, description, order_index, minimum_score_to_unlock, is_active
) VALUES
('00000000-0000-0000-0000-000000000001', 'vocales', 'Vocales', 'Reconocer vocales y asociarlas con su sonido.', 1, 70, TRUE),
('00000000-0000-0000-0000-000000000002', 'consonantes', 'Consonantes básicas', 'Reconocer consonantes frecuentes como M, P, S, L, T y N.', 2, 70, TRUE),
('00000000-0000-0000-0000-000000000003', 'silabas', 'Sílabas', 'Formar sílabas simples como ma, pa, sa, la y ta.', 3, 70, TRUE),
('00000000-0000-0000-0000-000000000004', 'palabras', 'Palabras simples', 'Leer palabras cotidianas como mamá, mesa, sol, pan y mano.', 4, 70, TRUE),
('00000000-0000-0000-0000-000000000005', 'frases', 'Frases cortas', 'Leer frases sencillas y comprender su significado.', 5, 70, TRUE),
('00000000-0000-0000-0000-000000000006', 'comprension', 'Comprensión básica', 'Leer textos breves y responder preguntas simples.', 6, 70, TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  order_index = VALUES(order_index),
  minimum_score_to_unlock = VALUES(minimum_score_to_unlock),
  is_active = VALUES(is_active);

-- =========================================================
-- SEED inicial: recompensas base por módulo
-- =========================================================
INSERT INTO reward_catalog (
  id, reward_key, name, description, reward_type, module_id, required_percentage, is_active
) VALUES
('10000000-0000-0000-0000-000000000001', 'badge_vocales', 'Insignia de Vocales', 'Reconocimiento por completar el módulo de vocales.', 'badge', '00000000-0000-0000-0000-000000000001', 70, TRUE),
('10000000-0000-0000-0000-000000000002', 'badge_consonantes', 'Insignia de Consonantes', 'Reconocimiento por completar el módulo de consonantes.', 'badge', '00000000-0000-0000-0000-000000000002', 70, TRUE),
('10000000-0000-0000-0000-000000000003', 'badge_silabas', 'Insignia de Sílabas', 'Reconocimiento por completar el módulo de sílabas.', 'badge', '00000000-0000-0000-0000-000000000003', 70, TRUE),
('10000000-0000-0000-0000-000000000004', 'badge_palabras', 'Insignia de Palabras', 'Reconocimiento por completar el módulo de palabras simples.', 'badge', '00000000-0000-0000-0000-000000000004', 70, TRUE),
('10000000-0000-0000-0000-000000000005', 'badge_frases', 'Insignia de Frases', 'Reconocimiento por completar el módulo de frases cortas.', 'badge', '00000000-0000-0000-0000-000000000005', 70, TRUE),
('10000000-0000-0000-0000-000000000006', 'badge_comprension', 'Insignia de Comprensión', 'Reconocimiento por completar comprensión básica.', 'badge', '00000000-0000-0000-0000-000000000006', 70, TRUE)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  reward_type = VALUES(reward_type),
  module_id = VALUES(module_id),
  required_percentage = VALUES(required_percentage),
  is_active = VALUES(is_active);
