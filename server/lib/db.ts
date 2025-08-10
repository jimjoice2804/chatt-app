// chatt-app/
// ├── prisma/
// │   ├── schema.prisma
// │   ├── migrations/
// │   └── seed.ts
// ├── server/                          # Express + Socket.IO server
// │   ├── index.js                     # Main server entry
// │   ├── socket/
// │   │   ├── socketHandler.js         # Socket.IO event handlers
// │   │   ├── messageHandler.js        # Message-related socket events
// │   │   ├── friendshipHandler.js     # Friend request socket events
// │   │   └── userHandler.js           # User status, typing events
// │   ├── middleware/
// │   │   ├── auth.js                  # JWT verification
// │   │   └── rateLimiter.js           # Rate limiting
// │   └── utils/
// │       └── socketAuth.js            # Socket authentication
// ├── app/                             # Remix application
// │   ├── components/
// │   │   ├── ui/                      # Reusable UI components
// │   │   │   ├── Button.tsx
// │   │   │   ├── Input.tsx
// │   │   │   └── Modal.tsx
// │   │   ├── chat/                    # Chat-specific components
// │   │   │   ├── ChatWindow.tsx
// │   │   │   ├── MessageBubble.tsx
// │   │   │   ├── ChatSidebar.tsx
// │   │   │   └── TypingIndicator.tsx
// │   │   ├── friends/
// │   │   │   ├── FriendsList.tsx
// │   │   │   ├── FriendRequest.tsx
// │   │   │   └── AddFriend.tsx
// │   │   └── layout/
// │   │       ├── Header.tsx
// │   │       └── Sidebar.tsx
// │   ├── hooks/
// │   │   ├── useSocket.ts             # Socket.IO React hook
// │   │   ├── useAuth.ts               # Authentication hook
// │   │   └── useChat.ts               # Chat functionality hook
// │   ├── lib/
// │   │   ├── auth.server.ts           # Server-side auth utilities
// │   │   ├── db.server.ts             # Prisma client instance
// │   │   ├── session.server.ts        # Session management
// │   │   └── validation.ts            # Zod schemas for validation
// │   ├── routes/
// │   │   ├── _index.tsx               # Home/landing page
// │   │   ├── login.tsx                # Login page
// │   │   ├── register.tsx             # Registration page
// │   │   ├── dashboard.tsx            # Main app dashboard
// │   │   ├── chat.$userId.tsx         # Individual chat page
// │   │   ├── friends.tsx              # Friends management
// │   │   └── api/
// │   │       ├── messages.tsx         # Message API routes
// │   │       ├── friends.tsx          # Friend request API
// │   │       └── auth.tsx             # Authentication API
// │   ├── styles/
// │   │   └── globals.css              # Global styles with Tailwind
// │   ├── types/
// │   │   ├── socket.ts                # Socket.IO event types
// │   │   └── user.ts                  # User-related types
// │   └── utils/
// │       ├── socketClient.ts          # Socket.IO client setup
// │       └── constants.ts             # App constants
// ├── public/
// │   ├── favicon.ico
// │   └── sw.js                        # Service worker for notifications
// ├── .env
// ├── .env.example
// ├── package.json
// ├── tailwind.config.ts
// ├── tsconfig.json
// └── vite.config.ts