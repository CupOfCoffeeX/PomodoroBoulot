export type Lang = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      login: 'Se connecter',
      start: 'Commencer',
    },
    hero: {
      badge: 'Open source · Gratuit · V1',
      title: 'La méthode Pomodoro,\npensée pour les pros.',
      subtitle:
        'Gérez votre temps de travail avec la méthode Pomodoro. Timer précis, gestion de tâches et notifications natives — tout en un.',
      cta: 'Créer un compte gratuit',
      ctaSecondary: 'Se connecter',
      platforms: 'Disponible sur',
    },
    features: {
      title: 'Tout ce dont vous avez besoin',
      subtitle: 'Une app légère, sans friction, conçue pour rester concentré.',
      items: [
        {
          icon: '🍅',
          title: 'Timer Pomodoro',
          desc: 'Cycles 25 / 5 / 30 min automatiques. Passez d\'une phase à l\'autre sans effort.',
        },
        {
          icon: '✅',
          title: 'Gestion des tâches',
          desc: 'Créez, réorganisez et liez vos tâches à vos sessions pour un suivi précis.',
        },
        {
          icon: '🔔',
          title: 'Notifications natives',
          desc: 'Alertes OS desktop et browser web à la fin de chaque session.',
        },
        {
          icon: '👥',
          title: 'Multi-utilisateurs',
          desc: 'Créez votre compte, vos données sont privées et sécurisées par JWT.',
        },
        {
          icon: '🖥️',
          title: 'Widget macOS',
          desc: 'Mode compact toujours visible, flottant au-dessus de vos fenêtres.',
        },
        {
          icon: '🌐',
          title: 'Web & Desktop',
          desc: 'Accédez à l\'app depuis votre navigateur ou l\'application macOS native.',
        },
      ],
    },
    howItWorks: {
      title: 'Comment ça marche',
      subtitle: 'Trois étapes pour une journée productive.',
      steps: [
        {
          number: '01',
          title: 'Créez vos tâches',
          desc: 'Ajoutez vos tâches du jour et estimez le nombre de Pomodoros nécessaires.',
        },
        {
          number: '02',
          title: 'Lancez un Pomodoro',
          desc: 'Sélectionnez une tâche, lancez le timer et concentrez-vous 25 minutes.',
        },
        {
          number: '03',
          title: 'Suivez votre progression',
          desc: 'Les Pomodoros s\'accumulent sur chaque tâche. Faites vos pauses sereinement.',
        },
      ],
    },
    pricing: {
      title: 'Simple et transparent',
      subtitle: 'Commencez gratuitement, la version premium arrive bientôt.',
      free: {
        badge: 'Disponible maintenant',
        title: 'Gratuit',
        price: '0€',
        desc: 'Pour toujours',
        features: [
          'Timer Pomodoro complet',
          'Gestion des tâches',
          'Notifications desktop & web',
          'Widget macOS',
          'Compte utilisateur sécurisé',
        ],
        cta: 'Commencer gratuitement',
      },
      premium: {
        badge: 'En développement',
        title: 'Premium',
        price: 'Bientôt',
        desc: 'Fonctionnalités avancées',
        features: [
          'Tout le plan gratuit',
          'Dashboard analytique',
          'Historique complet des sessions',
          'Sync multi-appareils',
          'Statistiques hebdomadaires',
        ],
        cta: 'Être notifié',
      },
    },
    github: {
      badge: 'Open Source',
      title: 'Code source disponible',
      desc: 'PomodoroBoulot est entièrement open source. Explorez le code, signalez des bugs ou contribuez sur GitHub.',
      stars: 'étoiles',
      forks: 'forks',
      cta: 'Voir sur GitHub',
      contribute: 'Contribuer',
    },
    support: {
      title: 'Soutenir le projet',
      desc: 'PomodoroBoulot est développé seul, avec passion. Si l\'app vous aide dans votre quotidien, un café est toujours bienvenu ☕',
      cta: 'Offrir un café',
    },
    footer: {
      tagline: 'Fait avec ❤️ pour les travailleurs focalisés.',
      rights: '© 2026 PomodoroBoulot',
    },
  },

  en: {
    nav: {
      login: 'Sign in',
      start: 'Get started',
    },
    hero: {
      badge: 'Open source · Free · V1',
      title: 'The Pomodoro technique,\nbuilt for professionals.',
      subtitle:
        'Manage your work time with the Pomodoro method. Precise timer, task management and native notifications — all in one.',
      cta: 'Create a free account',
      ctaSecondary: 'Sign in',
      platforms: 'Available on',
    },
    features: {
      title: 'Everything you need',
      subtitle: 'A lightweight, frictionless app designed to keep you focused.',
      items: [
        {
          icon: '🍅',
          title: 'Pomodoro Timer',
          desc: 'Automatic 25 / 5 / 30 min cycles. Move between phases effortlessly.',
        },
        {
          icon: '✅',
          title: 'Task Management',
          desc: 'Create, reorder and link tasks to sessions for precise tracking.',
        },
        {
          icon: '🔔',
          title: 'Native Notifications',
          desc: 'Desktop OS and web browser alerts at the end of each session.',
        },
        {
          icon: '👥',
          title: 'Multi-user',
          desc: 'Create your account — your data is private and JWT-secured.',
        },
        {
          icon: '🖥️',
          title: 'macOS Widget',
          desc: 'Compact always-on-top mode, floating above your windows.',
        },
        {
          icon: '🌐',
          title: 'Web & Desktop',
          desc: 'Access the app from your browser or the native macOS application.',
        },
      ],
    },
    howItWorks: {
      title: 'How it works',
      subtitle: 'Three steps to a productive day.',
      steps: [
        {
          number: '01',
          title: 'Create your tasks',
          desc: 'Add your tasks for the day and estimate the number of Pomodoros needed.',
        },
        {
          number: '02',
          title: 'Start a Pomodoro',
          desc: 'Select a task, start the timer and focus for 25 minutes.',
        },
        {
          number: '03',
          title: 'Track your progress',
          desc: 'Pomodoros accumulate on each task. Take your breaks with peace of mind.',
        },
      ],
    },
    pricing: {
      title: 'Simple and transparent',
      subtitle: 'Start for free, premium version coming soon.',
      free: {
        badge: 'Available now',
        title: 'Free',
        price: '$0',
        desc: 'Forever',
        features: [
          'Full Pomodoro timer',
          'Task management',
          'Desktop & web notifications',
          'macOS widget',
          'Secure user account',
        ],
        cta: 'Get started for free',
      },
      premium: {
        badge: 'In development',
        title: 'Premium',
        price: 'Soon',
        desc: 'Advanced features',
        features: [
          'Everything in Free',
          'Analytics dashboard',
          'Full session history',
          'Multi-device sync',
          'Weekly statistics',
        ],
        cta: 'Get notified',
      },
    },
    github: {
      badge: 'Open Source',
      title: 'Source code available',
      desc: 'PomodoroBoulot is fully open source. Browse the code, report bugs or contribute on GitHub.',
      stars: 'stars',
      forks: 'forks',
      cta: 'View on GitHub',
      contribute: 'Contribute',
    },
    support: {
      title: 'Support the project',
      desc: 'PomodoroBoulot is built solo, with passion. If the app helps your daily workflow, a coffee is always appreciated ☕',
      cta: 'Buy me a coffee',
    },
    footer: {
      tagline: 'Made with ❤️ for focused workers.',
      rights: '© 2026 PomodoroBoulot',
    },
  },
} as const;

export type Translations = (typeof translations)['fr'];
