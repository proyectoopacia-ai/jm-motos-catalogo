# Catálogo J&M Motos

Catálogo digital de J&M Motos (Independencia, San Felipe, Yaracuy).

- Catálogo: https://proyectoopacia-ai.github.io/jm-motos-catalogo/
- Administrador: https://proyectoopacia-ai.github.io/jm-motos-catalogo/admin.html
- Guía para el dueño: https://proyectoopacia-ai.github.io/jm-motos-catalogo/guia.html

## Cómo funciona
- Los productos están en `products.json`. El catálogo (`index.html`) los lee al abrirse.
- `admin.html` edita `products.json` y sube fotos a `img/` usando la API de GitHub.
- El acceso usa una llave de GitHub (fine-grained token) guardada **cifrada** en `admin-key.json`.
  Solo quien sabe la clave del administrador puede descifrarla. La llave solo tiene permiso sobre este repositorio.

## Configuración inicial (una vez)
1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Repository access: **Only select repositories** → `jm-motos-catalogo`.
3. Permissions → Repository permissions → **Contents: Read and write**. Expiración: la más larga posible.
4. Abrir `admin.html`, pegar la llave y crear la clave del administrador.

Si la llave vence o se borra, se genera una nueva y se borra `admin-key.json` del repositorio; al abrir `admin.html` vuelve a pedir la configuración.

## Formato uniforme
El panel limita el nombre a 40 caracteres y la descripción a 80, quita espacios de más, pone mayúscula inicial,
convierte textos escritos todo en MAYÚSCULAS y usa listas fijas de categoría y moto. Las fotos se recortan a 720×900 (4:5).
