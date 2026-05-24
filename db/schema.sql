CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(150) NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  role ENUM('student','teacher','admin','family') DEFAULT 'student',
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE user_profiles (
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

  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE user_settings (
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
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id)
);
CREATE TABLE modules (
  id CHAR(36) PRIMARY KEY,
  module_key VARCHAR(80) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  order_index INT NOT NULL,
  minimum_score_to_unlock INT DEFAULT 70,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE lessons (
  id CHAR(36) PRIMARY KEY,
  module_id CHAR(36) NOT NULL,
  lesson_key VARCHAR(80) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  order_index INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (module_id) REFERENCES modules(id),
  UNIQUE KEY unique_lesson_per_module (module_id, lesson_key)
);CREATE TABLE activities (
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

  FOREIGN KEY (module_id) REFERENCES modules(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
CREATE TABLE activity_options (
  id CHAR(36) PRIMARY KEY,
  activity_id CHAR(36) NOT NULL,
  option_text TEXT NOT NULL,
  option_image_url TEXT NULL,
  audio_text TEXT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,

  FOREIGN KEY (activity_id) REFERENCES activities(id)
);
CREATE TABLE activity_attempts (
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

  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);
CREATE TABLE module_progress (
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
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);
CREATE TABLE reward_catalog (
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

  FOREIGN KEY (module_id) REFERENCES modules(id)
);
CREATE TABLE user_rewards (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  reward_id CHAR(36) NOT NULL,
  module_id CHAR(36) NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_reward (user_profile_id, reward_id),
  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
  FOREIGN KEY (reward_id) REFERENCES reward_catalog(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);
CREATE TABLE generated_exercises (
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

  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);
CREATE TABLE certificates (
  id CHAR(36) PRIMARY KEY,
  user_profile_id CHAR(36) NOT NULL,
  module_id CHAR(36) NULL,

  certificate_type ENUM('module','final') DEFAULT 'module',
  score INT NOT NULL,
  stars INT DEFAULT 0,
  pdf_url TEXT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_profile_id) REFERENCES user_profiles(id),
  FOREIGN KEY (module_id) REFERENCES modules(id)
);

INSERT INTO modules (
  id, module_key, name, description, order_index, minimum_score_to_unlock
) VALUES
(UUID(), 'vocales', 'Vocales', 'Reconocer vocales y asociarlas con su sonido.', 1, 70),
(UUID(), 'consonantes', 'Consonantes básicas', 'Reconocer consonantes frecuentes como M, P, S, L, T y N.', 2, 70),
(UUID(), 'silabas', 'Sílabas', 'Formar sílabas simples como ma, pa, sa, la y ta.', 3, 70),
(UUID(), 'palabras', 'Palabras simples', 'Leer palabras cotidianas como mamá, mesa, sol, pan y mano.', 4, 70),
(UUID(), 'frases', 'Frases cortas', 'Leer frases sencillas y comprender su significado.', 5, 70),
(UUID(), 'comprension', 'Comprensión básica', 'Leer textos breves y responder preguntas simples.', 6, 70);

INSERT INTO reward_catalog (
  id, reward_key, name, description, reward_type, required_percentage
) VALUES
(UUID(), 'badge_vocales', 'Insignia de Vocales', 'Reconocimiento por completar el módulo de vocales.', 'badge', 70),
(UUID(), 'badge_consonantes', 'Insignia de Consonantes', 'Reconocimiento por completar el módulo de consonantes.', 'badge', 70),
(UUID(), 'badge_silabas', 'Insignia de Sílabas', 'Reconocimiento por completar el módulo de sílabas.', 'badge', 70),
(UUID(), 'badge_palabras', 'Insignia de Palabras', 'Reconocimiento por completar el módulo de palabras simples.', 'badge', 70),
(UUID(), 'badge_frases', 'Insignia de Frases', 'Reconocimiento por completar el módulo de frases cortas.', 'badge', 70),
(UUID(), 'badge_comprension', 'Insignia de Comprensión', 'Reconocimiento por completar comprensión básica.', 'badge', 70);