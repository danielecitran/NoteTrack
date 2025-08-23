# Note Track

Note Track ist eine kleine App, die dir hilft, deine Prüfungen zu checken und automatisch deine Plus- und Minuspunkte fürs Gymi auszurechnen.

## Wie es läuft

* Prüfungen im Kalender eintragen, mit Fach.
* Zwei Wochen nach der Prüfung kommt eine Erinnerung: „Prüfung bekommen?“ Ja / Nein

### Wenn Ja

* Note und Gewichtung eintragen:
    * Links: Note
    * Rechts: Gewichtung (Standard = 1)

### Wenn Nein

* Nochmals eine Woche später kommt die Erinnerung.

## How to run

### Voraussetzungen

* Node.js 18+
* npm or yarn
* Supabase account

### Lokale Entwicklung

1.  Klone das Repository
2.  Navigiere in das `frontend` Verzeichnis:
    ```bash
    cd frontend
    ```
3.  Installiere die Abhängigkeiten:
    ```bash
    npm install
    ```
4.  Erstelle eine `.env.local` Datei im `frontend` Verzeichnis mit deinen Supabase-Anmeldeinformationen:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
5.  Starte den Entwicklungsserver:
    ```bash
    npm run dev
    ```
6.  Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser

## Contributors

* danielecitran
* gian hari
* Cieslik Anthony
* marc holenstein
