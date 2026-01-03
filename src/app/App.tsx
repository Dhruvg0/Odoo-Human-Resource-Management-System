import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { User } from './types';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProfilePage } from './components/ProfilePage';
import { AttendancePage } from './components/AttendancePage';
import { LeavePage } from './components/LeavePage';
import { PayrollPage } from './components/PayrollPage';
import { Toaster } from './components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { toast } from 'sonner';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    toast.success('Logged out successfully', {
      description: 'See you next time!',
    });
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setShowLanding(true);
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Show landing page
  if (showLanding && !currentUser) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show auth page if not authenticated
  if (!currentUser) {
    return (
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
        <AuthPage onLogin={handleLogin} onBack={() => setShowLanding(true)} />
      </GoogleOAuthProvider>
    );
  }

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'attendance':
        return <AttendancePage user={currentUser} />;
      case 'leave':
        return <LeavePage user={currentUser} />;
      case 'payroll':
        return <PayrollPage user={currentUser} />;
      default:
        return <Dashboard user={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <div className="h-screen flex bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <Sidebar 
            user={currentUser} 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={handleLogoutRequest}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {renderPage()}
          </div>
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel}>No, Stay Logged In</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
