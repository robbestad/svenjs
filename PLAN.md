# SvenJS – oppfølging etter 34d6f46

Dato: 6. september 2026. Utgangspunkt: SvenJS 3.3.0, commit `34d6f46`.

De rapporterte runtime-, hydration-, SSR- og playground-feilene er rettet. CI er grønn med 99 runtime-tester, 60 nettlesertester og kontroll av installert tarball i Chromium, Firefox og WebKit. Denne planen erstatter den tidligere implementeringsplanen og dekker neste avgrensede forbedringsrunde.

## Arbeidsform

Tre Astra-subagenter arbeider parallelt med separate filområder. Hovedagenten forbedrer verifikasjonsflyten, integrerer resultatene og oppdaterer status ut fra faktisk verifikasjon. Ingen versjonsøkning eller publisering inngår. Eksisterende komponentkode, instansfelter og eksplisitte `ComponentSpec<Props, State>`-annotasjoner skal fortsatt virke.

## 1. Offline-dekning for alle eksempler

- [x] Test nedlasting og kjøring fra `file://` for Click, Todo, Composition, Blank og Mission Control.
- [x] Kontroller at eksporten inneholder runtime og CSS, korrekt SvenJS-stempel og versjon, og ikke gjør nettverksforespørsler.
- [x] Kontroller relevant interaksjon eller forventet startinnhold for hvert eksempel i Chromium, Firefox og WebKit.

Ferdig når alle fem eksportveier har beståtte nettlesertester uten å svekke eksisterende Mission Control-dekning.

## 2. Strengere typer for komponentmetoder

- [x] Bevar signaturene til ekstra metoder på `this` i vanlige `create({...})`-komponenter, slik at feil argumenttyper avvises.
- [x] Bevar state-/props-inferens, eksplisitte generiske argumenter, offentlige ComponentSpec-annotasjoner og dynamiske instansfelter.
- [x] Legg til positive og negative typefixtures for riktige/feil metodeargumenter og state/props.
- [x] Verifiser kildekode, distribuerte deklarasjoner og installert tarball i NodeNext og Bundler, med begge automatiske JSX-moduser.

Ferdig når negative fixtures avviser feil som tidligere slapp gjennom, samtidig som nettstedet og eksisterende konsumentfixtures kompilerer. Eventuelle TypeScript-begrensninger dokumenteres konkret.

## 3. Bygg nettstedet bare én gang i full verifikasjon

- [x] La `pnpm verify` gjenbruke nettstedet det nettopp har bygget når e2e starter.
- [x] Bevar selvstendig `pnpm test:e2e`, som fortsatt skal bygge før testene.
- [x] Bevar samme fullstendige kontroll i PR-CI, release og lokal publisering.

Ferdig når full verifikasjon består uten et ekstra nettstedbygg, og den selvstendige e2e-kommandoen fortsatt fungerer.

## 4. Repeterbar ytelsesmåling

- [x] Lag en benchmarkkommando for 100 og 1 000 noder, med mount, oppdatering i samme rekkefølge, reorder, innsetting/fjerning, batching, store-oppdateringer og SSR.
- [x] Inkluder `html` og keyed/unkeyed lister der sammenligningen er meningsfull.
- [x] Rapporter miljø, oppvarming, gjentakelser og måleresultater; dokumenter hvordan målingen gjentas.
- [x] Bevar eksisterende deterministiske DOM-baseline og størrelsesbudsjett. Ikke innfør maskinavhengige tidsgrenser i CI eller optimaliser runtime uten målegrunnlag.

Ferdig når kommandoen kan kjøres og produsere forståelige resultater uten å endre runtime-oppførsel. Historiske resultater skal ikke konstrueres eller sammenlignes som om målemiljøene var identiske.

## 5. Integrasjon og avslutning

- [x] Gjennomgå subagentenes endringer og oppdater changelog/dokumentasjon.
- [x] Kjør relevante delkontroller og avslutt med `pnpm verify`.
- [x] Registrer faktiske testantall, størrelse, benchmarkresultat og eventuelle begrensninger nedenfor.

## Resultater

Metodetyper: kildebygg, workspace-typesjekk, distribusjonsfixtures og installert tarball er bestått i NodeNext/Bundler med begge automatiske JSX-moduser. `create<Props, State>` beholder permissive ekstra metoder fordi TypeScript ikke støtter delvis inferens av resterende generiske argumenter. Bruk inferred `create({...})` eller et eksplisitt tredje metodeargument for strenge metodesignaturer. Dynamiske instansfelter og metadata beholdes.

Benchmark: 68 scenarier med tre oppvarminger og ti målte repetisjoner, totalt 884 validerte kjøringer, bestod. Root-kommandoen `pnpm bench --warmup=0 --repeats=1` er også prøvd. Målemiljø: Node 22.23.2, happy-dom 20.12.0, Apple M3 Max, Darwin 25.6.0 arm64. Produksjonsartefakt SHA-256: `ccd43af60bc38dc0acc8501d4bb2a662a6f6b9196e625cadc114258145cbb16f`.

Illustrative medianer for 1 000 keyed `h`-elementer, i millisekunder per operasjon:

| Oppdatering | Reorder | Ti oppdateringer batchet | Ti separate flush | Store | SSR |
| --- | --- | --- | --- | --- | --- |
| 0,392 | 1,785 | 0,365 | 5,922 | 0,357 | 0,212 |

Målingen ble gjort under annet arbeid på maskinen og er en funksjonskontroll av benchmarken, ikke et kontrollert ytelsessammenligningsgrunnlag. Happy-dom inkluderer ikke layout eller paint. Ingen historiske forbedringspåstander eller tidsgrenser i CI er innført.

Samlet `pnpm verify` bestod:

- 99 runtime-tester og eksisterende DOM-baseline.
- 72 nettlesertester i Chromium, Firefox og WebKit, inkludert alle fem offline-eksportene per nettleser.
- Workspace-bygg, prerender, typesjekk, distribusjonstyper, versjonskontroll og pakket tarball.
- Dev/prod-IIFE fra installert tarball i alle tre nettlesermotorene.
- Produksjons-IIFE: 5 996 gzip-byte, uendret og under grensen på 6 144.
- Loggen viser ett klientbygg og ett SSR-bygg for nettstedet; e2e bruker det ferdige bygget.

Selvstendig `pnpm test:e2e --grep 'downloads a genuinely offline one-file'` bygde nettstedet først og bestod alle 15 eksporttestene. `git diff --check` bestod. Planens avgrensede arbeid er fullført. Ingen npm-utgivelse inngår.
