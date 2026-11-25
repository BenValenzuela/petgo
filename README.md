# Petgo

Demo navegable para una tienda de alimento para perros con delivery, pedidos por WhatsApp y seguimiento de recompra.

## Incluido en la demo

- Portada responsive con animaciones.
- Catálogo demostrativo con tres productos y formatos.
- Carrito persistente en el navegador.
- Formulario de entrega y pedido preparado para WhatsApp.
- Panel demostrativo de clientes y seguimientos.
- Base inicial para conectar Supabase.

Los productos, precios, clientes y métricas actuales son datos demostrativos y deben reemplazarse antes de publicar la versión comercial.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. El panel está en `http://localhost:3000/panel`.

## Configuración

Copiar `.env.example` como `.env.local` y completar el número de WhatsApp sin espacios ni el signo `+`.

```text
NEXT_PUBLIC_WHATSAPP_NUMBER=56912345678
```

Si el número se deja vacío, WhatsApp permitirá elegir manualmente el contacto durante la demostración.

## Próxima etapa

Crear el proyecto en Supabase, ejecutar `supabase/schema.sql`, conectar el catálogo y los pedidos, proteger el panel con Supabase Auth y activar el trabajo diario que genera los recordatorios.
