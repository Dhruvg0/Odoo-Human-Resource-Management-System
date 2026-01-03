import { User } from '../types';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  UserCircle, 
  Calendar, 
  FileText, 
  DollarSign,
  LogOut,
  Building2
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentPage, onNavigate, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'leave', label: isAdmin ? 'Leave Management' : 'Leave Requests', icon: FileText },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
  ];

  return (
    <div className="h-full bg-white border-r border-purple-100 flex flex-col shadow-sm">
      {/* Logo Header */}
      <div className="p-6 border-b border-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="size-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dayflow
            </h2>
            <p className="text-xs text-gray-500">HR Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-purple-50 bg-gradient-to-br from-purple-50/50 to-pink-50/30">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-purple-100">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.position}</p>
          </div>
        </div>
        <Badge 
          className={`w-full justify-center font-medium shadow-sm ${
            isAdmin 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
              : 'bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-50'
          }`}
        >
          {isAdmin ? '⚡ HR Admin' : '👤 Employee'}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start h-11 transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="size-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-purple-50 bg-gradient-to-br from-red-50/30 to-pink-50/30">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 h-11 transition-colors"
          onClick={onLogout}
        >
          <LogOut className="size-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
