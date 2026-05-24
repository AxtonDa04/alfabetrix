export const MODULES = [
  { id: 1, name: "Vocales", icon: "🔤", description: "A, E, I, O, U — sonido y trazo", color: "guinda" },
  { id: 2, name: "Consonantes", icon: "🅰️", description: "M, P, S, L, T y sílabas", color: "verde" },
  { id: 3, name: "Sílabas", icon: "📝", description: "MA, PA, SA — uniones simples", color: "guinda" },
  { id: 4, name: "Palabras", icon: "📖", description: "MAMÁ, PAPÁ, MESA con imagen", color: "verde" },
  { id: 5, name: "Frases", icon: "💬", description: "Frases cortas como MAMÁ ME AMA", color: "guinda" },
  { id: 6, name: "Comprensión", icon: "🧠", description: "Párrafo corto + pregunta", color: "verde" },
];

export const INITIAL_EXERCISES = {
  1: [
    { type: "multiple_choice", question: "¿Cuál es la letra A?", options: ["A", "M", "P", "S"], correct: "A", audio_text: "La letra A, como en Agua. Escuche bien: Aaaa.", hint: "Piense en la palabra Agua" },
    { type: "multiple_choice", question: "¿Qué vocal suena en la palabra 'Elote'?", options: ["A", "E", "I", "O"], correct: "E", audio_text: "La letra E, como en Elote. Escuche: Eeee.", hint: "Elote empieza con E" },
    { type: "multiple_choice", question: "¿Cuál es la vocal de la palabra 'Iglesia'?", options: ["U", "O", "I", "A"], correct: "I", audio_text: "La letra I, como en Iglesia. Escuche: Iiii.", hint: "Iglesia empieza con I" },
    { type: "multiple_choice", question: "¿Con qué vocal empieza 'Olla'?", options: ["E", "U", "O", "A"], correct: "O", audio_text: "La letra O, como en Olla. Escuche: Oooo.", hint: "Olla empieza con O" },
    { type: "multiple_choice", question: "¿Qué vocal tiene la palabra 'Uva'?", options: ["I", "U", "A", "E"], correct: "U", audio_text: "La letra U, como en Uva. Escuche: Uuuu.", hint: "Uva empieza con U" },
  ],
  2: [
    { type: "multiple_choice", question: "¿Cuál es la letra M?", options: ["M", "N", "P", "B"], correct: "M", audio_text: "La letra M, como en Mamá. Escuche: Mmm.", hint: "Mamá empieza con M" },
    { type: "multiple_choice", question: "¿Con qué letra empieza 'Papá'?", options: ["B", "P", "D", "T"], correct: "P", audio_text: "La letra P, como en Papá.", hint: "Papá empieza con P" },
    { type: "multiple_choice", question: "¿Qué letra suena en 'Sol'?", options: ["S", "C", "Z", "X"], correct: "S", audio_text: "La letra S, como en Sol.", hint: "Sol empieza con S" },
    { type: "multiple_choice", question: "¿Con qué letra empieza 'Luna'?", options: ["L", "R", "N", "M"], correct: "L", audio_text: "La letra L, como en Luna.", hint: "Luna empieza con L" },
    { type: "multiple_choice", question: "¿Cuál es la letra T?", options: ["D", "P", "T", "L"], correct: "T", audio_text: "La letra T, como en Taza.", hint: "Taza empieza con T" },
  ],
  3: [
    { type: "multiple_choice", question: "¿Cómo se lee MA?", options: ["MA", "PA", "SA", "LA"], correct: "MA", audio_text: "La sílaba MA, como en Mamá. M con A: MA.", hint: "M más A" },
    { type: "multiple_choice", question: "¿Qué sílaba forma P con A?", options: ["MA", "PA", "TA", "SA"], correct: "PA", audio_text: "La sílaba PA, como en Papá. P con A: PA.", hint: "P más A" },
    { type: "multiple_choice", question: "¿Cómo se lee S con A?", options: ["SA", "LA", "MA", "TA"], correct: "SA", audio_text: "La sílaba SA, como en Sala. S con A: SA.", hint: "S más A" },
    { type: "multiple_choice", question: "¿Qué sílaba forma L con A?", options: ["PA", "LA", "MA", "TA"], correct: "LA", audio_text: "La sílaba LA, como en Lata. L con A: LA.", hint: "L más A" },
    { type: "multiple_choice", question: "¿Cómo suena M con E?", options: ["ME", "MI", "MO", "MA"], correct: "ME", audio_text: "La sílaba ME, como en Mesa. M con E: ME.", hint: "M más E" },
  ],
  4: [
    { type: "multiple_choice", question: "¿Qué palabra se forma con MA + MÁ?", options: ["MAMÁ", "PAPÁ", "MESA", "MASA"], correct: "MAMÁ", audio_text: "MA más MÁ forma MAMÁ. Una palabra muy bonita.", hint: "MA-MÁ" },
    { type: "multiple_choice", question: "¿Qué palabra se forma con PA + PÁ?", options: ["MAMÁ", "PAPÁ", "PALA", "PASA"], correct: "PAPÁ", audio_text: "PA más PÁ forma PAPÁ.", hint: "PA-PÁ" },
    { type: "multiple_choice", question: "¿Qué palabra se forma con ME + SA?", options: ["MASA", "MESA", "PESA", "PASA"], correct: "MESA", audio_text: "ME más SA forma MESA. Donde comemos.", hint: "ME-SA" },
    { type: "multiple_choice", question: "¿Qué dice aquí: S-A-L-A?", options: ["SALA", "PALA", "MASA", "LATA"], correct: "SALA", audio_text: "S, A, L, A forma SALA. Donde nos sentamos.", hint: "S-A-L-A" },
    { type: "multiple_choice", question: "¿Qué palabra es: L-A-T-A?", options: ["LATA", "PATA", "MATA", "RATA"], correct: "LATA", audio_text: "L, A, T, A forma LATA.", hint: "L-A-T-A" },
  ],
  5: [
    { type: "multiple_choice", question: "¿Qué dice la frase: MAMÁ ME AMA?", options: ["Mamá me ama", "Papá me ama", "Mamá me mima", "Mamá se asoma"], correct: "Mamá me ama", audio_text: "La frase dice: Mamá me ama. Qué bonito, ¿verdad?", hint: "MAMÁ — ME — AMA" },
    { type: "multiple_choice", question: "¿Cuál frase dice 'Mi papá sale'?", options: ["MI PAPÁ SALE", "MI MAMÁ SALE", "MI PAPÁ PASA", "MI MAMÁ PASA"], correct: "MI PAPÁ SALE", audio_text: "La frase correcta es: Mi papá sale.", hint: "Papá y sale" },
    { type: "multiple_choice", question: "Complete: MAMÁ ___ LA MESA", options: ["PASA", "LAME", "PONE", "SALE"], correct: "PONE", audio_text: "Mamá pone la mesa. Es algo que hacemos todos los días.", hint: "¿Qué hace mamá con la mesa?" },
    { type: "multiple_choice", question: "¿Qué frase tiene sentido?", options: ["LA SALA ES LIMPIA", "MESA PAPÁ LA", "SALE MAMÁ LA PONE", "AMA LATA SALA"], correct: "LA SALA ES LIMPIA", audio_text: "La sala es limpia. Esta frase tiene sentido completo.", hint: "Busque la que se entiende bien" },
    { type: "multiple_choice", question: "Lea: MI MAMÁ ME MIMA", options: ["Mi mamá me mima", "Mi papá me mima", "Mi mamá me pasa", "Mi sala me ama"], correct: "Mi mamá me mima", audio_text: "Mi mamá me mima. Mimar es dar cariño.", hint: "MI — MAMÁ — ME — MIMA" },
  ],
  6: [
    { type: "comprehension", question: "Lea el texto y responda: 'Mamá pone la mesa. Papá sale a la sala. La familia come junta.' ¿Qué pone mamá?", options: ["La mesa", "La sala", "La lata", "La masa"], correct: "La mesa", audio_text: "Mamá pone la mesa. Papá sale a la sala. La familia come junta. La pregunta es: ¿Qué pone mamá?", hint: "Lea la primera parte del texto" },
    { type: "comprehension", question: "'Mi papá me llama. Salimos a la tienda. Papá me toma de la mano.' ¿A dónde van?", options: ["A la tienda", "A la sala", "A la mesa", "A la escuela"], correct: "A la tienda", audio_text: "Mi papá me llama. Salimos a la tienda. Papá me toma de la mano. ¿A dónde van?", hint: "Lea la segunda oración" },
    { type: "comprehension", question: "'La lata está en la mesa. Mamá la pasa a papá.' ¿Dónde está la lata?", options: ["En la mesa", "En la sala", "En la mano", "En la lata"], correct: "En la mesa", audio_text: "La lata está en la mesa. Mamá la pasa a papá. ¿Dónde está la lata?", hint: "Lea el inicio del texto" },
    { type: "comprehension", question: "'Sale el sol. Mamá me llama. Es un lindo día.' ¿Qué sale?", options: ["El sol", "La luna", "Mamá", "Papá"], correct: "El sol", audio_text: "Sale el sol. Mamá me llama. Es un lindo día. ¿Qué sale?", hint: "Lea la primera oración" },
    { type: "comprehension", question: "'Papá pone la mesa. Mamá pasa la sal. Todos comen.' ¿Quién pone la mesa?", options: ["Papá", "Mamá", "La sal", "Todos"], correct: "Papá", audio_text: "Papá pone la mesa. Mamá pasa la sal. Todos comen. ¿Quién pone la mesa?", hint: "Lea con atención quién hace cada cosa" },
  ],
};

