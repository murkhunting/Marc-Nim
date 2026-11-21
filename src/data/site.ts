// ─────────────────────────────────────────────────────────────
//  CONTENIDO DE LA WEB
//  Todo el texto editable vive aquí. Lo marcado con [PENDIENTE]
//  está pensado para que lo cambiéis vosotros.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  names: { a: 'Marc', b: 'Nimrha' },
  project: 'Casarnos',
  number: '16.10.2027',
  date: '2027-10-16T17:00:00+02:00', // hora de la ceremonia (hora de Ibiza)
  dateLabel: '16/10/2027',
  place: 'Ibiza',
  coords: '39°1\'54"N  1°33\'22"E',
  promoter: 'Orión Ernesto de la Guardia',
  rsvpDeadline: '1 de julio de 2027', // [PENDIENTE]
};

export const nav = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'historia', label: 'Historia' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'itinerario', label: 'Itinerario' },
  { id: 'dresscode', label: 'Dress code' },
  { id: 'viaje', label: 'Viaje' },
  { id: 'ibiza', label: 'Ibiza' },
  { id: 'faq', label: 'Preguntas' },
  { id: 'rsvp', label: '¿Vienes?' },
];

// Frases de Orión al entrar en cada sección (aparece por la esquina)
export const cuquiLines: Record<string, string> = {
  inicio: 'Hola. Soy Orión, el promotor. Esta obra la he aprobado yo.',
  historia: 'Spoiler: lo mejor de la historia es cuando llego yo.',
  ubicacion: '1,5 km entre la iglesia y la fiesta. Yo no los andaría.',
  itinerario: 'Planning de obra aprobado. Siesta no incluida.',
  dresscode: 'El blanco es de la novia. El blanco y negro… es mío.',
  ibiza: 'Mis calas favoritas no salen. Son secreto de promotor.',
  viaje: 'Yo vengo en transportín. Vosotros, en avión.',
  faq: 'Pregunta lo que quieras. Respondo entre siesta y siesta.',
  rsvp: 'Sin licencia de asistencia no hay obra. Rellena eso.',
};

export const story = [
  {
    phase: 'Fase 01',
    tag: 'Estudio previo',
    year: '20XX',
    title: 'Cómo nos conocimos',
    text: '[PENDIENTE] Aquí va cómo se cruzaron un arquitecto de aquí y una arquitecta de Panamá. Dos o tres frases bastan.',
    img: '',
  },
  {
    phase: 'Fase 02',
    tag: 'Anteproyecto',
    year: '20XX',
    title: 'La primera cita',
    text: '[PENDIENTE] Dónde fue, quién llegó tarde y quién eligió el sitio.',
    img: '',
  },
  {
    phase: 'Fase 03',
    tag: 'Ampliación',
    year: '20XX',
    title: 'Llega Orión',
    text: '[PENDIENTE] El día que un gato tuxedo se autonombró promotor del proyecto. Nadie votó.',
    img: '/img/cuqui.jpg',
    cuqui: true,
  },
  {
    phase: 'Fase 04',
    tag: 'Licencia concedida',
    year: '20XX',
    title: 'La pedida',
    text: '[PENDIENTE] Dónde, cómo y si hubo lágrimas (las hubo).',
    img: '',
  },
  {
    phase: 'Fase 05',
    tag: 'Ejecución',
    year: '2027',
    title: 'Casarnos',
    text: 'Ibiza, 16 de octubre de 2027. Fin de obra previsto: cuando cierren la pista.',
    img: '/img/pareja.jpg',
  },
];

export const venues = {
  church: {
    label: 'Ceremonia',
    name: 'Iglesia de Sant Carles',
    sub: 'Sant Carles de Peralta',
    text: 'Iglesia blanca del siglo XVIII en el centro del pueblo, en el noreste de la isla.',
    address: 'Plaça de l\'Església, s/n · 07850 Sant Carles de Peralta',
    maps: 'https://www.google.com/maps/search/?api=1&query=Iglesia+de+Sant+Carles+de+Peralta+Ibiza',
    img: '/img/plano-iglesia.jpg',
    scale: 'E 1:2.000',
  },
  venue: {
    label: 'Celebración',
    name: 'Can Curreu',
    sub: 'Hotel rural & restaurante',
    text: 'Aperitivo, cena y fiesta entre olivos, a 1,5 km de la iglesia.',
    address: 'Ctra. de Sant Carles, km 12 · 07850 Sant Carles de Peralta',
    maps: 'https://www.google.com/maps/search/?api=1&query=Can+Curreu+Sant+Carles+de+Peralta+Ibiza',
    img: '/img/plano-can-curreu.jpg',
    scale: 'E 1:2.500',
  },
};

// [PENDIENTE] Horas provisionales
export const itinerary = [
  { time: '17:00', end: '18:00', title: 'Ceremonia', place: 'Iglesia de Sant Carles', text: 'Llegad 15 minutos antes. La novia no, la novia llega cuando quiera.', icon: 'church' },
  { time: '18:00', end: '18:30', title: 'Recepción', place: 'Can Curreu', text: 'Traslado de 1,5 km y bienvenida a la finca.', icon: 'door' },
  { time: '18:30', end: '20:30', title: 'Aperitivo', place: 'Jardines de Can Curreu', text: 'Cóctel, atardecer y primeras fotos entre olivos.', icon: 'glass' },
  { time: '20:30', end: '23:00', title: 'Cena', place: 'Can Curreu', text: 'Discursos breves (prometido). Lágrimas, las justas.', icon: 'plate' },
  { time: '23:00', end: '02:00', title: 'Fiesta', place: 'En la finca', text: 'Barra libre y pista abierta hasta las 2.', icon: 'disco' },
  { time: '02:00', end: '+', title: 'Lo que surja', place: 'Ibiza', text: 'A partir de aquí, el promotor no se hace responsable.', icon: 'moon' },
];

