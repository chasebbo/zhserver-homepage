# E-Mail-Bestätigung und Turnstile

Stand 26.10.2026. Homepage-Stand lokal fertig, in Supabase noch nichts umgeschaltet.

## Was die Homepage macht

- Registrierung: Liefert Supabase keine Sitzung (Bestätigung an), erscheint „Bitte bestätige deine E-Mail“ mit „Mail erneut senden“ (höchstens einmal pro Minute).
- Anmeldung mit unbestätigtem Konto: klare Meldung und „Mail erneut senden“.
- Bestätigungslink: führt zurück auf `/account/?next=…`. Danach ist man angemeldet und kommt mit „Weiter“ zum Ziel, zum Beispiel ins Spiel.
- Abgelaufener oder schon benutzter Link: Meldung und neuen Link anfordern.
- Die Registrierung speichert die gewählte Sprache (`language`: `de` oder `en`) für die Mailvorlage.
- Solange „Confirm email“ aus ist, verhält sich alles wie bisher.
- Turnstile: `assets/js/turnstile.js`. Ohne Site-Key inaktiv, alle Formulare laufen ohne Captcha. Mit Site-Key bekommen Registrierung, Anmeldung (auch für den Adminbereich, der über `/account/` anmeldet), „Passwort vergessen“ und „Mail erneut senden“ ein unauffälliges Turnstile-Feld.

## Stufe 1: E-Mail-Bestätigung (Supabase-Dashboard, nur Sebastian)

1. **Authentication → URL Configuration**
   - Site URL muss `https://www.zhserver.de` sein. Nur prüfen.
   - Unter Redirect URLs `https://www.zhserver.de/account/**` hinzufügen. Bestehende Einträge behalten.
   - Fehlt der Eintrag, landet man nach dem Bestätigen auf der Startseite. Das Konto ist trotzdem bestätigt.
2. **Authentication → Emails → SMTP Settings**: nur ablesen, nichts ändern.
   - Absenderadresse und Benutzername müssen dasselbe Strato-Postfach sein, über das „Passwort vergessen“ heute schon funktioniert.
   - In älteren Notizen steht `no-reply@zhserver.de`. Gilt, was dort eingetragen ist und funktioniert.
   - Die Vorlage nennt keine Absenderadresse.
3. **Authentication → Emails → Templates → „Confirm signup“**: Betreff und Inhalt unten einfügen und speichern.
4. **Sign In / Providers → Email → „Email OTP Expiration“** ablesen.
   - Bei 3600 Sekunden stimmt „eine Stunde“ in der Vorlage.
   - Sonst den Satz in der Vorlage anpassen.
5. **Authentication → Rate Limits → E-Mails pro Stunde** ablesen. Standard bei eigenem SMTP: 30.
6. **Erst nach dem Push und der Live-Prüfung**: Sign In / Providers → Email → **„Confirm email“ einschalten**, speichern.
7. **Selbst testen**:
   - Mit einer zweiten eigenen Adresse registrieren.
   - Die Mail kommt an, der Link führt zu „Deine E-Mail-Adresse ist bestätigt“, dann „Weiter“.
   - Vor dem Klick auf den Link anmelden: Hinweis und „Mail erneut senden“ müssen erscheinen.
   - Mit dem bestehenden Adminaccount anmelden.

**Rückweg**: „Confirm email“ ausschalten. Bestehende Konten (alle 13 sind bestätigt) und Sitzungen bleiben unberührt.

Hinweis: Mit Bestätigung meldet Supabase bei einer schon registrierten Adresse aus Datenschutzgründen keinen Fehler. Die Seite zeigt dann ebenfalls „Bitte bestätige deine E-Mail“, es kommt aber keine Mail.

## Vorlage „Confirm signup“

Betreff:

```text
{{ if .Data.language }}{{ if eq .Data.language "en" }}Confirm your email address for ZHServer{{ else }}Bestätige deine E-Mail-Adresse für ZHServer{{ end }}{{ else }}Bestätige deine E-Mail-Adresse für ZHServer{{ end }}
```

