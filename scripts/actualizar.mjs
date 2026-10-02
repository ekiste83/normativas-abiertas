#!/usr/bin/env node
// Regenera normativas.json, normativas.csv y el bloque de cifras del README
// desde la función pública de FincasAlDía (la misma que alimenta
// https://fincasaldia.es/recursos/normativas-abiertas/).
//
// Si los datos no han cambiado, no toca ningún archivo: así la fecha de
// actualización solo avanza cuando hay un cambio real.
//
// Uso: node scripts/actualizar.mjs

import { readFile, writeFile } from 'node:fs/promises';

const SUPABASE_URL = 'https://tuepskxmpehndeeggfpi.supabase.co';
// Clave publicable (anon): es la misma que va en el JavaScript de la web
// pública y solo da acceso a lo que la base de datos expone a cualquiera.
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZXBza3htcGVobmRlZWdnZnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDc3MTYsImV4cCI6MjA4OTkyMzcxNn0.6OtA7T15i6QVpALZOOT22bZW5gbjs2rpaZ7PiiLlkcU';

const TIPOS = ['ITE', 'OCA', 'REVISION', 'MANTENIMIENTO'];

async function leerFuente() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/obtener_normativas_publicas`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  if (!res.ok) throw new Error(`La función respondió ${res.status}: ${await res.text()}`);
  const filas = await res.json();
  if (!Array.isArray(filas) || filas.length < 50) {
    // Una respuesta vacía o recortada nunca debe vaciar el dataset publicado.
    throw new Error(`Respuesta inesperada: ${Array.isArray(filas) ? filas.length : typeof filas} filas`);
  }
  return filas
    .map((r) => ({
      codigo_norma: r.codigo_norma,
      nombre_inspeccion: r.nombre_inspeccion,
      tipo_inspeccion: r.tipo_inspeccion,
      ccaa: [...r.ccaa].sort(),
      municipio: r.municipio && r.municipio.length ? [...r.municipio].sort() : null,
      periodicidad_meses: r.periodicidad_meses,
      normativa_referencia: r.normativa_referencia,
      articulo: r.articulo,
      url_oficial: r.url_boe,
      sancion_min_eur: r.sancion_min_eur,
      sancion_max_eur: r.sancion_max_eur,
      riesgo_adicional: r.riesgo_adicional,
    }))
    .sort((a, b) => a.codigo_norma.localeCompare(b.codigo_norma));
}

function aCSV(filas) {
  const cabecera =
    'codigo,nombre,tipo,ccaa,municipio,periodicidad_meses,normativa,articulo,url_oficial,sancion_min_eur,sancion_max_eur,riesgo_adicional';
  const txt = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const num = (v) => (v === null || v === undefined ? '' : String(v));
  const lineas = filas.map((r) =>
    [
      txt(r.codigo_norma),
      txt(r.nombre_inspeccion),
      txt(r.tipo_inspeccion),
      txt(r.ccaa.join(';')),
      txt((r.municipio ?? []).join(';')),
      num(r.periodicidad_meses),
      txt(r.normativa_referencia),
      txt(r.articulo),
      txt(r.url_oficial),
      num(r.sancion_min_eur),
      num(r.sancion_max_eur),
      txt(r.riesgo_adicional),
    ].join(',')
  );
  // BOM para que Excel abra bien las tildes.
  return '﻿' + [cabecera, ...lineas].join('\n') + '\n';
}

function bloqueCifras(filas, fecha) {
  const porTipo = Object.fromEntries(TIPOS.map((t) => [t, 0]));
  for (const r of filas) porTipo[r.tipo_inspeccion] = (porTipo[r.tipo_inspeccion] ?? 0) + 1;
  const estatales = filas.filter((r) => r.ccaa.includes('TODAS')).length;
  const municipales = filas.filter((r) => r.municipio).length;
  const autonomicas = filas.length - estatales - municipales;
  return [
    `**Última actualización de los datos:** ${fecha}`,
    '',
    '| | Filas |',
    '|---|---:|',
    `| **Total** | **${filas.length}** |`,
    `| Ámbito estatal (todas las comunidades) | ${estatales} |`,
    `| Ámbito autonómico o estatal con excepciones | ${autonomicas} |`,
    `| Ordenanzas municipales | ${municipales} |`,
    `| Tipo ITE | ${porTipo.ITE} |`,
    `| Tipo OCA | ${porTipo.OCA} |`,
    `| Tipo revisión | ${porTipo.REVISION} |`,
    `| Tipo mantenimiento | ${porTipo.MANTENIMIENTO} |`,
  ].join('\n');
}

async function main() {
  const filas = await leerFuente();
  const json = JSON.stringify(filas, null, 2) + '\n';

  const anterior = await readFile('normativas.json', 'utf8').catch(() => '');
  if (anterior === json) {
    console.log(`Sin cambios (${filas.length} filas).`);
    return;
  }

  // Comprobar el README antes de escribir nada: si fallara después de escribir el
  // JSON, la siguiente ejecución vería «sin cambios» y el README quedaría viejo.
  const readme = await readFile('README.md', 'utf8');
  const re = /(<!-- cifras:inicio -->)[\s\S]*?(<!-- cifras:fin -->)/;
  if (!re.test(readme)) throw new Error('README.md sin los marcadores <!-- cifras:inicio/fin -->');

  const fecha = new Date().toISOString().slice(0, 10);
  await writeFile('README.md', readme.replace(re, `$1\n${bloqueCifras(filas, fecha)}\n$2`));
  await writeFile('normativas.csv', aCSV(filas));
  await writeFile('normativas.json', json);

  console.log(`Actualizado: ${filas.length} filas (${fecha}).`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
