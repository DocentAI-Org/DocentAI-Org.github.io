/*
 * Copy for the page. Spanish lives in index.html (it is read from the DOM at start); `EN` holds the
 * English for every data-i18n key. The demos are scripted and their courses are fictional.
 */
window.DOCENTAI = (function () {
  var m = function (s) { return '<span class="math">' + s + "</span>"; };
  var ref = '<sup class="ref"><a href="#demo-margin">1</a></sup>';

  var EN = window.DOCENTAI_EN;

  // Strings the scripts write, in both languages.
  var UI = {
    es: {
      allowance: function (n) { return n + " de 30 hoy"; },
      sourceTitle: "Fuente",
      validated: "Validado por tu profesor/a",
      noSourceTitle: "Tu material no cubre esta pregunta",
      noSourceBody: "No está en los documentos de tu profesor/a, así que no me lo invento. Pregúntalo en clase.",
      emptyTitle: "Sin fuente",
      emptyBody: "Ningún documento del curso respalda una respuesta.",
      excluded: "Excluido",
      included: "Incluido",
      toggleDoc: function (name) { return "Incluir " + name + " en el material del curso"; },
      tutor: "Tutor del curso",
      waiting: "Elige una pregunta para ver la respuesta y su fuente.",
      seeSolution: "Ver la solución",
      anotherHint: "Otra pista",
      noMoreHints: "No hay más pistas: ahora te toca a ti. Envía tu resultado y te diré si es correcto.",
      policySet: function (p) { return "Política fijada por tu profesor/a: " + p + "."; },
      hint: "Pista",
      attempt: function (i, n) { return "Intento " + i + " de " + n; },
      exercise: "Ejercicio",
      answerLabel: "Respuesta del estudiante",
      times: function (n) { return n === 1 ? "1 vez" : n + " veces"; },
      practice: "práctica propuesta",
      overcome: "Superado"
    },
    en: {
      allowance: function (n) { return n + " of 30 today"; },
      sourceTitle: "Source",
      validated: "Validated by your teacher",
      noSourceTitle: "Your material doesn't cover this question",
      noSourceBody: "It isn't in your teacher's documents, so I won't make it up. Ask in class.",
      emptyTitle: "No source",
      emptyBody: "No course document supports an answer.",
      excluded: "Excluded",
      included: "Included",
      toggleDoc: function (name) { return "Include " + name + " in the course material"; },
      tutor: "Course tutor",
      waiting: "Pick a question to see the answer and its source.",
      seeSolution: "Show the solution",
      anotherHint: "Another hint",
      noMoreHints: "No more hints: your turn now. Send your result and I'll tell you if it's right.",
      policySet: function (p) { return "Policy set by your teacher: " + p + "."; },
      hint: "Hint",
      attempt: function (i, n) { return "Attempt " + i + " of " + n; },
      exercise: "Exercise",
      answerLabel: "Student's answer",
      times: function (n) { return n === 1 ? "once" : n + " times"; },
      practice: "practice offered",
      overcome: "Overcome"
    }
  };

  var SUBJECTS = [
    {
      id: "maths",
      tab: { es: "Matemáticas", en: "Maths" },
      course: { es: "Matemáticas · 3º ESO", en: "Maths · Year 9" },
      docs: [
        { id: "eq", name: "ecuaciones.md", meta: { es: "Tema 3 · 12 fragmentos", en: "Unit 3 · 12 fragments" } },
        { id: "prop", name: "proporcionalidad.pdf", meta: { es: "Tema 4 · 18 fragmentos", en: "Unit 4 · 18 fragments" } }
      ],
      questions: [
        {
          q: { es: "¿Cómo despejo la x en 3x + 5 = 20?", en: "How do I solve 3x + 5 = 20 for x?" },
          doc: "eq",
          a: {
            es: ["Deja la x sola haciendo lo mismo en los dos miembros de la igualdad." + ref,
              "Resta 5: " + m("3x = 15") + ". Divide entre 3: " + m("x = 5") + ".",
              "Comprueba: " + m("3·5 + 5 = 20") + "."],
            en: ["Get x on its own by doing the same thing to both sides of the equation." + ref,
              "Subtract 5: " + m("3x = 15") + ". Divide by 3: " + m("x = 5") + ".",
              "Check: " + m("3·5 + 5 = 20") + "."]
          },
          where: { es: "ecuaciones.md · §3.2 Ecuaciones de primer grado", en: "ecuaciones.md · §3.2 Linear equations" },
          quote: { es: "Lo que suma en un miembro pasa restando al otro; lo que multiplica pasa dividiendo.", en: "What is added on one side moves to the other subtracting; what multiplies moves dividing." }
        },
        {
          q: { es: "¿Qué es una regla de tres directa?", en: "What is a direct rule of three?" },
          doc: "prop",
          a: {
            es: ["Es una forma de hallar un valor desconocido cuando dos magnitudes son directamente proporcionales: si una se duplica, la otra también." + ref,
              "Si 3 cuadernos cuestan 6 €, 5 cuadernos cuestan " + m("5 · 6 / 3 = 10 €") + "."],
            en: ["It finds an unknown value when two quantities are directly proportional: if one doubles, so does the other." + ref,
              "If 3 notebooks cost €6, 5 notebooks cost " + m("5 · 6 / 3 = €10") + "."]
          },
          where: { es: "proporcionalidad.pdf · pág. 6", en: "proporcionalidad.pdf · p. 6" },
          quote: { es: "Dos magnitudes son directamente proporcionales si su cociente es constante.", en: "Two quantities are directly proportional if their ratio is constant." }
        },
        { q: { es: "¿Quién descubrió el número π?", en: "Who discovered the number π?" }, doc: null }
      ]
    },
    {
      id: "lang",
      tab: { es: "Lengua", en: "Literature" },
      course: { es: "Lengua y Literatura · 1º Bachillerato", en: "Spanish Literature · Year 12" },
      docs: [
        { id: "fig", name: "figuras-retoricas.pdf", meta: { es: "Tema 2 · 9 fragmentos", en: "Unit 2 · 9 fragments" } },
        { id: "g27", name: "generacion-del-27.docx", meta: { es: "Tema 7 · 15 fragmentos", en: "Unit 7 · 15 fragments" } }
      ],
      questions: [
        {
          q: { es: "¿Qué diferencia hay entre metáfora y símil?", en: "What's the difference between a metaphor and a simile?" },
          doc: "fig",
          a: {
            es: ["Las dos comparan dos realidades, pero el símil usa un nexo («como», «cual») y la metáfora no." + ref,
              "Símil: «tus ojos son como luceros». Metáfora: «tus ojos son luceros»."],
            en: ["Both compare two things, but a simile uses a link word (“like”, “as”) and a metaphor doesn't." + ref,
              "Simile: “your eyes are like stars”. Metaphor: “your eyes are stars”."]
          },
          where: { es: "figuras-retoricas.pdf · pág. 4", en: "figuras-retoricas.pdf · p. 4" },
          quote: { es: "Metáfora: identificación de un término real con uno imaginario, sin nexo comparativo.", en: "Metaphor: a real term identified with an imaginary one, with no comparative link." }
        },
        {
          q: { es: "¿Qué autores forman la Generación del 27?", en: "Which writers make up the Generation of '27?" },
          doc: "g27",
          a: {
            es: ["Según tus apuntes, el núcleo lo forman Salinas, Guillén, Gerardo Diego, Aleixandre, Dámaso Alonso, Lorca, Alberti, Cernuda, Prados y Altolaguirre." + ref,
              "Los une el homenaje a Góngora de 1927, que da nombre al grupo."],
            en: ["According to your notes, the core is Salinas, Guillén, Gerardo Diego, Aleixandre, Dámaso Alonso, Lorca, Alberti, Cernuda, Prados and Altolaguirre." + ref,
              "The 1927 tribute to Góngora brought them together and gave the group its name."]
          },
          where: { es: "generacion-del-27.docx · §1 El grupo", en: "generacion-del-27.docx · §1 The group" },
          quote: { es: "El acto del Ateneo de Sevilla en 1927, tricentenario de Góngora, reúne a los poetas del grupo.", en: "The 1927 event at the Ateneo de Sevilla, Góngora's tercentenary, brings the group's poets together." }
        },
        { q: { es: "¿Cuál es la mejor novela de la historia?", en: "What is the best novel ever written?" }, doc: null }
      ]
    },
    {
      id: "db",
      tab: { es: "Universidad", en: "University" },
      course: { es: "Bases de Datos · Grado en Informática", en: "Databases · BSc Computer Science" },
      docs: [
        { id: "norm", name: "T3-normalizacion.pdf", meta: { es: "Tema 3 · 22 fragmentos", en: "Unit 3 · 22 fragments" } },
        { id: "sql", name: "practica-2-sql.md", meta: { es: "Práctica 2 · 8 fragmentos", en: "Lab 2 · 8 fragments" } }
      ],
      questions: [
        {
          q: { es: "¿Cuándo está una tabla en tercera forma normal?", en: "When is a table in third normal form?" },
          doc: "norm",
          a: {
            es: ["Cuando está en 2FN y ningún atributo no clave depende transitivamente de la clave primaria." + ref,
              "Si " + m("alumno → grupo → tutor") + ", el tutor debe pasar a una tabla de grupos."],
            en: ["When it is in 2NF and no non-key attribute depends transitively on the primary key." + ref,
              "If " + m("student → group → tutor") + ", the tutor belongs in a groups table."]
          },
          where: { es: "T3-normalizacion.pdf · diapositiva 14", en: "T3-normalizacion.pdf · slide 14" },
          quote: { es: "3FN: 2FN y sin dependencias transitivas de atributos no primos respecto de la clave.", en: "3NF: 2NF with no transitive dependencies of non-prime attributes on the key." }
        },
        {
          q: { es: "¿Qué devuelve un LEFT JOIN?", en: "What does a LEFT JOIN return?" },
          doc: "sql",
          a: {
            es: ["Todas las filas de la tabla izquierda y, de la derecha, solo las que cumplen la condición; si no hay coincidencia, sus columnas valen NULL." + ref,
              "En la práctica, " + m("alumnos LEFT JOIN entregas") + " lista también a quien no ha entregado."],
            en: ["Every row of the left table and, from the right, only the matching ones; where nothing matches, its columns are NULL." + ref,
              "In the lab, " + m("students LEFT JOIN submissions") + " also lists who hasn't submitted."]
          },
          where: { es: "practica-2-sql.md · §2.3 Combinaciones externas", en: "practica-2-sql.md · §2.3 Outer joins" },
          quote: { es: "LEFT JOIN conserva todas las filas de la tabla izquierda.", en: "LEFT JOIN keeps every row of the left table." }
        },
        { q: { es: "¿Qué base de datos usa Netflix?", en: "Which database does Netflix use?" }, doc: null }
      ]
    }
  ];

  var POLICY = {
    names: { es: { direct: "Directa", hintsFirst: "Pistas primero", hintsOnly: "Solo pistas" },
      en: { direct: "Direct", hintsFirst: "Hints first", hintsOnly: "Hints only" } },
    steps: {
      es: ["Divide los dos miembros entre 2: " + m("x − 3 = 5"), "Suma 3 a los dos miembros: " + m("x = 8"), "Comprueba: " + m("2(8 − 3) = 10") + " ✓"],
      en: ["Divide both sides by 2: " + m("x − 3 = 5"), "Add 3 to both sides: " + m("x = 8"), "Check: " + m("2(8 − 3) = 10") + " ✓"]
    },
    hints: {
      es: ['<span class="hint-mark">¿Qué operación deshace el 2</span> que multiplica al paréntesis? Aplícala a los dos miembros.',
        "Si divides entre 2 te queda " + m("x − 3 = 5") + '. <span class="hint-mark">¿Qué número menos 3 da 5?</span>'],
      en: ['<span class="hint-mark">Which operation undoes the 2</span> multiplying the brackets? Apply it to both sides.',
        "Dividing by 2 leaves " + m("x − 3 = 5") + '. <span class="hint-mark">What number minus 3 makes 5?</span>']
    }
  };

  var ATTEMPTS = [
    {
      day: { es: "Lunes", en: "Monday" },
      ex: "5 − (x − 2)",
      work: '5 − x <span class="mistake">− 2</span> = 3 − x',
      kind: "wrong", marks: 1,
      fb: { es: "<strong>Signo ante un paréntesis.</strong> El menos cambia el signo de todo lo de dentro: " + m("−(x − 2) = −x + 2") + ". El resultado es " + m("7 − x") + ".",
        en: "<strong>Sign before brackets.</strong> The minus changes the sign of everything inside: " + m("−(x − 2) = −x + 2") + ". The result is " + m("7 − x") + "." }
    },
    {
      day: { es: "Miércoles", en: "Wednesday" },
      ex: "3 − (2x − 4)",
      work: '3 − 2x <span class="mistake">− 4</span> = −1 − 2x',
      kind: "repeat", marks: 2,
      fb: { es: "<strong>Otra vez el signo ante un paréntesis.</strong> Es la segunda vez que aparece, así que te propongo una explicación corta y tres ejercicios para practicarlo.",
        en: "<strong>Sign before brackets, again.</strong> It's the second time it has come up, so here is a short explanation and three exercises to practise it." }
    },
    {
      day: { es: "Viernes", en: "Friday" },
      ex: "7 − (x − 1)",
      work: "7 − x + 1 = 8 − x",
      kind: "right", marks: 2,
      fb: { es: "<strong>Correcto.</strong> Has cambiado bien los dos signos. Este error queda superado y desaparece de tus próximos pasos.",
        en: "<strong>Correct.</strong> You changed both signs. This mistake is now overcome and leaves your next steps." }
    }
  ];

  return { EN: EN, UI: UI, SUBJECTS: SUBJECTS, POLICY: POLICY, ATTEMPTS: ATTEMPTS };
})();
