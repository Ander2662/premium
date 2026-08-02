
const localPhotos = (folder:string) => [1,2].map(i => `/photos/${folder}/${i}.jpg`)
const singlePhoto = (folder:string) => [`/photos/${folder}/1.jpg`]
const placeholderPhotos = (count: 2 | 1 = 2) => Array(count).fill(null).map((_, i) => ({
  type: 'placeholder' as const,
  slot: i,
  label: count === 2 ? (i === 0 ? 'Nuestro mejor recuerdo' : 'Tu foto más bonita') : 'Nuestro mejor recuerdo'
}))
const singlePlaceholder = () => placeholderPhotos(1)

export const itinerary = [
  {
    id: 1, city: 'Barcelona', date: '2026-08-08', folder: 'barcelona',
    x: 20, y: 34, title: 'Salida', emoji: '⛵',
    description: 'Todo viaje tiene un punto de partida, no siempre empieza cuando subes al barco. Barcelona forma parte de nuestra historia, ayudó a que nos conociéramos. Hoy zarpamos desde aquí, pero lo importante empezó bastante antes',
    photos: [...localPhotos('barcelona'), ...placeholderPhotos(2)]
  },
  {
    id: 2, city: 'Navegación', date: '2026-08-09', folder: 'navegacion-1',
    x: 30, y: 60, title: 'Mar abierto', emoji: '🌊',
    description: 'Los griegos pensaban que el Mediterráneo estaba bajo la protección de Poseidón y que ningún día en el mar era igual al anterior. Hoy no tenemos ningún destino por delante, quizá por eso sea uno de los mejores días del viaje.',
    photos: [...singlePhoto('navegacion-1'), ...singlePlaceholder()]
  },
  {
    id: 3, city: 'Valeta', date: '2026-08-10', folder: 'valeta',
    x: 46, y: 58, title: 'Malta', emoji: '🏰',
    description: 'La ciudad construida por caballeros para caballeros, llena de historia. Aprovechemos el día para escribir la nuestra.',
    photos: [...localPhotos('valeta'), ...placeholderPhotos(2)]
  },
  {
    id: 4, city: 'Navegación', date: '2026-08-11', folder: 'navegacion-2',
    x: 60, y: 70, title: 'Rumbo a Grecia', emoji: '🧭',
    description: 'Los barcos antiguos llevaban un cuaderno de bitacora donde quedaba registrado todo lo importante del viaje. Despues de darle muchas vueltas, me he dado cuenta de que nosotros llevamos bastante tiempo navegando... pero hay un pequeno detalle que nunca hemos dejado por escrito. Tecnicamente, creo que estamos incurriendo en una irregularidad.',
    photos: [...singlePhoto('navegacion-2'), ...singlePlaceholder()]
  },
  {
    id: 5, city: 'Santorini', date: '2026-08-12', folder: 'santorini',
    x: 75, y: 63, title: 'Tu cumpleaños 🎂', emoji: '🎂',
    description: 'La isla más bonita del mundo con la chica más bonita del mundo. Tu día es tan especial que el mundo te regala un eclipse. Cúpulas azules, atardecer en Oia y tú cumpliendo años.',
    photos: [...localPhotos('santorini'), ...placeholderPhotos(2)]
  },
  {
    id: 6, city: 'Kusadasi', date: '2026-08-13', folder: 'kusadasi',
    x: 83, y: 53, title: 'Turquía', emoji: '🕌',
    description: 'Bienvenida a Turquía. La mayoría de la gente viene por su historia, por lugares como Éfeso. Nosotros decimos que vendremos por razones menos culturales: tú por algún retoquito y yo por recuperar un poco de dignidad capilar. Por desgracia, hoy solo toca hacer turismo.',
    photos: [...localPhotos('kusadasi'), ...placeholderPhotos(2)]
  },
  {
    id: 7, city: 'Mykonos', date: '2026-08-14', folder: 'mykonos',
    x: 76, y: 53, title: 'Islas griegas', emoji: '🌬️',
    description: 'Mykonos fue durante siglos un refugio para pescadores y marineros. Los molinos existen porque el viento era esencial para la vida de la isla.',
    photos: [...localPhotos('mykonos'), ...placeholderPhotos(2)]
  },
  {
    id: 8, city: 'Atenas', date: '2026-08-15', folder: 'atenas',
    x: 69, y: 49, title: 'La Acrópolis', emoji: '🏛️',
    description: 'Llegar al último puerto da un poco de pena, pero también significa que el viaje ha merecido la pena. Ojalá dentro de unos años veamos estas fotos y recordemos el viaje con una pregunta que ya iba siendo hora de hacer.',
    photos: [...localPhotos('atenas'), ...placeholderPhotos(2)]
  },
]