export const LEX_MESSAGES = {
  correct: [
    "¡Excelente! Usted lo está haciendo muy bien.",
    "¡Así se hace! Cada paso cuenta.",
    "¡Muy bien! Siga adelante con confianza.",
    "¡Felicidades! Usted es muy capaz.",
    "¡Perfecto! Está aprendiendo rápido.",
  ],
  incorrect: [
    "Casi lo logra. Intentemos otra vez, con calma.",
    "No se preocupe, aprender lleva su tiempo. Vamos de nuevo.",
    "Está muy cerca. Recuerde, cada intento es un avance.",
    "Tranquilo/a, lo importante es seguir intentando.",
    "No pasa nada. Vamos a ver el ejemplo juntos.",
  ],
  encouragement: [
    "¡Usted es un ejemplo de valentía! Siga adelante.",
    "Aprender a leer es un regalo que se da usted mismo/a.",
    "Cada letra que aprende abre una puerta nueva.",
    "¡Qué orgullo! Está renaciendo junto a las letras.",
    "Su esfuerzo inspira. ¡Adelante!",
  ],
};

export function getRandomLexMessage(type) {
  const messages = LEX_MESSAGES[type] || LEX_MESSAGES.encouragement;
  return messages[Math.floor(Math.random() * messages.length)];
}