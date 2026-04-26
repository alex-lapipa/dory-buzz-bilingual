// Auto-generated from ElevenLabs composition_plan JSON files used to
// produce the EN and ES vocal versions of each song. These are the
// canonical lyrics — what the vocalists actually sang. Used by the
// 'Show lyrics' panel on the kids songs page so children can read
// along while they listen, sing, or learn the other language.
//
// Round 13 — additive only.

export type LyricSection = {
  /** Section name in English (e.g. 'Verse 1', 'Chorus'). */
  name: string;
  /** The lines actually sung in this section. */
  lines: string[];
};

export type SongLyrics = {
  en: LyricSection[];
  es: LyricSection[];
};

/** Section names in Spanish, indexed by their English equivalent. */
export const SECTION_NAMES_ES: Record<string, string> = {
  'Verse 1': 'Verso 1',
  'Verse 2': 'Verso 2',
  'Chorus': 'Estribillo',
  'Final Chorus': 'Estribillo final',
  'Outro': 'Cierre',
  'Intro': 'Introducción',
};

/** Lyrics for every song, keyed by song id. */
export const SONG_LYRICS: Record<string, SongLyrics> = {
  'abc-bees': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'A is for apple, B is for bee',
          'C is for caterpillar climbing the tree',
          'D is for dandelion, E for the earth',
          'F is for flowers full of fun and mirth',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'A B C, sing with me',
          'Letters of the garden, can you see?',
          'A B C, with Mochi the bee',
          'We learn the alphabet happily',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'G is for green, H is for honey sweet',
          'I is for insects with tiny little feet',
          'J is for jam, K is for kind',
          'L is for love we can always find',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'A to Z, sing with me',
          'All the letters with Mochi the bee',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'A es de abeja, B de bonita',
          'C es de campo donde Mochi habita',
          'D es de día, E es de elefante',
          'F es de flores que huelen fragantes',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'A B C, canta conmigo',
          'El abecedario es tu mejor amigo',
          'A B C, con Mochi la abejita',
          'Aprendemos letras paso a pasito',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'G es de gato, H es de hormiga',
          'I es de iglú, J de jardincita',
          'K es de kilo, L es de león',
          'M es de Mochi, ¡qué buen corazón!',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'A a Z, canta conmigo',
          'Las letras vuelan con Mochi y contigo',
        ],
      },
    ],
  },
  'garden-goodnight': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Goodnight little flower, goodnight little bee',
          'The garden is sleeping under the silver tree',
          'The moon is rising above the quiet hill',
          'And every little leaf is falling fast asleep, so still',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Sleep well, sleep tight',
          'Mochi watches through the night',
          'Dream sweet, dream long',
          'Until the morning sings its song',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Goodnight, goodnight, my little friend',
          'Until the morning light again',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Buenas noches florcita, buenas noches abejita',
          'El jardín está durmiendo bajo la luna bonita',
          'Las estrellas brillan por la ventana',
          'Y cada hojita duerme hasta mañana',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Duerme bien, duerme paz',
          'Mochi cuida tu jardín, no te vas',
          'Sueña dulce, sueña en flor',
          'Hasta que cante el sol con su calor',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Buenas noches, dulces sueños',
          'Hasta que despierte el sol mañana',
        ],
      },
    ],
  },
  'rainy-day-buzz': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Drip drop, drip drop, what do bees do?',
          'When the sky is gray and the rain falls true?',
          'They tuck inside the hive, all warm and dry',
          'And wait for the sun to brighten up the sky',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Buzz buzz, on a rainy day',
          'Snug in the hive while the raindrops play',
          'Buzz buzz, cozy in the hive',
          'Mochi keeps the colony so happy and alive',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'They share the honey, they hum a tune',
          'The whole hive together humming through the noon',
          'Until the sun peeks through the clouds again',
          'And the bees fly out to greet the world after the rain',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Plip plop, plip plop, ¿qué hacen las abejas?',
          'Cuando el cielo gris la lluvia nos despeja',
          'Se quedan en su casa, calentitas todas',
          'Esperando el sol con sus alas redondas',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Bzz bzz, en un día lluvioso',
          'La colmena calentita, ¡qué reposo!',
          'Bzz bzz, todas muy unidas',
          'Mochi cuida sus amigas queridas',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Comparten miel dorada, cantan al compás',
          'Todas juntas zumban un dulce sonido más',
          'Hasta que el sol regresa con su buen calor',
          'Y salen a volar buscando cada flor',
        ],
      },
    ],
  },
  'counting-flowers': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'One little daisy, two tulips bright',
          'Three sunflowers reaching for the light',
          'Four little roses, five lavender stems',
          'Six pretty poppies, count them all again',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Counting flowers with Mochi the bee',
          'One two three four five six seven eight',
          'Counting flowers as happy as can be',
          'Nine ten — the garden is just great',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Seven daffodils, eight pretty bees',
          'Nine little blossoms dancing in the breeze',
          'Ten happy flowers all in a row',
          'Counting in the garden everywhere we go',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Una margarita, dos tulipanes',
          'Tres girasoles brillan como dragones',
          'Cuatro rositas, cinco lavandas',
          'Seis amapolas en las verandas',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Cuento las flores con Mochi la abejita',
          'Uno, dos, tres, cuatro, cinco, seis, siete',
          'Cuento las flores, ¡qué cosa tan bonita!',
          'Ocho, nueve, diez, ¡el jardín se promete!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Siete narcisos, ocho abejitas',
          'Nueve florecillas, ¡qué cosas bonitas!',
          'Diez flores juntas en una fila',
          'Contar es la magia que nos enfila',
        ],
      },
    ],
  },
  'exploradoras': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Little explorer flying on her way',
          'Through the garden bright on a sunny day',
          'Looking for the flowers, looking for the bees',
          'Mochi shows the world from the sky to the trees',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Explorers, explorers, fly with me',
          'Discovering the garden with Mochi the bee',
          'Explorers, explorers, here we go',
          'Through the meadows where the wildflowers grow',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Buzzing past the river, climbing up the hill',
          'Stopping at the daisies, tasting honey still',
          'Friends are everywhere — the ant, the worm, the snail',
          'We adventure together along the garden trail',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Explorers, explorers, fly with me',
          'Through the world with Mochi the busy bee',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Pequeña exploradora vuela por el cielo',
          'Por el jardín brillante con todo su anhelo',
          'Busca las florcitas, busca las abejas',
          'Mochi nos enseña el mundo en sus rejas',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Exploradoras, exploradoras, ven volar',
          'Descubriendo el jardín con Mochi sin parar',
          'Exploradoras, exploradoras, ¡vamos ya!',
          'Por los prados donde el sol nos cuidará',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Zumbando por el río, subiendo la colina',
          'Probando néctar dulce de la mejor florcina',
          'Amigos hay por todas partes — hormiga, gusano',
          'La aventura juntas con su nuevo hermano',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Exploradoras, exploradoras, ven volar',
          'Por el mundo con Mochi sin descansar',
        ],
      },
    ],
  },
  'miel-bierzo': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'In the Bierzo mountains the bees are flying free',
          'Looking for the flowers in every meadow and tree',
          'Heather and the chestnut, rosemary and thyme',
          'Mochi gathers pollen, taking her sweet time',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Honey, honey, honey from the Bierzo hills',
          'Sweet and golden, every spoonful thrills',
          'Honey, honey, honey from the mountain side',
          'Brought by little bees with so much pride',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Sun is on the mountain, river sings below',
          'Mochi works so happily wherever she may go',
          'Drop by drop she gathers nectar from each flower fair',
          'Storing in the hive with all her gentle care',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'Honey, honey, honey from the Bierzo hills',
          'On your bread, your yogurt, every meal it fills',
          'Honey, honey, thank you little bees',
          'For the gift you bring from mountain trees',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'En los Montes del Bierzo vuelan abejitas',
          'Buscan flores moradas, blancas y amarillas',
          'Brezo y castaño, romero y tomillo',
          'Mochi recoge polen muy quietita y bonita',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Miel, miel, miel de Montes del Bierzo',
          'Dulce y dorada, ¡qué buen sabor tiene!',
          'Miel, miel, miel de Montes del Bierzo',
          'Las abejas la traen, ¡tralará-larala!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'El sol calienta el monte, el río canta abajo',
          'Mochi vuela contenta de trabajo en trabajo',
          'Recoge gota a gota el néctar de cada flor',
          'Y en el panal lo guarda con todo su amor',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'Miel, miel, miel de Montes del Bierzo',
          'Para tu pan, tu yogur, tu desayuno',
          'Miel, miel, miel de Montes del Bierzo',
          '¡Gracias, abejitas! ¡Tralará-larala!',
        ],
      },
    ],
  },
  'calor-panal': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'When winter comes with cold and the wind blows hard outside',
          'The little bees gather close, so close, side by side',
          'They make a tiny ball in the middle of the hive',
          'Sharing all their warmth to keep each other alive',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Warmth in the hive, warmth from the heart',
          'Bees share love and hope, never apart',
          'Warmth in the hive, family hug for me',
          'Mochi takes care of every busy bee',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'The queen is in the middle, the workers gather round',
          'Wings flutter softly making warmth that\'s safe and sound',
          'They share the honey saved from summer days of light',
          'Holding hands together, waiting through the night',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Warmth in the hive, warmth from the heart',
          'Like your family, never far apart',
          'Warmth in the hive, all together, all is well',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Cuando llega el invierno y el viento sopla fuerte',
          'Las abejas se juntan muy cerca, todas juntas',
          'Hacen una bolita en el medio del panal',
          'Para darse calorcito, calor que es muy especial',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Calor en el panal, calor de corazón',
          'Las abejitas comparten su amor y su canción',
          'Calor en el panal, abrazo familiar',
          'Mochi cuida a todos, no las deja temblar',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'La reina está en el centro y las obreras alrededor',
          'Mueven sus alitas para hacer mucho calor',
          'Comparten la miel dulce que guardaron en verano',
          'Y esperan a la primavera tomaditas de la mano',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Calor en el panal, calor de corazón',
          'Como tu familia, como un fuerte abrazo',
          'Calor en el panal, todos juntos, todos bien',
        ],
      },
    ],
  },
  'mis-flores': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'White little daisy, white as the sun',
          'Red red poppy, what a pretty one',
          'Yellow sunflower, yellow nice and bright',
          'Purple lavender smells just right',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'My favorite flowers dance in the garden bed',
          'My favorite flowers — Mochi loves them too',
          'Counting the flowers: one, two, three, four, five',
          'My favorite flowers, the ones that come alive',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Pink pink tulip, pink like a kiss',
          'Red red rose, no flower like this',
          'Golden dandelion floating in the air',
          'And the little blue flower — what name does it bear?',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'My favorite flowers dance in the garden bed',
          'With Mochi and the bees, no boredom in my head',
          'My favorite flowers, alive and pretty bright',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Margarita blanca, blanca como el sol',
          'Amapola roja, roja del color',
          'Girasol amarillo, amarillo, ¡qué bonito!',
          'Lavanda morada, ¡huele tan rico!',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Mis flores favoritas, ¡bailan en el jardín!',
          'Mis flores favoritas, ¡con Mochi son felices!',
          'Cuento las flores: una, dos, tres, cuatro, cinco',
          'Mis flores favoritas, ¡las flores que más quiero!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Tulipán rosado, rosa como un beso',
          'Rosa colorada, colorada de queso',
          'Diente de león dorado, vuela por el aire',
          'Y la florcita azul, ¿cómo se llama, dime?',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'Mis flores favoritas, ¡bailan en el jardín!',
          'Con Mochi y las abejas, ¡no quiero aburrirme!',
          'Mis flores favoritas, ¡siempre bonitas y vivas!',
        ],
      },
    ],
  },
};
