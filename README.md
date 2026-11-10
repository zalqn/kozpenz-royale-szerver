# KÖZPÉNZ ROYALE – Render (Node szerver + játék) változat

A mappát a `node build.js --bundle` állítja elő (index.html + bundle.min.js + tex_opt + server/*.js). Szerver-adat
(users.json, kozpenz.db, saves, backup, logs) NINCS benne – ne is másold bele.

## Telepítés Renderre
1. Töltsd fel a mappa tartalmát egy (privát) GitHub repóba, Renderen: New → Blueprint → a repó (a `render.yaml` alapján).
2. Node ≥ 22.5 kell (node:sqlite) – a render.yaml beállítja.

## ⚠️ Tartós adatbázis
A **free** csomagon a lemez ideiglenes: minden deploy/újraindítás TÖRLI a fiókokat és mentéseket.
Tartós adathoz: `plan: starter` (fizetős) + a `render.yaml` végén lévő `disk:` blokk és a `DATA_DIR=/var/data`
env bekapcsolása (kommentek eltávolítása). A szerver induláskor kiírja a konzolra, ha a DATA_DIR hiányzik vagy új (nem tartós).

## Opcionális környezeti változók
| Változó | Mire jó |
|---|---|
| `DATA_DIR` | adatkönyvtár (kozpenz.db, saves, backup, logs) – tartós disk mount helye |
| `PUBLIC_URL` | a játék címe (pl. `https://kozpenz-royale.onrender.com`) – a jelszó-visszaállító linkhez |
| `SMTP_HOST`, `SMTP_PORT` (465 TLS / 587 STARTTLS), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | jelszó-visszaállító e-mail. Ha nincs megadva, a link a szerver konzolra és az admin panel 🔑 fülére kerül |
| `BACKUP_URL` | napi adatbázis-mentés feltöltése HTTP PUT-tal (a `{file}` helyére a fájlnév kerül), pl. egy S3 presigned / WebDAV / webhook cím. Alapból KI |
| `BACKUP_TOKEN`, `BACKUP_METHOD` | opcionális `Authorization: Bearer` fejléc, ill. PUT helyett POST |

A fotótextúrák a Poly Haven CC0 gyűjteményéből származnak – források: `tex_opt/forras.json`.
