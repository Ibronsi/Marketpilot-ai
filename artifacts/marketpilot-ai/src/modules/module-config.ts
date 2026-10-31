import {
  ContactRound,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Settings2,
  Target,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type WorkspaceModule = {
  title: string;
  subtitle: string;
  eyebrow: string;
  intro: string;
  icon: LucideIcon;
  nextStep: string;
  scope: string;
};

export const navItems = [
  { label: 'Vue d’ensemble', path: '/', icon: LayoutDashboard },
  { label: 'Marketing', path: '/marketing', icon: Megaphone },
  { label: 'Prospection', path: '/prospection', icon: Target },
  { label: 'CRM', path: '/crm', icon: ContactRound },
  { label: 'Conversations', path: '/conversations', icon: MessageSquareText },
  { label: 'Campagnes', path: '/campagnes', icon: Workflow },
  { label: 'Paramètres', path: '/parametres', icon: Settings2 },
];

export const moduleConfigs: Record<string, WorkspaceModule> = {
  '/marketing': {
    title: 'Marketing',
    subtitle:
      'Préparez vos contenus et donnez une direction claire à votre visibilité.',
    eyebrow: 'Attirer et engager',
    intro:
      'Votre espace marketing est en préparation. Il accueillera les outils de planification et de création de contenu, sans publier quoi que ce soit à votre place.',
    icon: Megaphone,
    nextStep: 'Définir vos objectifs et votre audience',
    scope: 'Aucun contenu ni publication n’a été créé.',
  },
  '/prospection': {
    title: 'Prospection',
    subtitle:
      'Organisez vos prochaines opportunités, avec une approche qui vous ressemble.',
    eyebrow: 'Trouver les bons contacts',
    intro:
      'L’espace de prospection est en préparation. Les futures recommandations resteront à valider par vous avant tout contact.',
    icon: Target,
    nextStep: 'Préciser votre client idéal',
    scope: 'Aucun contact n’a été recherché ni sollicité.',
  },
  '/crm': {
    title: 'CRM',
    subtitle:
      'Un endroit simple pour garder le fil de vos relations professionnelles.',
    eyebrow: 'Cultiver vos relations',
    intro:
      'Votre CRM est en préparation. Il est conçu pour réunir les contacts et les prochaines étapes de suivi quand les connexions seront disponibles.',
    icon: ContactRound,
    nextStep: 'Choisir les informations utiles à suivre',
    scope: 'Aucun contact ni dossier client n’est enregistré.',
  },
  '/conversations': {
    title: 'Conversations',
    subtitle: 'Retrouvez vos échanges au même endroit, sans perdre le contexte.',
    eyebrow: 'Rester dans le dialogue',
    intro:
      'L’espace conversations est en préparation. Les échanges ne seront accessibles qu’après branchement de vos canaux officiels.',
    icon: MessageSquareText,
    nextStep: 'Sélectionner les canaux à connecter',
    scope: 'Aucun message n’a été envoyé ou importé.',
  },
  '/campagnes': {
    title: 'Campagnes',
    subtitle:
      'Pensez vos campagnes avant leur lancement et gardez la main sur chaque étape.',
    eyebrow: 'Planifier avec intention',
    intro:
      'Votre espace campagnes est en préparation. Les actions resteront en brouillon jusqu’à une validation explicite et une intégration adaptée.',
    icon: Workflow,
    nextStep: 'Définir le résultat que vous souhaitez obtenir',
    scope: 'Aucune campagne n’a été lancée.',
  },
  '/parametres': {
    title: 'Paramètres',
    subtitle: 'Les réglages de votre espace seront réunis ici.',
    eyebrow: 'Votre espace, vos choix',
    intro:
      'Les paramètres sont en préparation. À terme, vous pourrez gérer vos préférences et les intégrations autorisées depuis un seul endroit.',
    icon: Settings2,
    nextStep: 'Choisir vos préférences de travail',
    scope: 'Aucun service externe n’est connecté.',
  },
};
