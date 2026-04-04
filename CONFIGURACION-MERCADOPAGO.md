# Configuración de Mercado Pago — Hospital San Martín

Seguí estos pasos para conectar tu cuenta de Mercado Pago al sitio web.
Una vez completados, enviá las credenciales al desarrollador.

---

## Requisitos previos

- Tener una cuenta de Mercado Pago **argentina** y **verificada**
- Haber completado la identidad (CUIT/CUIL cargado)

---

## Paso 1 — Ingresar al panel de desarrolladores

1. Entrá a [mercadopago.com.ar](https://www.mercadopago.com.ar) con tu cuenta
2. Hacé click en tu nombre (arriba a la derecha) → **Tu negocio**
3. En el menú lateral buscá **Herramientas para desarrolladores** → **Credenciales**

O entrá directo a: [mercadopago.com.ar/developers/panel/credentials](https://www.mercadopago.com.ar/developers/panel/credentials)

---

## Paso 2 — Obtener las credenciales de producción

1. Asegurate de estar en la pestaña **Producción** (no Prueba/Test)
2. Vas a ver dos claves:
   - **Public Key** — empieza con `APP_USR-` y tiene el formato largo
   - **Access Token** — también empieza con `APP_USR-`
3. Copiá ambas claves y guardalas (las vas a necesitar en el Paso 4)

> **Importante:** No compartas estas claves públicamente ni las subas a redes sociales.

---

## Paso 3 — Configurar el Webhook

El webhook le avisa al sitio cuando se procesa un pago o suscripción.

1. En el panel de desarrolladores, andá a **Webhooks** (menú lateral)
2. Hacé click en **Agregar URL**
3. Completá los campos así:

   | Campo | Valor |
   |-------|-------|
   | **URL** | `https://hospital-sanmartin.vercel.app/api/webhook/mp` |
   | **Modo** | Producción |

4. En **¿Qué eventos querés recibir?** marcá estas tres opciones:
   - ✅ `payment` — Pagos
   - ✅ `subscription_preapproval` — Suscripciones (cambios de estado)
   - ✅ `subscription_authorized_payment` — Cobros mensuales de suscripciones

5. Hacé click en **Guardar**

---

## Paso 4 — Enviar las credenciales al desarrollador

Mandá al desarrollador los siguientes datos **por mensaje privado** (no por email ni redes):

```
Public Key: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Access Token: APP_USR-0000000000000000-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-000000000
```

---

## Verificación final

Una vez que el desarrollador configure las credenciales, vas a poder:
- Recibir donaciones únicas con tarjeta o Mercado Pago
- Activar suscripciones mensuales (Socio Amigo, Protector, Esperanza)
- Ver los pagos en tu panel de Mercado Pago en tiempo real

---

*Ante cualquier duda, contactá al desarrollador.*
