export function dateFormat(fecha) {
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const [anio, mes, dia] = fecha.split("-"); // evita problemas de zona horaria
  const diaFormateado = String(dia).padStart(2, "0");
  const mesNombre = meses[parseInt(mes, 10) - 1];

  return `${diaFormateado}-${mesNombre}-${anio}`;
}
