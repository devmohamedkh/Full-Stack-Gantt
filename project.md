Purpose: Assess a candidate’s ability to design and implement a small full‑stack product with clean architecture, solid code quality, and a responsive UI.

1. Scenario
   You’ve joined a small delivery team that needs a lightweight Activity Planner. Build a web app that shows a list of activities on a Gantt chart and lets users create, edit, update dates by dragging, and delete activities. All data must persist in PostgreSQL.

2. Requirements at a Glance
   • Backend: Node.js with NestJS
   • Database: PostgreSQL with TypeORM.
   • Frontend: React using gantt-task-react (https://github.com/MaTeMaTuK/gantt-task-react).
   • Core Features: Display activities on a Gantt chart; Create, edit, delete activities; Update dates by
   drag/resize; Persist all data in DB.
   • UX: Responsive Gantt view across desktop and mobile

3. Data Model
   Build the data model for an Activity entity .

4. Frontend Requirements
   • Bootstrapped with Vite.
   • Use gantt-task-react to render activities.
   • Enable inline date changes (drag, resize) and persist updates to DB via API.
   • Provide forms/modals for create and edit.
   • Show basic toasts/messages on success/failure.
   • Ensure responsive design (breakpoints, container widths, min zoom).
   • Filtering by status, details panel when selecting a task.
