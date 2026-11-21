# Marc & Nimrha · Proyecto Nº 16.10.2027

Web onepage de la boda, hecha con Astro, GSAP, Lenis y Leaflet.

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist (estático, se sube a Netlify, Vercel, GitHub Pages…)
```

## Dónde se edita cada cosa

| Qué | Dónde |
|---|---|
| Textos, horarios, FAQ, sitios del mapa, frases de Orión | `src/data/site.ts` |
| Logo | `src/components/Nav.astro` (hueco `.nav__logo-slot`) |
| Fotos | `public/img/` (en Historia, cambia `img` en `site.ts`) |
| Colores y tipografías | `src/styles/global.css` (`:root`) |
| Viaje y alojamiento | `src/components/Travel.astro` |

Todo lo marcado como `[PENDIENTE]` en `site.ts` es contenido provisional que hay que cambiar.

## RSVP

Sin configurar, el formulario simula el envío y muestra los datos en la consola del navegador.
Para guardar las respuestas en Google Sheets, sigue los pasos de `rsvp-google-sheets.gs` y crea un archivo `.env`:

```
PUBLIC_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
```

## Notas

- Las coordenadas de la iglesia y de Can Curreu son aproximadas: revísalas en Google Maps (`spots` en `site.ts`).
- El mapa usa las teselas de OpenStreetMap (gratis y con atribución, válido para el tráfico de una boda).
- Las imágenes de `public/img` salen del save the date.
