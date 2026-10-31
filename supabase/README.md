# Configuration Supabase (en attente)

Supabase n’est pas encore relié à MarketPilot AI. Ce dépôt ne crée pas de projet,
ne change aucun abonnement et n’applique aucune migration.

## Variables d’environnement

À définir localement dans `artifacts/marketpilot-ai/.env.local`, ou dans les
variables d’environnement de Replit/Vercel :

- `VITE_SUPABASE_URL` : URL du projet Supabase.
- `VITE_SUPABASE_PUBLISHABLE_KEY` : clé publique `sb_publishable_` du projet.

Les variables `VITE_*` sont incluses dans le code envoyé au navigateur. La clé
publishable est conçue pour cet usage, à condition que les tables exposées soient
protégées par RLS. Ne placez jamais de clé `service_role` ou `sb_secret_` dans
une variable `VITE_*`, le dépôt ou le navigateur. Le fichier `.env.example`
contient uniquement des valeurs vides ; les vraies valeurs locales doivent
rester dans `.env.local`, qui est ignoré par Git.

## Plan gratuit et création du projet

Utilisez uniquement le plan Free affiché à 0 $ et n’activez aucun forfait,
module complémentaire ou dépassement payant. La page officielle indique que les
projets gratuits peuvent être mis en pause après une semaine d’inactivité.
Si l’inscription ou la création gratuite demande une carte bancaire ou une
activation payante, interrompez le processus : rien dans ce dépôt ne demande ni
n’autorise cette activation.

## Migration et RLS

La migration `migrations/20261031000000_create_profiles_rls.sql` est un point de
départ pour une table de profils. Elle active RLS, limite les opérations aux
utilisateurs authentifiés et utilise `auth.uid()` pour ne permettre à chacun
que de lire, créer ou modifier son propre profil. La suppression via le client
n’est pas autorisée.

Cette migration n’a pas été exécutée. Après création du projet, appliquez-la une
seule fois avec Supabase CLI ou vérifiez son contenu puis exécutez-le dans
l’éditeur SQL Supabase. Chaque nouvelle table contenant des données privées
devra recevoir ses propres privilèges et politiques RLS avant d’être exposée.
