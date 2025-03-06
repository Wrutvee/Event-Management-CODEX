# Event Management System

A full-stack event management application with separate admin and user panels.

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (v4.4 or higher)

### Setting up the project locally
 - Make a .env file and fill up each variable as per .env.sample in each of the 4 folders
 - Click on the start-server.bat file present in the root folder of the project (Windows)
 - This is start admin panel - frontend at port 5173 and backend at 3000
 - And users panel - frontend at port 5175 and backend at 3001
 - Admin panel is a invite only signup so run intialize admin script present in admin-panel-backend/scripts/initializeAdmins.js
 - Browse to http://localhost:5173/signup?invite=ADMIN1234 to create the first superadmin, subsequent ones can be invited from the home page


### TODO:
 ## Admin panel frontend :
  ~~- Add loading animation in signin, signup, forgot pass pages~~
  ~~- create invitation of admin or superadmin page~~
  ~~- create profile page~~
  ~~- features to edit profile page~~
  ~~- Fully build the event page~~
  - Task assign to each teams
  - Broadcasting message in each events

 ## Admin panel backend :
  ~~- route to handle invitation of new admin ~~
  ~~- route to view and update profile of admins~~
  ~~- Add all the necessary backend logic to handle the event page~~
  
  ## Users panel frontend :
  ~~- Create events page~~
  ~~- Fetch event lists from backend instead of mock data~~
  - Team building
  - Task viewing and submissions
  - Realtime notifications using supabase

  ## Users panel backend :
  ~~- Create route to serve event data~~