export const dress = [
  { code: 'A', title: 'Traje', text: 'Traje completo, con corbata o pajarita si queréis. El color, el que queráis.', fig: 'suit' },
  { code: 'B', title: 'Camisa y americana', text: 'Sin corbata y con americana. Elegante y más fresco para un atardecer de octubre.', fig: 'jacket' },
  { code: 'C', title: 'Vestido largo', text: 'Largo, fluido, de color. Ideal para el atardecer en el jardín.', fig: 'long' },
  { code: 'D', title: 'Vestido corto', text: 'De cóctel o midi. Igual de formal, más cómodo para bailar.', fig: 'short' },
];

export type Spot = {
  id: string;
  cat: 'boda' | 'cultura' | 'calas' | 'sunset' | 'comer';
  name: string;
  text: string;
  lat: number;
  lng: number;
  soon?: boolean;
};

// Coordenadas aproximadas — revisad las de la boda en Google Maps
export const spots: Spot[] = [
  { id: 'iglesia', cat: 'boda', name: 'Iglesia de Sant Carles', text: 'Aquí empieza todo. Ceremonia a las 17:00.', lat: 39.0342, lng: 1.5653 },
  { id: 'curreu', cat: 'boda', name: 'Can Curreu', text: 'Aperitivo, cena y fiesta.', lat: 39.0317, lng: 1.5561 },
  { id: 'daltvila', cat: 'cultura', name: 'Dalt Vila', text: 'Murallas renacentistas, catedral y castillo. Subid al atardecer y bajad cenando.', lat: 38.9067, lng: 1.4363 },
  { id: 'puerto', cat: 'cultura', name: 'Puerto de Ibiza', text: 'Paseo, terrazas y barcos. A los pies de Dalt Vila.', lat: 38.9114, lng: 1.4390 },
  { id: 'conta', cat: 'calas', name: 'Cala Conta', text: 'Agua turquesa y rocas. Una de las nuestras.', lat: 38.9575, lng: 1.2195 },
  { id: 'xarraca', cat: 'calas', name: 'Cala Xarraqueta', text: 'Pequeña y tranquila, en el norte. Cerquita de la boda.', lat: 39.1041, lng: 1.5052 },
  { id: 'salines', cat: 'calas', name: 'Ses Salines', text: 'Arena blanca, parque natural y ambiente.', lat: 38.8383, lng: 1.3985 },
  { id: 'hort', cat: 'calas', name: 'Cala d\'Hort', text: 'Con Es Vedrà delante. Imposible no hacer foto.', lat: 38.8895, lng: 1.2240 },
  { id: 'santantoni', cat: 'sunset', name: 'Sant Antoni', text: 'La puesta de sol clásica, en la costa de poniente.', lat: 38.9815, lng: 1.2955 },
  { id: 'vedra', cat: 'sunset', name: 'Mirador de Es Vedrà', text: 'Desde la Torre des Savinar. Llevad agua y calzado cómodo.', lat: 38.8815, lng: 1.2225 },
  { id: 'rest', cat: 'comer', name: 'Restaurantes', text: 'Estamos haciendo trabajo de campo (comiendo). Pronto, nuestra lista.', lat: 38.98, lng: 1.43, soon: true },
];

export const spotCats = [
  { id: 'all', label: 'Todo' },
  { id: 'boda', label: 'La boda' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'calas', label: 'Calas' },
  { id: 'sunset', label: 'Atardeceres' },
  { id: 'comer', label: 'Comer' },
];

export const faqs = [
  { q: '¿Hasta cuándo puedo confirmar asistencia?', a: `Hasta el ${wedding.rsvpDeadline}. Después, el promotor cierra el expediente y se va a dormir.` },
  { q: '¿Puedo llevar acompañante?', a: '[PENDIENTE] Si en tu invitación pone "y acompañante", sí. Si no, pregúntanos antes y lo hablamos.' },
  { q: '¿Pueden venir niños?', a: '[PENDIENTE] Lo estamos decidiendo. Os lo diremos con tiempo.' },
  { q: '¿Habrá transporte entre la iglesia y Can Curreu?', a: '[PENDIENTE] Están a 1,5 km. Estamos organizando cómo llevaros y, sobre todo, cómo traeros de vuelta a las 2.' },
  { q: '¿Se puede aparcar?', a: '[PENDIENTE] Sí, en el pueblo y en la finca. Si vais a beber, mejor taxi o transporte de la boda.' },
  { q: '¿Hay lista de bodas?', a: 'Lo mejor que podéis regalarnos es venir. Si aun así queréis tener un detalle, más adelante pondremos aquí un número de cuenta.' },
  { q: '¿Puedo hacer fotos en la ceremonia?', a: '[PENDIENTE] Tendremos fotógrafo. Durante la ceremonia, os pedimos guardar el móvil y disfrutarla. Después, barra libre de fotos.' },
  { q: 'Tengo alergias o una dieta especial', a: 'Indícalo en el formulario de asistencia y lo tendremos en cuenta en el menú.' },
  { q: '¿Estará Orión en la boda?', a: 'Supervisaré la obra en remoto, desde el sofá. Mi agenda no permite más.' },
];
