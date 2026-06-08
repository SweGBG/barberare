# Atilli Berg – Projektkontex för Claude

## Stack
- Next.js App Router, TypeScript, Tailwind CSS (ej CSS modules i nya filer)
- Supabase (auth + databas), Resend (mail), Vercel (deploy)
- Repo: barberare på GitHub, live: barberare.vercel.app

## Supabase – Tabeller & Kolumner

### bookings
| Kolumn | Typ | Info |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | auth.users |
| service_id | uuid | FK → services |
| booking_date | timestamptz | datum + tid i ett fält |
| status | text | confirmed, pending, in_progress, completed, cancelled |
| duration_minutes | int | |
| price | int | i kronor |
| notes | text | |
| created_at | timestamptz | |
| client_name | text | |
| client_email | text | |
| client_phone | text | |

### services
| Kolumn | Typ |
|---|---|
| id | uuid |
| name | text |
| price | int |
| duration_minutes | int |

### profiles
| Kolumn | Typ | Info |
|---|---|---|
| id | uuid | = auth.uid() |
| role | text | 'admin' eller null |

### messages
- Kontaktformulär, alla kan skicka (INSERT policy: anon + authenticated)

### opening_hours
- Publik läsning (SELECT policy: anon + authenticated)

## RLS Policies (redan satta)
- bookings SELECT: client_email = auth.jwt()->>'email' OR user_id = auth.uid()
- bookings UPDATE: samma
- services SELECT: public (anon + authenticated)
- profiles SELECT: id = auth.uid()
- messages INSERT: public
- opening_hours SELECT: public

## Supabase Klienter
- Browser: src/lib/supabase/client.ts → createBrowserClient från @supabase/ssr
- Server: src/lib/supabase/server.ts → createServerClient från @supabase/ssr
- API-routes: createClient från @supabase/supabase-js med SERVICE_ROLE_KEY (kringgår RLS)

## Auth-mönster
### Klientsida (/medlem)
```ts
// Använd onAuthStateChange, INTE getUser() – getUser hänger på Vercel
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'INITIAL_SESSION') {
    if (!session?.user) { router.push('/logga-in'); return; }
    // hämta data...
    setLoading(false);
  }
});
```

### Serversida (admin/layout.tsx)
```ts
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()
if (error || !user) redirect('/logga-in')
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile?.role !== 'admin') redirect('/')
```

## API Routes (/api/admin/*)
- /api/admin/booking – GET (alla), POST (skapa), DELETE (radera)
- /api/admin/booking/status – PATCH (ändra status)
- Alla använder SERVICE_ROLE_KEY, inte anon key

## Viktiga Designbeslut
- Gamla tabellen hette `bokningar` (svenska) – NY heter `bookings` (engelska)
- booking_date innehåller BÅDE datum och tid (timestamptz), inte separata fält
- service_id ska alltid skickas med vid POST så tjänstnamn visas korrekt
- Hämta bokningar med: .or(`client_email.eq.${email},user_id.eq.${userId}`)

## Designsystem
- Färger: cream #F5F0E8, gold #B8956A, dark #1C1A17, warm #8B6F5E
- Typsnitt: Playfair Display (rubriker), Raleway/Inter (UI)
- CSS-variabler: var(--cream), var(--gold), var(--dark), var(--border), var(--warm)
- Admin använder CSS modules (*.module.css)
- Publik sida blandar CSS modules och inline styles

## Sidor
- / → startsida
- /boka → 4-stegs bokningsflöde (TjanstVal → KalenderVal → KontaktForm → Bekraftelse)
- /medlem → inloggad kunds sida (bokningar, profil)
- /logga-in → login
- /skapa-konto → register
- /admin → admin dashboard (kräver role = 'admin')
- /admin/bokningar → bokningshantering
- /admin/schema → schemavy
- /admin/klientregister → kundlista
- /admin/meddelanden → kontaktmeddelanden
- /admin/tjanster → tjänster & priser
- /admin/rapporter → statistik
- /admin/installningar → inställningar

## Komponenter (admin)
- AdminSidebar, AdminTopbar, AdminLayout, BottomNav (mobil)
- StatsGrid, WeekChart, BookingsTable, TodayTimeline

## Komponenter (publik)
- Navbar (desktop + hamburger mobil), Footer

## Miljövariabler (Vercel + .env.local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (bara server!)
- RESEND_API_KEY (bara server!)

-Bygg en NewsAPI trender-widget för Atilli Berg admin-dashboard. Tidningsdesign. Server-route /api/admin/trender som håller API-key säker. Queries: "barbershop trends" + "hair styling 2026". Cacha så den inte hämtar mer än en gång per timme. Visa som widget på /admin bredvid TodayTimeline.