# Sliders independientes del Home

Importar `acf-home-banners-independientes.json` desde WordPress → ACF → Herramientas → Importar. El archivo contiene únicamente el grupo Inicio y conserva sus claves existentes.

En Páginas → Inicio → Secciones, abrir el primer bloque Banner:

- **Banner 1 — Títulos:** añadir un título por fila. Se conserva el formato de texto y la animación de escritura. Arrastrar las filas para ordenar.
- **Banner 2 — Imágenes:** añadir una imagen por fila con su texto alternativo en la biblioteca. Se puede usar una cantidad y un orden diferentes de los títulos. Avanza cada 5 segundos, permite deslizar y tiene controles propios.

Completar estas listas solo en el primer bloque Banner. Los bloques Banner antiguos se siguen leyendo como respaldo: si una lista nueva está vacía, se usa el contenido anterior de ese tipo. Importar el esquema no copia ni borra los valores guardados. No eliminar los bloques anteriores hasta completar ambas listas y guardar Inicio.

El frontend debe incluir los cambios de esta entrega para interpretar los campos nuevos. No se ha modificado el WordPress remoto ni importado el JSON automáticamente.
