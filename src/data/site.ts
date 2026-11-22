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
  historia: 'Esta memoria la he redactado yo. Se nota la calidad.',
  ubicacion: '1,5 km entre la iglesia y la fiesta. Yo no los andaría.',
  itinerario: 'Planning de obra aprobado. Siesta no incluida.',
  dresscode: 'El blanco es de la novia. El blanco y negro… es mío.',
  ibiza: 'Mis calas favoritas no salen. Son secreto de promotor.',
  viaje: 'Yo vengo en transportín. Vosotros, en avión.',
  faq: 'Pregunta lo que quieras. Respondo entre siesta y siesta.',
  rsvp: 'Sin licencia de asistencia no hay obra. Rellena eso.',
};

// Memoria narrada por Orión. "hover" = comentario del promotor al pasar por la viñeta.
// [PENDIENTE] años y fotos (img: '/img/historia/…')
export const story = [
  {
    phase: 'Fase 01', tag: 'Toma de datos', year: '20XX',
    title: 'De fondo en la foto',
    text: 'Boda de Patri y Ross: tres días, la más loca y divertida que recuerdan. Mis humanos, damas de honor de Patri, salen de fondo en la misma foto. Ni se conocían.',
    hover: 'Míralos, de extras. Yo nací protagonista.',
    img: '/img/historia/1.webp',
  },
  {
    phase: 'Fase 02', tag: 'Estudio previo', year: '20XX',
    title: 'Horas y horas de charla',
    text: 'Su primera foto juntos. Hablaron durante horas y ahí ya se cimentaba algo. Luego llegó la despedida, durísima: ella volvía a Panamá y él a Barcelona.',
    hover: 'Tantas horas hablando y ni una sobre mí. Imperdonable.',
    img: '/img/historia/2.webp',
  },
  {
    phase: 'Fase 03', tag: 'Coordinación en remoto', year: '20XX',
    title: 'Obra a distancia',
    text: 'Más de un año a 8.600 km: videollamadas, fotos y mensajes. Ella soñaba con venir a trabajar a Barcelona. Yo salía en cámara sin cobrar derechos de imagen.',
    hover: 'Captura de pantalla. Mi mejor ángulo no sale, por cierto.',
    img: '/img/historia/3.webp',
    pos: 'top', // la parte superior de la captura es la que se ve
  },
  {
    phase: 'Fase 04', tag: 'Traslado de material', year: '20XX',
    title: 'Panamá → Barcelona',
    text: '15 horas de vuelo y un reencuentro muy esperado. Para ellos, romántico. Para mí, transportín, turbulencias y cero catering. Presenté queja formal.',
    hover: 'No lo repetiría ni por todo el atún del mundo.',
    img: '/img/historia/4.webp',
  },
  {
    phase: 'Fase 05', tag: 'Reconocimiento del terreno', year: '20XX',
    title: 'Primeras citas',
    text: 'Paseos por Barcelona: él le enseñaba la ciudad y ella conocía a los amigos. Precioso todo. Yo, mientras, inspeccionaba cada rincón del nuevo territorio.',
    hover: 'Barcelona aprobada. Falta revisar las vistas desde la ventana.',
    img: '/img/historia/5.webp',
  },
  {
    phase: 'Fase 06', tag: 'Ejecución de obra', year: '20XX',
    title: 'Piso compartido',
    text: 'Un piso pequeño con Alex y María, que acogieron a Nim de maravilla. Mientras, Marc compró piso, dibujó los planos e hizo la obra. Yo pasé a tener 4 esclavos.',
    hover: 'Alex, María: gracias por todo. Sobre todo por las latas.',
    img: '/img/historia/6.webp',
  },
  {
    phase: 'Fase 07', tag: 'Visado', year: '20XX',
    title: 'El filtro ibicenco',
    text: 'Siguiente reto: conocer a la familia de Marc y superar el filtro ibicenco. Nim les cayó genial y, prueba definitiva, le encantó la salsa de Nadal. Visado concedido.',
    hover: 'Salsa de Nadal aprobada. Yo sigo esperando mi ración.',
    img: '/img/historia/7.webp',
  },
  {
    phase: 'Fase 08', tag: 'Primera ocupación', year: '20XX',
    title: 'Casa nueva',
    text: 'Estreno del piso recién reformado. Planos de Marc, ilusión de Nim y una distribución pensada al milímetro… para mí. Desde entonces, soy el rey de la casa.',
    hover: 'El sofá es mío. Vosotros podéis usar la esquina.',
    img: '/img/historia/8.webp',
  },
  {
    phase: 'Fase 09', tag: 'Homologación internacional', year: '20XX',
    title: 'El filtro panameño',
    text: 'Le tocaba a Marc: viaje a Panamá a conocer a la familia de Nim. Superó todas las pruebas y mis abuelos y tíos le acogieron como a uno más. Yo no fui.',
    hover: '¿Volver a Panamá? Con mi vida de rey en Europa, ni loco.',
    img: '/img/historia/9.webp',
  },
  {
    phase: 'Fase 10', tag: 'Licencia concedida', year: '20XX',
    title: 'La pedida',
    text: 'En Bélgica, Marc le pidió matrimonio a Nim. ¡Y dijo que sí! Que conste: yo autoricé la operación, puse mi sello y elegí el anillo. Sin mí, no habría boda.',
    hover: 'Ya lo sabía todo antes que vosotros. De nada, otra vez.',
    img: '/img/historia/10.webp',
  },
  {
    phase: 'Fase 11', tag: 'Inauguración', year: '2027',
    title: 'Casarnos',
    text: 'Ibiza, 16 de octubre de 2027. Si has llegado hasta aquí es porque eres muy importante para mis dos humanos. Ahora te toca a ti formar parte de esta historia.',
    hover: 'Confirma asistencia. Lo digo yo, que soy el promotor.',
    img: '/img/historia/11.webp',
    cutout: true, // recorte con fondo transparente: se muestra sobre el gris de la portada
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
