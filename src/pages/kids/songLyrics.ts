// Auto-generated lyrics for the 12 songs at /kids-songs.
//
// Round 13 — added the 8 original songs (extracted from the ElevenLabs
//            composition_plan JSONs used to produce the EN + ES vocal tracks).
// Round 14d — extended the 4 Buzzy Bees Classics from short 4-line chants
//            into proper Verse 1 + Chorus + Verse 2 + Outro structure that
//            matches their newly generated audio.
//
// Used by the 'Show lyrics' panel on the kids songs page so children can
// read along while they listen, sing, or learn the other language.

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
  'Bridge': 'Puente',
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
  'mochis-playful-day': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Buzz buzz buzz, Mochi flies around!',
          'Touching every flower on the ground!',
          'Dancing in the garden, happy bee',
          'Come and sing along with me!',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Mochi\'s playful day, Mochi\'s playful day',
          'Through the garden bright in every which way',
          'Mochi\'s playful day, hooray hooray',
          'Sing and dance and laugh with me today',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Yellow sun is shining warm and bright',
          'Butterflies are dancing in the light',
          'Mochi sips the nectar sweet and gold',
          'Adventures everywhere, brave and bold',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Buzz buzz buzz, come and sing with me',
          'Mochi\'s playful day with the busy bee',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Zum zum zum, Mochi va volando',
          'Cada flor del jardín va tocando',
          'Bailando en el jardín, abeja feliz',
          'Ven y canta conmigo, ven aquí',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'El día juguetón, el día juguetón',
          'Por el jardín alegre, ¡qué buena canción!',
          'El día juguetón, ¡hurra y hurra!',
          'Canta y baila y ríe, ¡qué buena algarabía!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'El sol amarillo brilla con calor',
          'Las mariposas bailan con dulzor',
          'Mochi prueba el néctar dorado',
          'Aventuras hay en cada lado',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Zum zum zum, ven a cantar conmigo',
          'El día juguetón con tu mejor amigo',
        ],
      },
    ],
  },
  'garden-colors': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Red like a rose, so pretty to see',
          'Yellow like sunshine, bright as can be',
          'Green like the leaves on every tree',
          'Blue like the sky, so wild and free',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Garden colors, garden colors',
          'Every flower a different shade',
          'Garden colors, garden colors',
          'Beautiful rainbows that nature made',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Pink like a sunset, warm and bright',
          'Orange like daisies in the light',
          'Purple like lavender on the hill',
          'Colors everywhere, soft and still',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Red, yellow, green, blue, can you see?',
          'Garden colors with Mochi the bee',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Rojo como una rosa, bonito de ver',
          'Amarillo como el sol, brillante al amanecer',
          'Verde como las hojas de cada árbol',
          'Azul como el cielo, libre y genial',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Colores del jardín, colores del jardín',
          'Cada flor un color para sentir',
          'Colores del jardín, colores del jardín',
          'Arcoíris bonitos que hace el confín',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Rosado como el ocaso al brillar',
          'Naranja como margaritas al despertar',
          'Morado como lavanda en la colina',
          'Colores por todos lados, ¡qué cosa fina!',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Rojo, amarillo, verde, azul ya ves',
          'Colores del jardín con Mochi a tus pies',
        ],
      },
    ],
  },
  'busy-bees': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'We are busy busy bees',
          'Flying through the flower trees',
          'Making honey, sweet and gold',
          'The sweetest story ever told',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Buzz buzz, busy bees we are',
          'Working hard from near and far',
          'Buzz buzz, gathering each day',
          'Bringing sweetness all the way',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Each little worker plays a part',
          'Building the hive with love and heart',
          'Sharing the work, sharing the food',
          'Family of bees in a happy mood',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Busy busy bees, work and play',
          'Making honey every single day',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Somos abejas muy ocupadas',
          'Volando por las flores encantadas',
          'Haciendo miel, dulce y dorada',
          'La historia más dulce jamás contada',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Zum zum, abejitas trabajadoras',
          'Trabajando juntas a todas horas',
          'Zum zum, recogiendo sin parar',
          'Trayendo dulzura para regalar',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Cada obrera tiene su lugar',
          'Construyendo el panal con su cantar',
          'Compartiendo el trabajo y la miel',
          'Familia de abejas, dulce y fiel',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Abejas muy ocupadas, trabajan al sol',
          'Haciendo miel con todo su amor',
        ],
      },
    ],
  },
  'pollination-dance': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'Touch the flower, grab the dust',
          'Spreading pollen is a must',
          'Wiggle left, then wiggle right',
          'Pollination dance tonight',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Dance dance dance with the busy bees',
          'Carrying pollen with the gentle breeze',
          'Dance dance dance, flower to flower',
          'Pollination is our magic power',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'From the apple to the pear',
          'Spreading pollen everywhere',
          'Hop and skip and jump up high',
          'Bees and flowers say hello and bye',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Wiggle wiggle, dance and sing',
          'Pollination — what a wondrous thing',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'Toca la flor, agarra el polvo',
          'Esparcir el polen, eso es todo',
          'Muévete a la izquierda, luego a la derecha',
          'Baile de polinización, noche perfecta',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Baila baila con las abejitas',
          'Llevando polen con brisas suavecitas',
          'Baila baila, de flor en flor',
          'La polinización es nuestro mejor color',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'De la manzana hasta la pera',
          'Esparciendo polen, ¡qué linda primavera!',
          'Salta y brinca, vuela arriba',
          'Abejas y flores, ¡qué cosa más viva!',
        ],
      },
      {
        name: 'Outro',
        lines: [
          'Muévete, baila, canta sin parar',
          'Polinización — magia para regalar',
        ],
      },
    ],
  },
  // ─── Round 15: Miel de Montes (tribute song) ─────────────────────────
  // 2-minute folk-celebration song honouring mieldemontes.com — a small
  // family beekeeping business in Santa Cruz de Montes (Bierzo, León)
  // that has hand-tended hives since 1971. Every line draws from real
  // facts on their site: heather (brezo) flowers, mountain streams, the
  // gravity-fed extraction (no pumps), the year 1971, the philosophy of
  // "bees do the work, we don't ruin it." The bridge zooms out to the
  // bigger truth: small families who care for bees save forests too.
  'miel-de-montes': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'In the hills of the Bierzo where the heather grows tall',
          'Mochi found new friends, oh she tells us all',
          'Toño with his hives by the clean mountain stream',
          'Making honey real and pure, like a sweet old dream',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Dance, little bees, dance in the golden light',
          'A family that loves us, they get it right',
          'Honey of the mountains made with gentle hands',
          'This is how we save our forests, flowers and lands',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Since nineteen seventy-one, no machines, just the heart',
          'Every bee, every comb, treated like art',
          'Gravity pours the gold from the comb to the jar',
          'Bees do the magic, Toño\'s our star',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Dance, little bees, dance in the golden light',
          'A family that loves us, they get it right',
          'Honey of the mountains made with gentle hands',
          'This is how we save our forests, flowers and lands',
        ],
      },
      {
        name: 'Bridge',
        lines: [
          'When small families work with the bees and the breeze',
          'Forests grow tall and we save all the trees',
          'Big factories rush, but the gentle and true',
          'Save forests, save flowers, save Mochi and you!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'Dance, little bees, dance in the golden light',
          'A family that loves us, they get it right',
          'Thank you, Toño, dear friend of Mochi\'s heart',
          'Miel de Montes — this is just the start',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'En las montañas del Bierzo, donde el brezo florece',
          '¡Mochi encontró amigos, cuánto se merece!',
          'Toño cuida sus colmenas junto al claro arroyo',
          'Hace miel como debe, con cariño y con arrojo',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          'Miel de los montes hecha con dulzura',
          '¡Salvamos los bosques, las flores, la tierra pura!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Desde el setenta y uno, con manos que cuidan',
          'Sin bombas, sin prisa, las abejas confían',
          'Por gravedad cae el oro al cristal',
          '¡Las abejas son magia, Toño es genial!',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          'Miel de los montes hecha con dulzura',
          '¡Salvamos los bosques, las flores, la tierra pura!',
        ],
      },
      {
        name: 'Bridge',
        lines: [
          'Cuando familias pequeñas aman a las abejas',
          'Bosques, árboles y flores florecen sin quejas',
          'Las grandes fábricas corren — los buenos y los lentos',
          '¡Salvan nuestro planeta con todos sus talentos!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          '¡Gracias, querido Toño, amigo de corazón!',
          'Miel de Montes — ¡esta es nuestra canción!',
        ],
      },
    ],
  },
  // ─── Round 18: Miel de Montes — ExtendedLive (festival mix) ──────────
  // 4:10 festival-anthem remix. Lyrics are 100% verbatim from the
  // original Miel de Montes — extension is structural: a Reprise of
  // the Final Chorus and an Outro chant. The Drop, Build-up, Long
  // Intro and Mid-instrumental Break are pure instrumental sections
  // (no lyrics shown for them in the panel).
  'miel-de-montes-extended': {
    en: [
      {
        name: 'Verse 1',
        lines: [
          'In the hills of the Bierzo where the heather grows tall',
          'Mochi found new friends, oh she tells us all',
          'Toño with his hives by the clean mountain stream',
          'Making honey real and pure, like a sweet old dream',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Dance, little bee, dance in the warmth of the sun',
          'A family doing this with love, every one',
          'Honey of the mountains made with such care',
          'We save the forests, the flowers, the pure earth there!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Since nineteen seventy-one, with caring hands',
          'No fumes, no rush — the bees trust where she stands',
          'Gravity carries the gold to the glass',
          'The bees are pure magic, Toño leads the class',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          'Dance, little bee, dance in the warmth of the sun',
          'A family doing this with love, every one',
          'Honey of the mountains made with such care',
          'We save the forests, the flowers, the pure earth there!',
        ],
      },
      {
        name: 'Bridge',
        lines: [
          'When small families love the bees this way',
          'Forests, trees and flowers bloom, no delay',
          'Big factories rush — the slow, the kind, the true',
          'They save our planet with everything they do!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          'Dance, little bee, dance in the warmth of the sun',
          'A family doing this with love, every one',
          'Thank you, Toño, dear friend of Mochi\'s heart',
          'Miel de Montes — this is our song!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          '(reprise — guitar and sequencers pushed to the edge)',
          'Dance, little bee, dance in the warmth of the sun',
          'A family doing this with love, every one',
          'Thank you, Toño — Miel de Montes!',
        ],
      },
      {
        name: 'Outro',
        lines: [
          '¡Toño! ¡Toño! ¡Toño!',
          'Miel de Montes',
          '¡Toño! ¡Toño! ¡Toño!',
          'Miel de Montes',
          '¡Toño!',
          'Miel de Montes',
        ],
      },
    ],
    es: [
      {
        name: 'Verse 1',
        lines: [
          'En las montañas del Bierzo, donde el brezo florece',
          '¡Mochi encontró amigos, cuánto se merece!',
          'Toño cuida sus colmenas junto al claro arroyo',
          'Hace miel como debe, con cariño y con arrojo',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          'Miel de los montes hecha con dulzura',
          '¡Salvamos los bosques, las flores, la tierra pura!',
        ],
      },
      {
        name: 'Verse 2',
        lines: [
          'Desde el setenta y uno, con manos que cuidan',
          'Sin bombas, sin prisa, las abejas confían',
          'Por gravedad cae el oro al cristal',
          '¡Las abejas son magia, Toño es genial!',
        ],
      },
      {
        name: 'Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          'Miel de los montes hecha con dulzura',
          '¡Salvamos los bosques, las flores, la tierra pura!',
        ],
      },
      {
        name: 'Bridge',
        lines: [
          'Cuando familias pequeñas aman a las abejas',
          'Bosques, árboles y flores florecen sin quejas',
          'Las grandes fábricas corren — los buenos y los lentos',
          '¡Salvan nuestro planeta con todos sus talentos!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          '¡Gracias, querido Toño, amigo de corazón!',
          '¡Miel de Montes — esta es nuestra canción!',
        ],
      },
      {
        name: 'Final Chorus',
        lines: [
          '(reprise — guitarra y secuencias al límite)',
          '¡Baila, abejita, baila con calor!',
          'Esta familia lo hace con amor',
          '¡Gracias, querido Toño — Miel de Montes!',
        ],
      },
      {
        name: 'Outro',
        lines: [
          '¡Toño! ¡Toño! ¡Toño!',
          'Miel de Montes',
          '¡Toño! ¡Toño! ¡Toño!',
          'Miel de Montes',
          '¡Toño!',
          'Miel de Montes',
        ],
      },
    ],
  },
};
