import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AccountDetailPage from "./pages/AccountDetailPage";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import type { AuthSession } from "./features/auth/types";

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage session={session} onLogout={() => setSession(null)} />
        }
      />

      <Route
        path="/login"
        element={
          <LoginPage
            isAuthenticated={session !== null}
            onLoginSuccess={(accessToken, user) =>
              setSession({ accessToken, user })
            }
          />
        }
      />

      <Route
        path="/accounts/:accountId"
        element={
          session ? (
            <AccountDetailPage
              key={session.user.email}
              accessToken={session.accessToken}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<p className="p-8">ไม่พบหน้าที่ต้องการ</p>} />
    </Routes>
  );
}
