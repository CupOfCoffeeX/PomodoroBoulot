
# 🧠 PomodoroBoulot

> Application macOS de gestion du temps basée sur la technique Pomodoro, avec suivi avancé de productivité et intégration de tâches.

---

## 🚀 Vision

PomodoroBoulot vise à améliorer la productivité en combinant :

- ⏱️ **Timer Pomodoro intelligent**
- ✅ **Gestion de tâches intégrée**
- 📊 **Analyse de productivité (dashboard)**

L’objectif est de transformer des sessions de travail en données exploitables.

---

## 🧱 Stack Technique

### Frontend (macOS)

- Swift + SwiftUI
- Alternative :
    - Tauri
    - React + **Shadcn UI**
    - TailwindCSS


---

### Backend

- Node.js (NestJS recommandé)
- PostgreSQL
- Prisma ORM

---

### Future

- Web app (React + Shadcn)
- Sync cloud
- Multi-device

---

## ✨ Features

### 🟢 MVP (Version 1)

#### ⏱️ Timer Pomodoro

- Lancer / Pause / Reset
- Cycles automatiques :
    - 25 min travail
    - 5 min pause
    - 30 min pause longue tous les 4 cycles
- Affichage :
    - Mode compact (floating window)
    - Mode complet

#### 🪟 Mode compact (floating widget)

- Toujours au-dessus (optionnel)
- Timer en cours
- Tâche actuelle
- Boutons :
    - Play / Pause
    - Next task
    - Complete task

---

#### ✅ To-do list basique

- CRUD tâches
- Ordre des tâches
- Statuts :
    - pending
    - in_progress
    - done

---

#### 🔗 Lien tâche ↔ pomodoro

- Associer une tâche à un pomodoro actif
- Compter automatiquement :
    - nombre de pomodoros par tâche

---

---

### 🟡 Version 2 (Productivité avancée)

#### 📊 Dashboard

- Temps total travaillé
- Pomodoros réalisés / jour / semaine
- Répartition par tâche
- Temps moyen par tâche

#### 📈 Analytics

- Productivité par plage horaire
- Taux de complétion des tâches
- Estimation vs réel

---

#### 🎯 Objectifs

- Nombre de pomodoros / jour
- Nombre de tâches / jour

---

---

### 🔵 Version 3 (Scaling)

- Sync cloud
- Multi-device
- Collaboration (optionnel)
- AI suggestions (plus tard)

---

## 🧩 Modèle de données

### User

```
idemailcreatedAt
```

### Task

```
idtitledescriptionstatusestimatedPomodoroscreatedAt
```

### PomodoroSession

```
idstartTimeendTimetype (work | short_break | long_break)
```

### TaskPomodoro

```
idtaskIdpomodoroIdduration
```

---

## 🔌 API Endpoints

### Auth (future)

```
POST   /auth/registerPOST   /auth/login
```

---

### Tasks

```
GET    /tasksPOST   /tasksPUT    /tasks/:idDELETE /tasks/:idPATCH  /tasks/:id/status
```

---

### Pomodoro

```
POST   /pomodoro/startPOST   /pomodoro/pausePOST   /pomodoro/resetPOST   /pomodoro/complete
```

---

### Tracking

```
POST   /tracking/start-taskPOST   /tracking/end-taskGET    /tracking/statsGET    /tracking/dashboard
```

---

## 🖥️ UX / UI

### Modes

#### 1. Mode complet

- Timer large
- Liste des tâches
- Configuration
- Stats

#### 2. Mode compact

- Mini fenêtre draggable
- Timer + tâche actuelle
- Actions rapides

---

## 🛣️ Roadmap

### Phase 1 (2–3 semaines)

- Timer fonctionnel
- UI basique
- To-do list locale (no backend)

👉 Objectif : **Produit utilisable**

---

### Phase 2 (2–4 semaines)

- Backend + DB
- Tracking pomodoros
- Association tâches ↔ sessions

---

### Phase 3 (3–4 semaines)

- Dashboard
- Analytics
- Optimisation UX

---

### Phase 4

- Version web (React + Shadcn)
- Sync

---

## ⚠️ Points critiques

### 1. UX > features

L'app doit être **ultra rapide et simple à utiliser** :

- 1 clic pour lancer
- 0 friction

---

### 2. Floating window (hard part)

Sur macOS :

- gestion du always-on-top
- drag & drop
- focus


---

### 3. Tracking automatique

Eviter :

> "l'utilisateur doit penser à cliquer"

👉 Automatiser :

- fin de pomodoro → assignation auto
- task tracking

---

## 💡 Améliorations futures

- Intégration calendrier (Google Calendar)
- Mode deep work (bloquer distractions)
- Sons / ambiance
- Notifications intelligentes
