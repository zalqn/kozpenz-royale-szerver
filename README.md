# KÖZPÉNZ ROYALE – GitHub Pages változat

Ez a mappa csak a játék futtatásához szükséges statikus fájlokat tartalmazza
(index.html, a betöltött scriptek, `tex_opt/` textúrák). Szerver-adat (felhasználók, jelszavak) NINCS benne.

## Feltöltés
1. Hozz létre egy új GitHub repót (pl. `kozpenz-royale`).
2. Töltsd fel ennek a mappának a TARTALMÁT a repó gyökerébe (a `.nojekyll` fájlt is).
3. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. Pár perc múlva: `https://<felhasználónév>.github.io/kozpenz-royale/`

## Mi működik Pages-en?
- Minden egyjátékos tartalom **vendég (offline) módban**: Battle Royale, Mentsd meg a világot, flakon, kaszinó,
  telefon, fotómód, Közszörnyek, kártyák, bank, naptár stb. A mentés a böngésző localStorage-ában marad.
- **Szerver kell hozzá (Pages-en nem megy):** belépés/regisztráció, barátok, parti, Teakert (közösségi tér),
  promókódok, lottó, klánok, kutyakiállítás, rangsorolt lista, kártyaküldés. Ezekhez a `server/server.js`-t
  egy Node-tárhelyen (pl. Render, Railway) kell futtatni.

A fotótextúrák a Poly Haven CC0 (szabadon használható) gyűjteményéből származnak – a források listája: `tex_opt/forras.json`.
