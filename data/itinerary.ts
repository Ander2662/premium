
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
    description: 'Zarpamos desde el puerto de Barcelona, puerta del Mediterráneo. Una ciudad que ayudó a unirnos más de lo que pensamos.',
    photos: [...localPhotos('barcelona'), ...placeholderPhotos(2)]
  },
  {
    id: 2, city: 'Navegación', date: '2026-08-09', folder: 'navegacion-1',
    x: 30, y: 60, title: 'Mar abierto', emoji: '🌊',
    description: 'Primer día de viaje. Horizonte infinito, brisa salada y tú a mi lado. No necesito más.',
    photos: [...singlePhoto('navegacion-1'), ...singlePlaceholder()]
  },
  {
    id: 3, city: 'Valeta', date: '2026-08-10', folder: 'valeta',
    x: 46, y: 58, title: 'Malta', emoji: '🏰',
    description: 'La ciudad construida por caballeros para caballeros. Bastiones barrocos, Gran Puerto y la historia de los Caballeros de Malta.',
    photos: [...localPhotos('valeta'), ...placeholderPhotos(2)]
  },
  {
    id: 4, city: 'Navegación', date: '2026-08-11', folder: 'navegacion-2',
    x: 60, y: 70, title: 'Rumbo a Grecia', emoji: '🧭',
    description: 'Cruzamos el Mediterráneo Oriental. Mañana amanece Santorini en el horizonte.',
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
    description: 'Puerto turco a las puertas de Éfeso. La biblioteca de Celso, el gran teatro y el Mediterráneo más turquesa.',
    photos: [...localPhotos('kusadasi'), ...placeholderPhotos(2)]
  },
  {
    id: 7, city: 'Mykonos', date: '2026-08-14', folder: 'mykonos',
    x: 76, y: 53, title: 'Islas griegas', emoji: '🌬️',
    description: 'La isla de los vientos. Molinos blancos, Little Venice y las calles más fotogénicas del Egeo.',
    photos: [...localPhotos('mykonos'), ...placeholderPhotos(2)]
  },
  {
    id: 8, city: 'Atenas', date: '2026-08-15', folder: 'atenas',
    x: 69, y: 49, title: 'La Acrópolis', emoji: '🏛️',
    description: 'Última escala: la cuna de la civilización occidental. El Partenón, la Acrópolis y el vuelo de vuelta con la maleta llena de recuerdos.',
    photos: [...localPhotos('atenas'), ...placeholderPhotos(2)]
  },
]
