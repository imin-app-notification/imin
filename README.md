# Im In App
![pic](./assets/img/im-in.png)

## Table of Contents

- [[Im In App]](#im-in-app)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [Accounts](#accounts)
  - [File Structure](#file-structure)


## Installation

### NextJS

Install `nodejs` from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

Then use the following commend to [install NextJS](https://nextjs.org/docs/getting-started)

```bash
npm install next react react-dom
```

### Installation of Mongo DB

**MongoDB Windows Installation**

A full Windows installation guide can be found [here](https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database#setting-up-mongodb-on-windows)

Visit [MongoDB](https://www.mongodb.com/try/download/community) and find the Windows installer. Verify you have the correct version selected as per the Prerequisites section.

Once the installer has downloaded, double click to start the installation. Follow the prompts to progress through the installation. When asked to choose a setup type, select the “Complete” version. Keep the default service configuration. You will be prompted to download MongoDB Compass, this is recommended if you wish to see the contents of the database. Finally, click the install button on the last prompt to execute the installation.

Launch a terminal session and execute the command:

```bash
md \data\db
```

This will setup a directory where MongoDB can store the database locally

To run MongoDB, you will type the absolute path to the executable. Make sure you have the version number matches what you installed:

```bash
“C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe”
```

To connect to the server, open another terminal session and enter the absolute path to the mongo.exe executable:

```bash
“C:\Program Files\MongoDB\Server\5.0\bin\mongo.exe”
```

You can verify the connection in your second terminal by running:

```bash
show dbs
```

This will show the sections of your database and how much space they are using.

To connect to the database with MongoDB Compass, first launch the application. Then, navigate to the New Connection page and hit the green `connect` button. MongoDB Compass will then attempt to connect to any databases running locally.

**MongoDB Mac Installation**

Tap the [MongoDB Homebrew Tap](https://github.com/mongodb/homebrew-brew) to download the official Homebrew formula for MongoDB and the Database Tools, by running the following command in your macOS Terminal:

```bash
brew tap mongodb/brew
```

To install MongoDB, run the following command in your macOS Terminal application:

```bash
brew install mongodb-community@5.0
```

To run MongoDB (i.e. the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#mongodb-binary-bin.mongod) process) **as a macOS service**, run:

```bash
brew services start mongodb-community@5.0
```

To stop a [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#mongodb-binary-bin.mongod) running as a macOS service, use the following command as needed:

```bash
brew services stop mongodb-community@5.0
```

Launch mongoDB Terminal

```bash
mongosh
```

## Quick Start

Clone `sidebar` branch of project from GitLab

```bash
git clone -b sidebar --single-branch <https://gitlab.bucknell.edu/pmm018.git>
```

Create a file named `.env.local` in `im-in-senior-design/` and copy the following content into the file.

```
MONGO_URI=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
SENDGRID_API_KEY=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
BOXMAP_API_KEY=pk.eyJ1IjoibXI3amFja3kiLCJhIjoiY2t1eDhxYmRxMjNicTJvcTliYzZvdG9sYyJ9.PiTEElOGozLlE6JG2Pl0Gg
```

Install the required package

```bash
npm install
```

Launch the MongoDB

```bash
brew services start mongodb-community@5.0
```

Launch the GUI

```bash
npm run dev
```

Open a browser and go the the following site

```
http://localhost:3000/
```

## Accounts

#### Gmail
Email: imin.app.notifications@gmail.com
Password: kw9Pb4Qr

#### Github Account
Username: imin-app-notification
Email: imin.app.notifications@gmail.com
Password: Imin.app.2021

#### Mongodb
Login with google
Username: iminappnotifications
Password: Imin.app.2021

#### Mapbox Account
Username: iminappnotifications
Email: imin.app.notifications@gmail.com
Password: Imin.app.2021

#### SendGrid Account
Email: imin.app.notifications@gmail.com
Password: imin.sendgrid.develop.2021

#### Creative Tim
Email: cjy003@bucknell.edu
Password: jzl9wtgs

#### [Figma UI](https://www.figma.com/proto/M1pisrq62D22ixySyDdRiP/Im-In-Figma?node-id=38%3A5147&starting-point-node-id=39%3A6977)


## File Structure

* [Documentation/](./Documentation)
  * [documentation.html](./Documentation/documentation.html)
* [assets/](./assets)
  * [css/](./assets/css)
    * [map.css](./assets/css/map.css)
    * [nextjs-argon-dashboard.css](./assets/css/nextjs-argon-dashboard.css)
    * [nextjs-argon-dashboard.css.map](./assets/css/nextjs-argon-dashboard.css.map)
    * [nextjs-argon-dashboard.min.css](./assets/css/nextjs-argon-dashboard.min.css)
  * [fonts/](./assets/fonts)
  * [img/](./assets/img)
    * [brand/](./assets/img/brand)
    * [icons/](./assets/img/icons)
    * [theme/](./assets/img/theme)
    * [im-in.jpg](./assets/img/im-in.jpg)
    * [sample.jpg](./assets/img/sample.jpg)
  * [plugins/](./assets/plugins)
    * [nucleo/](./assets/plugins/nucleo)
  * [scss/](./assets/scss)
    * [argon-dashboard/](./assets/scss/argon-dashboard)
    * [react/](./assets/scss/react)
    * [nextjs-argon-dashboard.scss](./assets/scss/nextjs-argon-dashboard.scss)
* [components/](./components)
  * [Calendar/](./components/Calendar)
    * [Calendar.bk.jsx](./components/Calendar/Calendar.bk.jsx)
    * [Calendar.jsx](./components/Calendar/Calendar.jsx)
    * [EventCalendar.js](./components/Calendar/EventCalendar.js)
    * [calendar.bk.css](./components/Calendar/calendar.bk.css)
    * [calendar.css](./components/Calendar/calendar.css)
    * [event-utils.js](./components/Calendar/event-utils.js)
  * [Events/](./components/Events)
    * [EventDetails.js](./components/Events/EventDetails.js)
    * [EventDetailsHeader.js](./components/Events/EventDetailsHeader.js)
    * [UpcomingEvent.js](./components/Events/UpcomingEvent.js)
  * [Footers/](./components/Footers)
    * [AdminFooter.js](./components/Footers/AdminFooter.js)
    * [AuthFooter.js](./components/Footers/AuthFooter.js)
  * [Groups/](./components/Groups)
    * [AttendOptions.js](./components/Groups/AttendOptions.js)
    * [GroupCard.js](./components/Groups/GroupCard.js)
    * [GroupDetails.js](./components/Groups/GroupDetails.js)
    * [GroupTable.js](./components/Groups/GroupTable.js)
  * [Headers/](./components/Headers)
    * [CreateEventHeader.js](./components/Headers/CreateEventHeader.js)
    * [CreateGroupHeader.js](./components/Headers/CreateGroupHeader.js)
    * [FeedbackHeader.js](./components/Headers/FeedbackHeader.js)
    * [GroupDetailsHeader.js](./components/Headers/GroupDetailsHeader.js)
    * [Header.js](./components/Headers/Header.js)
    * [UserHeader.js](./components/Headers/UserHeader.js)
  * [Navbars/](./components/Navbars)
    * [AdminNavbar.js](./components/Navbars/AdminNavbar.js)
    * [AuthNavbar.js](./components/Navbars/AuthNavbar.js)
  * [NextEvent/](./components/NextEvent)
    * [NextEvent.js](./components/NextEvent/NextEvent.js)
  * [PageChange/](./components/PageChange)
    * [PageChange.js](./components/PageChange/PageChange.js)
  * [Sidebar/](./components/Sidebar)
    * [Sidebar.js](./components/Sidebar/Sidebar.js)
  * [YourInvites/](./components/YourInvites)
    * [YourInvites.js](./components/YourInvites/YourInvites.js)
* [layouts/](./layouts)
  * [Admin.js](./layouts/Admin.js)
  * [Auth.js](./layouts/Auth.js)
* [lib/](./lib)
* [pages](./pages)
  * [admin/](./pages/admin)
    * [auth/](./pages/admin/auth)
      * [login.js](./pages/admin/auth/login.js)
      * [register.js](./pages/admin/auth/register.js)
    * [eventDetails/](./pages/admin/eventDetails)
      * [[...eventId].js](./pages/admin/eventDetails/[...eventId].js)
    * [groupDetails/](./pages/admin/groupDetails)
      * [[...groupId].js](./pages/admin/groupDetails/[...groupId].js)
    * [create-event.js](./pages/admin/create-event.js)
    * [create-group.js](./pages/admin/create-group.js)
    * [dashboard.js](./pages/admin/dashboard.js)
    * [feedback.js](./pages/admin/feedback.js)
    * [groups.js](./pages/admin/groups.js)
    * [icons.js](./pages/admin/icons.js)
    * [profile.js](./pages/admin/profile.js)
    * [tables.js](./pages/admin/tables.js)
  * [api/](./pages/api)
    * [auth/](./pages/api/auth)
      * [[...nextauth].js](./pages/api/auth/[...nextauth].js)
      * [signup.js](./pages/api/auth/signup.js)
    * [user/](./pages/api/user)
      * [change-password.js](./pages/api/user/change-password.js)
    * [allGroups.js](./pages/api/allGroups.js)
    * [attendOptionUpdate.js](./pages/api/attendOptionUpdate.js)
    * [event.js](./pages/api/event.js)
    * [eventInvites.js](./pages/api/eventInvites.js)
    * [fetchAllEvent.js](./pages/api/fetchAllEvent.js)
    * [file.js](./pages/api/file.js)
    * [group.js](./pages/api/group.js)
    * [nextEvent.js](./pages/api/nextEvent.js)
    * [sendEmail.js](./pages/api/sendEmail.js)
    * [upcomingEvent.js](./pages/api/upcomingEvent.js)
    * [updateGroup.js](./pages/api/updateGroup.js)
    * [userProfile.js](./pages/api/userProfile.js)
  * [404.js](./pages/404.js)
  * [_app.js](./pages/_app.js)
  * [_document.js](./pages/_document.js)
  * [_error.js](./pages/_error.js)
  * [auth.js](./pages/auth.js)
  * [index.js](./pages/index.js)
    * [auth.js](./lib/auth.js)
    * [cookies.js](./lib/cookies.js)
    * [db.js](./lib/db.js)
