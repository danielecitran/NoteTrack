# Note Track

Note Track ist eine kleine App, die dir hilft, deine Prüfungen im Blick zu behalten und automatisch deine Noten zu tracken.

## Funktionsweise

* Prüfungen im Kalender eintragen, inklusive Fach.
* Zwei Wochen nach der Prüfung erscheint eine Erinnerung: **„Prüfung zurückbekommen?“** → Ja / Nein

### Wenn Ja

* Note und Gewichtung eintragen:
  * Links: Note
  * Rechts: Gewichtung (Standard = 1)

### Wenn Nein

* Eine Woche später erscheint die Erinnerung erneut.

## Installation & Nutzung

### Voraussetzungen

* Node.js 18+
* npm oder yarn
* Supabase-Account

### Lokale Entwicklung

1. Repository klonen  
2. In das `frontend`-Verzeichnis wechseln:
   ```bash
   cd frontend
   ```
3. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
4. `.env.local`-Datei im `frontend`-Verzeichnis erstellen und Supabase-Zugangsdaten einfügen:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
6. [http://localhost:3000](http://localhost:3000) im Browser öffnen

## Contributors

* Daniele Citran  
* Gian Hari  
* Cieslik Anthony  
* Marc Holenstein  
