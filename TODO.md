V1 implémentée. Voici le récap complet :                                                       
                                                                                                 
  ---                                                                                            
  Ce qui a été créé                                                                              
                                                                                                 
  Structure                                                                                      
                                                                                                 
  PomodoroBoulot/                                                                                
  ├── docker-compose.yml          ← PostgreSQL local                                             
  ├── API.md                      ← Tous les endpoints documentés
  ├── BUILD.md                    ← Commandes pour tout lancer                                   
  ├── apps/                                                                                      
  │   ├── backend/                ← NestJS + Prisma + PostgreSQL                                 
  │   └── desktop/                ← Tauri 2 + React + Shadcn                                     
                                                                                                 
  Backend (NestJS)
                                                                                                 
  - 3 modules : TasksModule, PomodoroModule, TrackingModule                                      
  - Prisma schema : Task, PomodoroSession, TaskPomodoro
  - Validation globale avec class-validator                                                      
  - CORS ouvert pour l'app Tauri
                                                                                                 
  Frontend (Tauri + React)
                                                                                                 
  - 2 layouts : MainLayout (plein écran) ↔ CompactLayout (widget flottant always-on-top          
  320×130px)
  - Timer : SVG ring animé, cycles 25/5/30 min, dots de cycle, pause/resume/skip                 
  - Tasks : CRUD, statuts (pending → in_progress → done), réordonnancement ↑↓, sélection pour    
  pomodoro                                                                                       
  - Zustand stores : useTimerStore (logique timer + sync backend) + useTaskStore                 
  - Shadcn UI : Button, Input, Card, Badge, Dialog, Label, Separator (écrits manuellement, zéro  
  dépendance CLI)                                                                                
  - TypeScript : 0 erreur                                                                        
                                                                                                 
  Prérequis avant de lancer                                                                      
   
  Rust n'est pas installé sur ta machine — BUILD.md contient la commande d'install (1 ligne).    
  Après ça, npm run tauri:dev compile tout en ~3 min la première fois.
