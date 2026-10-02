# Inspecciones obligatorias en comunidades de propietarios — datos abiertos

Catálogo de las inspecciones, revisiones y mantenimientos obligatorios en edificios
de viviendas de España: normas estatales, autonómicas y ordenanzas municipales, con
su periodicidad, la norma y el artículo que las exigen, el enlace al texto oficial y
la horquilla de sanción.

Lo mantiene [FincasAlDía](https://fincasaldia.es), el expediente digital de tu
comunidad. Son los mismos datos que usa su motor de normativas y los que se pueden
consultar y filtrar en
[fincasaldia.es/recursos/normativas-abiertas](https://fincasaldia.es/recursos/normativas-abiertas/).

<!-- cifras:inicio -->
**Última actualización de los datos:** 2026-10-02

| | Filas |
|---|---:|
| **Total** | **133** |
| Ámbito estatal (todas las comunidades) | 72 |
| Ámbito autonómico o estatal con excepciones | 52 |
| Ordenanzas municipales | 9 |
| Tipo ITE | 24 |
| Tipo OCA | 27 |
| Tipo revisión | 38 |
| Tipo mantenimiento | 44 |
<!-- cifras:fin -->

Los datos se actualizan solos cada semana desde la base de datos de FincasAlDía
(ver [`scripts/actualizar.mjs`](scripts/actualizar.mjs) y el
[historial de cambios](CHANGELOG.md)).

## Archivos

| Archivo | Formato |
|---|---|
| [`normativas.csv`](normativas.csv) | CSV UTF-8 con BOM, separador coma. Las listas (comunidades, municipios) van separadas por `;` |
| [`normativas.json`](normativas.json) | Array JSON, una entrada por fila, ordenado por `codigo_norma` |

## Campos

| JSON | CSV | Qué es |
|---|---|---|
| `codigo_norma` | `codigo` | Identificador estable de la fila. No cambia aunque cambie el texto |
| `nombre_inspeccion` | `nombre` | Nombre de la obligación, en lenguaje llano |
| `tipo_inspeccion` | `tipo` | `ITE` (inspección técnica o evaluación del edificio), `OCA` (inspección por un organismo de control), `REVISION` (revisión periódica por empresa habilitada) o `MANTENIMIENTO` |
| `ccaa` | `ccaa` | Dónde se aplica. `TODAS` = ámbito estatal. Si no, códigos de comunidad: `ANDALUCIA`, `ARAGON`, `ASTURIAS`, `BALEARES`, `CANARIAS`, `CANTABRIA`, `CASTILLA_LA_MANCHA`, `CASTILLA_Y_LEON`, `CATALUNA`, `CEUTA`, `COMUNIDAD_VALENCIANA`, `EXTREMADURA`, `GALICIA`, `LA_RIOJA`, `MADRID`, `MELILLA`, `MURCIA`, `NAVARRA`, `PAIS_VASCO`. Una norma estatal que en algunas comunidades cede el paso a una propia lista todas las demás |
| `municipio` | `municipio` | Solo en ordenanzas municipales: el municipio o municipios. `null` (vacío en CSV) en el resto |
| `periodicidad_meses` | `periodicidad_meses` | Cada cuántos meses se repite (12 = anual, 120 = cada 10 años) |
| `normativa_referencia` | `normativa` | Norma que la exige |
| `articulo` | `articulo` | Artículo, apartado o tabla concretos |
| `url_oficial` | `url_oficial` | Enlace al texto oficial (BOE, boletín autonómico o web municipal) |
| `sancion_min_eur` | `sancion_min_eur` | Mínimo de la sanción en euros. `null` si la norma no fija mínimo |
| `sancion_max_eur` | `sancion_max_eur` | Máximo de la sanción en euros. `null` si no fija máximo. Si los dos son `null`, la norma no tiene multa propia o su cuantía no consta |
| `riesgo_adicional` | `riesgo_adicional` | Qué puede pasar, además de la multa, si no se hace |

## Antes de usarlos

- **Una fila no significa que aplique a todos los edificios.** Casi todas dependen de
  cosas del edificio que este catálogo no recoge: año de construcción, altura, número
  de viviendas, potencia de la instalación, si hay garaje, piscina o calefacción
  central, población del municipio… Para saber qué toca a un edificio concreto, usa
  el [comprobador gratuito](https://fincasaldia.es/auditoria/).
- **La sanción máxima es el tope legal, no la multa habitual.** Cuando una
  obligación se sanciona con la escala general de su ley (por ejemplo, la Ley de
  Industria para las instalaciones industriales), se da el máximo de ese tipo de
  infracción tal como lo fija la ley.
- **No es asesoramiento jurídico.** Cada fila se ha contrastado con su texto oficial,
  pero las normas cambian. Si encuentras un error o una norma que falta,
  [abre una incidencia](https://github.com/ekiste83/normativas-abiertas/issues) o
  escríbenos desde [fincasaldia.es/contacto](https://fincasaldia.es/contacto/).

## Licencia y cómo citarlos

[Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0)](LICENSE).
Puedes usarlos, también comercialmente, si citas la fuente y compartes lo que hagas
con ellos con la misma licencia.

Cita sugerida:

> Fuente: FincasAlDía, *Inspecciones obligatorias en comunidades de propietarios —
> datos abiertos* (https://fincasaldia.es/recursos/normativas-abiertas/), CC BY-SA 4.0.

En una web, basta con enlazar la fuente:

```html
Fuente: <a href="https://fincasaldia.es/recursos/normativas-abiertas/">FincasAlDía, normativas abiertas</a> (CC BY-SA 4.0)
```

GitHub también ofrece la cita en el botón *Cite this repository* (archivo
[`CITATION.cff`](CITATION.cff)).

---

### English summary

Open dataset of mandatory inspections, reviews and maintenance for residential
buildings (homeowners' associations) in Spain: national, regional and municipal
rules, with frequency, legal basis, link to the official text and penalty range.
Maintained by [FincasAlDía](https://fincasaldia.es), updated weekly. License:
CC BY-SA 4.0.
