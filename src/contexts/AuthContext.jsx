// Placeholder AuthContext - will be created when authentication system is needed
export const useAuth = () => {
  return {
    user: null,
    login: () => {},
    logout: () => {},
    loading: false,
  }
}
