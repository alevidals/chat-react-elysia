# Welcome to ChatReactElysia!

This is a project to learn and practice (at the moment I write this) [React Router v7](https://reactrouter.com/7.1.5/home), websockets and [Elysia](https://elysiajs.com/) (a Bun framework)

## Prerequisites

- Node > 20 version. You can use [fnm](https://github.com/Schniz/fnm) to setup a node version manager.
- Bun to run the project. [How to install bun](https://bun.sh/docs/installation).

## Installation

1. Clone the repository
   ```sh
   git clone https://github.com/alevidals/chat-react-elysia.git
   ```
2. Install client and server dependencies
   ```sh
   # go inside the project folder
   cd chat-react-elysia
   # install client dependencies
   bun i
   # install server dependencies
   cd server
   bun i
   ```
3. Start both projects
   ```sh
   # At this moment you will need 3 terminal instances (one for the server, and the others for clients)
   # Let's start the server project
   cd server # if you are not on the server directory
   bun dev
   # Let's start the clients projects
   # To simulate that there are different logged users I have simulate this setting up a environment variable at the dev script
   bun dev-user-1 # this will start the project as the user 1
   bun dev-user-2 # this will start the project as the user 2
   ```

## Congrats you can now test the application 🎊🎉