Inhalt (Message body):

```html
{{ $en := false }}{{ if .Data.language }}{{ if eq .Data.language "en" }}{{ $en = true }}{{ end }}{{ end }}
<div style="background:#f4f1ea;padding:24px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-top:4px solid #b8892b;padding:28px 30px">
    <p style="font-family:Georgia,serif;font-size:20px;font-weight:bold;letter-spacing:.04em;color:#1b1d20;margin:0 0 18px">ZHSERVER</p>
    {{ if $en }}
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0 0 14px">Hello{{ if .Data.display_name }} {{ .Data.display_name }}{{ end }},</p>
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0 0 14px">You have registered at ZHServer. Please confirm your email address so you can sign in.</p>
    <p style="margin:6px 0 18px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#b8892b;color:#111111;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px">Confirm email address</a></p>
    <p style="font-size:13px;line-height:1.6;color:#666666;margin:0 0 14px">The link is valid for one hour. If you did not register, you can ignore this email.</p>
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0">Your ZHServer community</p>
    {{ else }}
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0 0 14px">Hallo{{ if .Data.display_name }} {{ .Data.display_name }}{{ end }},</p>
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0 0 14px">du hast dich bei ZHServer registriert. Bitte bestätige deine E-Mail-Adresse, damit du dich anmelden kannst.</p>
    <p style="margin:6px 0 18px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#b8892b;color:#111111;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:4px">E-Mail-Adresse bestätigen</a></p>
    <p style="font-size:13px;line-height:1.6;color:#666666;margin:0 0 14px">Der Link ist eine Stunde gültig. Wenn du dich nicht registriert hast, kannst du diese Mail ignorieren.</p>
    <p style="font-size:15px;line-height:1.6;color:#2b2e33;margin:0">Deine ZHServer Community</p>
    {{ end }}
  </div>
  <p style="font-size:12px;color:#777777;text-align:center;margin:14px 0 0">www.zhserver.de</p>
</div>
```

Ohne gespeicherte Sprache (zum Beispiel bei älteren Konten) wird Deutsch verwendet.

## Stufe 2: Turnstile (erst wenn Stufe 1 live läuft und getestet ist)

1. **Cloudflare → Turnstile → Add widget** (nur Sebastian):
   - Name: „ZHServer Anmeldung“.
   - Hostnamen: `www.zhserver.de` und `zhserver.de`.
   - Modus: Managed. Pre-Clearance: aus.
2. **Site-Key** an den Homepage-Agenten geben. Er ist öffentlich und kommt in `assets/js/turnstile.js`.
   - Der Agent testet lokal, committet und pusht nach „Push frei“.
   - Danach prüft er live, dass das Feld lädt.
   - Supabase ignoriert den Token, solange Captcha dort aus ist.
3. **Secret-Key** trägt nur Sebastian ein, nirgends sonst:
   - Supabase → Authentication → Attack Protection (Bot and Abuse Protection).
   - „Enable Captcha protection“ einschalten, Anbieter Cloudflare Turnstile, Secret-Key eintragen, speichern.
4. **Sofort selbst testen**: Anmeldung mit dem Adminaccount (über `/account/`), Registrierung, „Passwort vergessen“.

**Rückweg**: Captcha in Supabase ausschalten. Die Formulare laufen dann wieder ohne Prüfung, auch wenn der Site-Key gesetzt bleibt.

Hinweis für später: Wird die vorbereitete Content-Security-Policy aktiviert, braucht sie `https://challenges.cloudflare.com` in `script-src` und `frame-src`.

## Offener Punkt (eigene Freigabe nötig)

Unbestätigte Konten werden von Supabase sofort angelegt, samt Profil und Startinventar. Sie zählen in „Registrierte Mitglieder“ und können als „Neuestes Mitglied“ erscheinen. Ein Filter auf bestätigte Konten wäre eine Datenbankänderung und ist noch nicht freigegeben. Supabase löscht unbestätigte Konten nicht von selbst.
