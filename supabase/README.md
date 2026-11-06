# Configuration Supabase (en attente)

Les Secrets Supabase sont configurés et le point de santé Auth a répondu. Les
migrations de profil ne sont pas appliquées et les flux d’inscription/connexion
n’ont pas encore été testés avec un utilisateur réel. Ce dépôt ne crée pas de
projet, ne change aucun abonnement et n’applique aucune migration.

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

Les migrations de profils doivent être appliquées dans l’ordre chronologique :

1. `migrations/20261031000000_create_profiles_rls.sql` crée la table de base.
2. `migrations/20261103000000_auto_profile_on_signup.sql` retire les écritures
   directes des rôles clients, conserve uniquement la lecture du profil propre,
   crée automatiquement un profil après chaque inscription Auth et complète les
   profils manquants des utilisateurs déjà inscrits.

La seconde migration ne supprime pas de profil existant : son remplissage utilise
`ON CONFLICT DO NOTHING`. Le déclencheur écrit avec une fonction
`SECURITY DEFINER`, un `search_path` vide et des références qualifiées par schéma.
Les clients `anon` et `authenticated` ne peuvent pas appeler directement cette
fonction. Les utilisateurs `authenticated` n’ont que le droit de lecture, limité
par RLS à leur propre ligne.

L’application ne lance pas les migrations automatiquement. Vérifiez l’historique
des migrations du projet distant avant de les appliquer, notamment si la première
migration a été exécutée manuellement. Ne modifiez pas une migration déjà
appliquée ; créez une nouvelle migration corrective si l’historique distant
l’exige. Chaque nouvelle table contenant des données privées doit recevoir ses
propres privilèges et politiques RLS avant d’être exposée.

## Données de l’espace MarketPilot

La migration `migrations/20261106000000_marketpilot_workspace.sql` ajoute les
tables de prospects, brouillons marketing, plans de campagne, notes de suivi et
préférences d’espace. Elle n’insère aucune donnée de démonstration et protège
chaque ligne par `auth.uid()` et RLS. Les espaces « Conversations » et
« Campagnes » sont des outils de suivi et de planification : ils n’importent,
n’envoient ni ne publient de messages.

Cette migration est un fichier local. Son exécution manuelle dans Supabase SQL
Editor ne l’inscrit pas automatiquement dans l’historique du CLI
`supabase_migrations.schema_migrations`. Avant toute commande `supabase db push`,
comparez l’historique distant et les fichiers locaux ; ne créez pas
artificiellement une entrée d’historique et ne réexécutez pas la migration de
base des profils si elle a déjà été appliquée manuellement.

L’application a besoin des tables de profils et de cette migration d’espace pour
que l’inscription et les écrans de données fonctionnent réellement. Tant que
elles ne sont pas appliquées, l’interface affiche l’erreur Supabase au lieu de
fabriquer des données.

## Hébergement Vercel

Le site est servi comme application Vite statique. Dans les paramètres du projet
Vercel, définissez `VITE_SUPABASE_URL` et
`VITE_SUPABASE_PUBLISHABLE_KEY` avec les valeurs publiques du même projet
Supabase. Ces valeurs sont intégrées au bundle navigateur ; ne configurez jamais
une clé `service_role` ou `sb_secret_` avec le préfixe `VITE_`. Le dépôt contient
un `.env.example` vide et aucun secret réel ne doit être ajouté à Git.
