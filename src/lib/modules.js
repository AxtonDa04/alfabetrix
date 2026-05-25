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
    { type: "multiple_choice", question: "¿Cuál es la letra A?", options: ["A", "M", "P", "S"], correct: "A", audio_text: "La letra A, como en agua. Escuche con calma: A.", hint: "Piense en la palabra Agua" },
    { type: "multiple_choice", question: "¿Qué vocal suena en la palabra 'Elote'?", options: ["A", "E", "I", "O"], correct: "E", audio_text: "La letra E, como en elote. Escuche con calma: E.", hint: "Elote empieza con E" },
    { type: "multiple_choice", question: "¿Cuál es la vocal de la palabra 'Iglesia'?", options: ["U", "O", "I", "A"], correct: "I", audio_text: "La letra I, como en iglesia. Escuche con calma: I.", hint: "Iglesia empieza con I" },
    { type: "multiple_choice", question: "¿Con qué vocal empieza 'Olla'?", options: ["E", "U", "O", "A"], correct: "O", audio_text: "La letra O, como en olla. Escuche con calma: O.", hint: "Olla empieza con O" },
    { type: "multiple_choice", question: "¿Qué vocal tiene la palabra 'Uva'?", options: ["I", "U", "A", "E"], correct: "U", audio_text: "La letra U, como en uva. Escuche con calma: U.", hint: "Uva empieza con U" },
  ],
  2: [
    { type: "multiple_choice", question: "¿Cuál es la letra M?", options: ["M", "N", "P", "B"], correct: "M", audio_text: "La letra M, como en mamá. Escuche con calma: M.", hint: "Mamá empieza con M" },
    { type: "multiple_choice", question: "¿Con qué letra empieza 'Papá'?", options: ["B", "P", "D", "T"], correct: "P", audio_text: "La letra P, como en papá. Escuche con calma: P.", hint: "Papá empieza con P" },
    { type: "multiple_choice", question: "¿Qué letra suena en 'Sol'?", options: ["S", "C", "Z", "X"], correct: "S", audio_text: "La letra S, como en sol. Escuche con calma: S.", hint: "Sol empieza con S" },
    { type: "multiple_choice", question: "¿Con qué letra empieza 'Luna'?", options: ["L", "R", "N", "M"], correct: "L", audio_text: "La letra L, como en luna. Escuche con calma: L.", hint: "Luna empieza con L" },
    { type: "multiple_choice", question: "¿Cuál es la letra T?", options: ["D", "P", "T", "L"], correct: "T", audio_text: "La letra T, como en taza. Escuche con calma: T.", hint: "Taza empieza con T" },
  ],
  3: [
    { type: "multiple_choice", question: "¿Cómo se lee MA?", options: ["MA", "PA", "SA", "LA"], correct: "MA", audio_text: "M con A se lee MA. Como en mamá.", hint: "M más A" },
    { type: "multiple_choice", question: "¿Qué sílaba forma P con A?", options: ["MA", "PA", "TA", "SA"], correct: "PA", audio_text: "P con A se lee PA. Como en papá.", hint: "P más A" },
    { type: "multiple_choice", question: "¿Cómo se lee S con A?", options: ["SA", "LA", "MA", "TA"], correct: "SA", audio_text: "S con A se lee SA. Como en sala.", hint: "S más A" },
    { type: "multiple_choice", question: "¿Qué sílaba forma L con A?", options: ["PA", "LA", "MA", "TA"], correct: "LA", audio_text: "L con A se lee LA. Como en lata.", hint: "L más A" },
    { type: "multiple_choice", question: "¿Cómo suena M con E?", options: ["ME", "MI", "MO", "MA"], correct: "ME", audio_text: "M con E se lee ME. Como en mesa.", hint: "M más E" },
  ],
  4: [
    { type: "multiple_choice", question: "¿Qué palabra se forma con MA + MÁ?", options: ["MAMÁ", "PAPÁ", "MESA", "MASA"], correct: "MAMÁ", audio_text: "MA más MÁ forma mamá. Escuche con calma.", hint: "MA-MÁ" },
    { type: "multiple_choice", question: "¿Qué palabra se forma con PA + PÁ?", options: ["MAMÁ", "PAPÁ", "PALA", "PASA"], correct: "PAPÁ", audio_text: "PA más PÁ forma papá. Escuche con calma.", hint: "PA-PÁ" },
    { type: "multiple_choice", question: "¿Qué palabra se forma con ME + SA?", options: ["MASA", "MESA", "PESA", "PASA"], correct: "MESA", audio_text: "ME más SA forma mesa.", hint: "ME-SA" },
    { type: "multiple_choice", question: "¿Qué dice aquí: S-A-L-A?", options: ["SALA", "PALA", "MASA", "LATA"], correct: "SALA", audio_text: "S, A, L, A forma sala.", hint: "S-A-L-A" },
    { type: "multiple_choice", question: "¿Qué palabra es: L-A-T-A?", options: ["LATA", "PATA", "MATA", "RATA"], correct: "LATA", audio_text: "L, A, T, A forma lata.", hint: "L-A-T-A" },
  ],
  5: [
    { type: "multiple_choice", question: "¿Qué dice la frase: MAMÁ ME AMA?", options: ["Mamá me ama", "Papá me ama", "Mamá me mima", "Mamá se asoma"], correct: "Mamá me ama", audio_text: "La frase dice: Mamá me ama.", hint: "MAMÁ — ME — AMA" },
    { type: "multiple_choice", question: "¿Cuál frase dice 'Mi papá sale'?", options: ["MI PAPÁ SALE", "MI MAMÁ SALE", "MI PAPÁ PASA", "MI MAMÁ PASA"], correct: "MI PAPÁ SALE", audio_text: "Escuche la frase: Mi papá sale.", hint: "Papá y sale" },
    { type: "multiple_choice", question: "Complete: MAMÁ ___ LA MESA", options: ["PASA", "LAME", "PONE", "SALE"], correct: "PONE", audio_text: "Mamá pone la mesa. Escuche con calma.", hint: "¿Qué hace mamá con la mesa?" },
    { type: "multiple_choice", question: "¿Qué frase tiene sentido?", options: ["LA SALA ES LIMPIA", "MESA PAPÁ LA", "SALE MAMÁ LA PONE", "AMA LATA SALA"], correct: "LA SALA ES LIMPIA", audio_text: "La sala es limpia. Esta frase se entiende bien.", hint: "Busque la que se entiende bien" },
    { type: "multiple_choice", question: "Lea: MI MAMÁ ME MIMA", options: ["Mi mamá me mima", "Mi papá me mima", "Mi mamá me pasa", "Mi sala me ama"], correct: "Mi mamá me mima", audio_text: "Escuche la frase: Mi mamá me mima.", hint: "MI — MAMÁ — ME — MIMA" },
  ],
  6: [
    { type: "comprehension", question: "Lea el texto y responda: 'Mamá pone la mesa. Papá sale a la sala. La familia come junta.' ¿Qué pone mamá?", options: ["La mesa", "La sala", "La lata", "La masa"], correct: "La mesa", audio_text: "Escuche con calma. Mamá pone la mesa. ¿Qué pone mamá?", hint: "Lea la primera parte del texto" },
    { type: "comprehension", question: "'Mi papá me llama. Salimos a la tienda. Papá me toma de la mano.' ¿A dónde van?", options: ["A la tienda", "A la sala", "A la mesa", "A la escuela"], correct: "A la tienda", audio_text: "Escuche con calma. Salimos a la tienda. ¿A dónde van?", hint: "Lea la segunda oración" },
    { type: "comprehension", question: "'La lata está en la mesa. Mamá la pasa a papá.' ¿Dónde está la lata?", options: ["En la mesa", "En la sala", "En la mano", "En la lata"], correct: "En la mesa", audio_text: "Escuche con calma. La lata está en la mesa. ¿Dónde está la lata?", hint: "Lea el inicio del texto" },
    { type: "comprehension", question: "'Sale el sol. Mamá me llama. Es un lindo día.' ¿Qué sale?", options: ["El sol", "La luna", "Mamá", "Papá"], correct: "El sol", audio_text: "Escuche con calma. Sale el sol. ¿Qué sale?", hint: "Lea la primera oración" },
    { type: "comprehension", question: "'Papá pone la mesa. Mamá pasa la sal. Todos comen.' ¿Quién pone la mesa?", options: ["Papá", "Mamá", "La sal", "Todos"], correct: "Papá", audio_text: "Escuche con calma. Papá pone la mesa. ¿Quién pone la mesa?", hint: "Lea con atención quién hace cada cosa" },
  ],
};

export const LEX_MESSAGES = {
  correct: [
    "Muy bien. Esa es la respuesta.",
    "Muy bien. Siga así.",
    "Excelente trabajo. Su avance quedó guardado.",
    "Lo hizo muy bien. Continuemos con calma.",
    "Correcto. Usted va avanzando bien.",
  ],
  incorrect: [
    "Casi. Intentemos otra vez.",
    "Respire con calma. Usted puede hacerlo.",
    "Casi. Revise la pista y vuelva a intentar.",
    "Vamos paso a paso. Cada intento ayuda.",
    "Toque el botón de pista si necesita ayuda.",
  ],
  encouragement: [
    "Siga adelante. Usted está aprendiendo con calma.",
    "Cada paso cuenta. Su esfuerzo vale mucho.",
    "Usted puede hacerlo. Vamos poco a poco.",
    "Excelente trabajo. Continuemos con calma.",
    "Su avance es importante. Siga así.",
  ],
};

export function getRandomLexMessage(type) {
  const messages = LEX_MESSAGES[type] || LEX_MESSAGES.encouragement;
  return messages[Math.floor(Math.random() * messages.length)];
}
