
export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    Login: '/login',
    Logout: '/logout',
  },
  MongoUser: {
    Base: '/mongo-users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete',
    Login: '/login',
    Logout: '/logout',
  }
} as const;
