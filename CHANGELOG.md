# Historial de cambios

Los cambios de datos semanales los hace la actualización automática y se ven en el
[historial de commits](https://github.com/ekiste83/normativas-abiertas/commits/main).
Aquí solo se anotan los cambios de formato.

## 2026-10-02

- Datos regenerados desde la base de datos de FincasAlDía tras la auditoría
  del motor de septiembre y octubre de 2026: filas nuevas, filas retiradas por estar
  derogadas o duplicadas, periodicidades y sanciones corregidas contra el texto
  oficial.
- **Cambio de formato en `normativas.json`:** los campos pasan a `snake_case`
  (`codigo_norma`, `nombre_inspeccion`, `tipo_inspeccion`, `url_oficial`,
  `sancion_min_eur`…). `municipio` es ahora una lista. El CSV mantiene sus columnas.
- Filas ordenadas por `codigo_norma`, para que los cambios se lean bien en el
  historial.
- Archivo `LICENSE` con el texto de CC BY-SA 4.0, `CITATION.cff` y actualización
  semanal automática.

## 2026-05

- Publicación inicial.
