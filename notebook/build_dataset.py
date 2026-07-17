"""build_dataset.py: Build dataset for training and evaluation.
CONSOLIDA LOS archivos.txt de data/raw/categoria en un unico dataset.csv"""

import os
import re
import pandas as pd

# RUTA DE ARCHIVOS DONDE LEE .txt Y DONDE GUARDA EL dataset.csv
BASE_PATH = os.path.join(os.path.dirname(__file__), "data", "raw")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "data", "processed", "dataset.csv")

# Analisis y transformación de archivos .txt a un dataset.csv
def parsear_archivo(ruta_archivo: str) -> dict:
    """Leer un archivo .txt y devolver su contenido junto con su ruta."""
    with open(ruta_archivo, "r", encoding="utf-8") as f:
        contenido = f.read().strip()
    titulo_match = re.search(r"Ttitulo:\s*(.+)", contenido)
    texto_match = re.search(r"Texto:\s*(.+)", contenido, re.DOTALL)

    titulo = titulo_match.group(1).strip() if titulo_match else ""
    texto = texto_match.group(1).strip() if texto_match else contenido.strip()

    return {"contenido": contenido, "ruta": ruta_archivo}

# Construir el dataset final
def construir_dataset() -> pd.DataFrame:
    """ Construir un DataFrame a partir de los archivos .txt en BASE_PATH."""
    filas = []

    if not os.path.isdir(BASE_PATH):
        raise FileNotFoundError(f"No se encontro la carpeta {BASE_PATH}")
    
    categorias = sorted(os.listdir(BASE_PATH))

    for categoria in categorias: 
        carpeta_categoria = os.path.join(BASE_PATH, categoria)
        if not os.path.isdir(carpeta_categoria):
            continue

        archivos_txt = [f for f in os.listdir(carpeta_categoria) if f.endswith(".txt")]

        if not archivos_txt:
            print(f"[AVISO] La categoria '{categoria}' no tiene archivos .txt tedavia")
            continue
        
        for nombre_archivos in archivos_txt:
            ruta = os.path.join(carpeta_categoria, nombre_archivos)
            datos = parsear_archivo(ruta)
            filas.append({
                'titulo': datos['titulo'],
                'texto': datos['texto'],
                'categoria': categoria,
                'archivo_origen': nombre_archivos,
            })
    
    return pd.DataFrame(filas)

# 
def main():
    df = construir_dataset()

    if df.empty:
        print("No se generaron filas. Revisa que existan archivos .txt en data/raw/categoria/")
        return
    
    os.makedirs(os.path.dirname(OUTPUT_PATH),exist_ok = True)
    df.to_csv(OUTPUT_PATH, index=False, encoding="utf-8")

    print(f'Dataset generado con{len(df)} filas en: {OUTPUT_PATH}')
    print('\nDocumentos por categoria:')
    print(df['categoria'].value_counts())

if __name__ == "__main__":
    main()