import { createContext, type PropsWithChildren, use, useMemo, useState } from 'react';

import { validateCredentials } from './credentials';

type SessionContextValue = {
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<SessionContextValue>(
    () => ({
      isAuthenticated,
      signIn(username, password) {
        const isValid = validateCredentials(username, password);
        setIsAuthenticated(isValid);
        return isValid;
      },
      signOut() {
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = use(SessionContext);

  if (!session) {
    throw new Error('useSession must be used inside SessionProvider');
  }

  return session;
}
