# Chat App

A modern real-time chat application with social features built with Remix, Socket.IO, and Prisma.

## Features

- � User authentication with secure sessions
- 💬 Real-time messaging with Socket.IO
- 👫 Friend management system (add, accept, reject)
- 📱 Responsive design for desktop and mobile
- 📝 Social feed for posts
- 🔄 Typing indicators
- 🔔 Unread message notifications

## Development

To run the full development environment (both Remix app and Socket.IO server):

```sh
npm run dev:all
```

Alternatively, run each separately:

```sh
# Remix app
npm run dev

# Socket.IO server
npm run socket
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
