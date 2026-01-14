const QUESTIONS_DATA = {
  game: {
    title: "100 Católicos Dijeron - Fiesta Patronal San Sebastián 2026",
    version: "2.0"
  },
  questions: [
    {
      id: 1,
      prompt: "Menciona una manera de prepararte espiritualmente para la Fiesta Patronal.",
      answers: [
        { text: "Confesión", points: 30 },
        { text: "Misa / Comunión", points: 25 },
        { text: "Oración diaria", points: 20 },
        { text: "Leer el cuadernillo / Evangelio", points: 15 },
        { text: "Servicio / caridad", points: 10 }
      ]
    },
    {
      id: 2,
      prompt: "Menciona un fruto que esperas al contemplar al Cristo sufriente.",
      answers: [
        { text: "Esperanza", points: 30 },
        { text: "Paz interior", points: 25 },
        { text: "Fortaleza", points: 20 },
        { text: "Compasión", points: 15 },
        { text: "Confianza en Dios", points: 10 }
      ]
    },
    {
      id: 3,
      prompt: "Menciona algo que te ayuda a NO cargar solo una preocupación.",
      answers: [
        { text: "Hablar con alguien de confianza", points: 30 },
        { text: "Orar con sinceridad", points: 25 },
        { text: "Pedir apoyo a la comunidad", points: 20 },
        { text: "Buscar un consejo espiritual", points: 15 },
        { text: "Acudir a los sacramentos", points: 10 }
      ]
    },
    {
      id: 4,
      prompt: "Según la reflexión, el martirio de San Sebastián es principalmente… (completa la idea).",
      answers: [
        { text: "Fidelidad a Cristo cuando cuesta", points: 30 },
        { text: "Amar con libertad interior", points: 25 },
        { text: "Dar testimonio sin odio", points: 20 },
        { text: "Perseverar en la prueba", points: 15 },
        { text: "No buscar el sufrimiento", points: 10 }
      ]
    },
    {
      id: 5,
      prompt: "Cuando aparece el miedo (tu ‘Getsemaní’), menciona lo que más ayuda.",
      answers: [
        { text: "Orar y hablarle a Dios como estoy", points: 30 },
        { text: "Pedir fuerza / gracia", points: 25 },
        { text: "Confiar y entregarlo a Dios", points: 20 },
        { text: "Pedir que alguien ‘vele’ conmigo", points: 15 },
        { text: "Leer un salmo / Evangelio", points: 10 }
      ]
    },
    {
      id: 6,
      prompt: "Menciona una forma concreta de ‘velar’ con alguien que sufre esta semana.",
      answers: [
        { text: "Escuchar sin prisa", points: 30 },
        { text: "Llamada o mensaje", points: 25 },
        { text: "Visita", points: 20 },
        { text: "Ayuda práctica (mandado, dinero, trámite)", points: 15 },
        { text: "Orar por esa persona", points: 10 }
      ]
    },
    {
      id: 7,
      prompt: "Cuando te sientes atacado o amenazado, ¿qué ayuda a responder sin violencia?",
      answers: [
        { text: "Respirar y no reaccionar impulsivamente", points: 30 },
        { text: "Hablar con firmeza y respeto", points: 25 },
        { text: "Poner límites sanos", points: 20 },
        { text: "Orar por serenidad", points: 15 },
        { text: "Guardar silencio a tiempo", points: 10 }
      ]
    },
    {
      id: 8,
      prompt: "Menciona algo que te roba la libertad interior y conviene vigilar.",
      answers: [
        { text: "Rencor", points: 30 },
        { text: "Deseo de venganza", points: 25 },
        { text: "Amargura", points: 20 },
        { text: "Orgullo", points: 15 },
        { text: "Miedo", points: 10 }
      ]
    },
    {
      id: 9,
      prompt: "Cuando la herida viene de cerca (traición o decepción), ¿qué es lo más sano hacer?",
      answers: [
        { text: "Perdonar sin dejar que el mal gobierne", points: 30 },
        { text: "Hablar con verdad", points: 25 },
        { text: "Poner límites sin humillar", points: 20 },
        { text: "Buscar acompañamiento", points: 15 },
        { text: "Orar por sanación", points: 10 }
      ]
    },
    {
      id: 10,
      prompt: "Menciona una actitud cristiana cuando te juzgan injustamente.",
      answers: [
        { text: "Mantener la verdad con calma", points: 30 },
        { text: "Confiar en Dios", points: 25 },
        { text: "No responder con agresión", points: 20 },
        { text: "Paciencia", points: 15 },
        { text: "Silencio prudente", points: 10 }
      ]
    },
    {
      id: 11,
      prompt: "Menciona una forma de cuidar la verdad SIN humillar a nadie.",
      answers: [
        { text: "Hablar con respeto", points: 30 },
        { text: "Evitar chismes", points: 25 },
        { text: "Escuchar antes de opinar", points: 20 },
        { text: "Decir hechos, no ataques", points: 15 },
        { text: "Elegir el momento adecuado", points: 10 }
      ]
    },
    {
      id: 12,
      prompt: "Si fallas como Pedro, ¿qué te ayuda más a volver a empezar?",
      answers: [
        { text: "Arrepentirme de corazón", points: 30 },
        { text: "Confesarme", points: 25 },
        { text: "Pedir perdón", points: 20 },
        { text: "Regresar a la oración", points: 15 },
        { text: "Acercarme de nuevo a la comunidad", points: 10 }
      ]
    },
    {
      id: 13,
      prompt: "Menciona algo que a veces impide reconocer mis errores.",
      answers: [
        { text: "Orgullo", points: 30 },
        { text: "Miedo al qué dirán", points: 25 },
        { text: "Vergüenza", points: 20 },
        { text: "Excusas", points: 15 },
        { text: "Enojo", points: 10 }
      ]
    },
    {
      id: 14,
      prompt: "Menciona por qué a veces ‘nos lavamos las manos’ como Pilato.",
      answers: [
        { text: "Miedo a problemas", points: 30 },
        { text: "Presión social", points: 25 },
        { text: "Comodidad", points: 20 },
        { text: "Intereses personales", points: 15 },
        { text: "Indiferencia", points: 10 }
      ]
    },
    {
      id: 15,
      prompt: "Menciona una forma de actuar según tu conciencia aunque cueste.",
      answers: [
        { text: "Decir la verdad con caridad", points: 30 },
        { text: "Defender al débil", points: 25 },
        { text: "No participar en la injusticia", points: 20 },
        { text: "Poner límites claros", points: 15 },
        { text: "Buscar consejo antes de decidir", points: 10 }
      ]
    },
    {
      id: 16,
      prompt: "Menciona algo que NO es sano hacer con la fe (cuando se vuelve espectáculo).",
      answers: [
        { text: "Burlarse o ridiculizar", points: 30 },
        { text: "Usar a Dios para quedar bien", points: 25 },
        { text: "Buscar morbo/curiosidad", points: 20 },
        { text: "Manipular a otros con religión", points: 15 },
        { text: "Chismear de lo sagrado", points: 10 }
      ]
    },
    {
      id: 17,
      prompt: "Menciona una forma de proteger la dignidad de alguien humillado.",
      answers: [
        { text: "Tratarlo con respeto", points: 30 },
        { text: "Defenderlo ante burlas", points: 25 },
        { text: "Acompañarlo", points: 20 },
        { text: "No difundir la humillación", points: 15 },
        { text: "Ayudarlo a reconstruirse", points: 10 }
      ]
    },
    {
      id: 18,
      prompt: "Menciona una manera de consolar sin frases vacías.",
      answers: [
        { text: "Escuchar de verdad", points: 30 },
        { text: "Estar presente", points: 25 },
        { text: "Ofrecer ayuda concreta", points: 20 },
        { text: "Orar con la persona", points: 15 },
        { text: "Un gesto sencillo (abrazo/acompañar)", points: 10 }
      ]
    },
    {
      id: 19,
      prompt: "Cuando la mayoría empuja a lo incorrecto, ¿qué te ayuda a NO seguir a la multitud?",
      answers: [
        { text: "Oración", points: 30 },
        { text: "Conciencia bien formada", points: 25 },
        { text: "Discernimiento", points: 20 },
        { text: "Consejo de alguien sabio", points: 15 },
        { text: "Valentía", points: 10 }
      ]
    },
    {
      id: 20,
      prompt: "Menciona una forma de ‘elegir a Jesús’ en lo cotidiano.",
      answers: [
        { text: "Perdonar", points: 30 },
        { text: "Ser honesto", points: 25 },
        { text: "Servir a alguien", points: 20 },
        { text: "Renunciar a un pecado", points: 15 },
        { text: "Actuar con caridad", points: 10 }
      ]
    },
    {
      id: 21,
      prompt: "Menciona una forma de ser ‘Cireneo’ hoy (ayudar a cargar la cruz).",
      answers: [
        { text: "Acompañar a un enfermo", points: 30 },
        { text: "Ayudar en una necesidad concreta", points: 25 },
        { text: "Escuchar y sostener emocionalmente", points: 20 },
        { text: "Apoyar con tiempo/servicio", points: 15 },
        { text: "Orar y animar", points: 10 }
      ]
    },
    {
      id: 22,
      prompt: "Menciona un ‘gesto de Verónica’ (consuelo concreto) que puedes hacer hoy.",
      answers: [
        { text: "Una palabra de ánimo", points: 30 },
        { text: "Un mensaje / llamada", points: 25 },
        { text: "Un detalle de ayuda (comida/agua)", points: 20 },
        { text: "Acompañar un momento difícil", points: 15 },
        { text: "Orar por esa persona", points: 10 }
      ]
    },
    {
      id: 23,
      prompt: "Menciona algo que ayuda a perseverar cuando el camino se hace pesado.",
      answers: [
        { text: "Oración", points: 30 },
        { text: "Comunidad", points: 25 },
        { text: "Esperanza", points: 20 },
        { text: "Sacramentos", points: 15 },
        { text: "Disciplina / constancia", points: 10 }
      ]
    },
    {
      id: 24,
      prompt: "Menciona una de las ‘Siete Palabras’ que más te toca.",
      answers: [
        { text: "Padre, perdónalos", points: 30 },
        { text: "En tus manos encomiendo mi espíritu", points: 25 },
        { text: "Dios mío, ¿por qué me has abandonado?", points: 20 },
        { text: "Tengo sed", points: 15 },
        { text: "Todo está consumado", points: 10 }
      ]
    },
    {
      id: 25,
      prompt: "Menciona una enseñanza práctica del ‘Padre, perdónalos’.",
      answers: [
        { text: "Perdonar ofensas", points: 30 },
        { text: "No guardar rencor", points: 25 },
        { text: "Orar por quien me hirió", points: 20 },
        { text: "Poner límites sin odio", points: 15 },
        { text: "Pedir la gracia de perdonar", points: 10 }
      ]
    },
    {
      id: 26,
      prompt: "‘Tengo sed’: menciona una forma de tener sed de Dios en la semana.",
      answers: [
        { text: "Oración personal", points: 30 },
        { text: "Misa / Adoración", points: 25 },
        { text: "Leer la Biblia", points: 20 },
        { text: "Rosario", points: 15 },
        { text: "Dirección espiritual / formación", points: 10 }
      ]
    },
    {
      id: 27,
      prompt: "Menciona algo que ayuda cuando sientes oscuridad o silencio de Dios.",
      answers: [
        { text: "Permanecer (no soltar la fe)", points: 30 },
        { text: "Oración simple y constante", points: 25 },
        { text: "Buscar apoyo en la comunidad", points: 20 },
        { text: "Sacramentos", points: 15 },
        { text: "Recordar promesas / agradecer", points: 10 }
      ]
    },
    {
      id: 28,
      prompt: "Menciona una forma de acompañar a alguien en duelo o tristeza profunda.",
      answers: [
        { text: "Estar presente", points: 30 },
        { text: "Escuchar", points: 25 },
        { text: "Ayuda práctica (comida, trámites)", points: 20 },
        { text: "Orar con/por la persona", points: 15 },
        { text: "Visitar y dar seguimiento", points: 10 }
      ]
    },
    {
      id: 29,
      prompt: "Menciona un compromiso sencillo que puedes vivir esta semana.",
      answers: [
        { text: "Hacer una obra de misericordia concreta", points: 30 },
        { text: "Llamar/visitar a alguien que sufre", points: 25 },
        { text: "Escuchar sin prisa", points: 20 },
        { text: "Ofrecer una ayuda real", points: 15 },
        { text: "Pedir apoyo si yo estoy en prueba", points: 10 }
      ]
    },
    {
      id: 30,
      prompt: "Menciona una manera de vivir la fiesta con espíritu cristiano.",
      answers: [
        { text: "Participar en la misa", points: 30 },
        { text: "Servir en lo que se necesite", points: 25 },
        { text: "Convivir con caridad", points: 20 },
        { text: "Invitar a alguien a acercarse", points: 15 },
        { text: "Ofrecer la fiesta por una intención", points: 10 }
      ]
    }
  ]
};
