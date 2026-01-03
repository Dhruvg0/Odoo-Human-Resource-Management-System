import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  Clock, 
  FileText, 
  DollarSign, 
  Users, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Sparkles
} from 'lucide-react';
import { mockAttendance, mockLeaveRequests, mockPayroll } from '../data/mockData';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const isAdmin = user.role === 'admin';
  
  // Calculate user's stats
  const userAttendance = mockAttendance.filter(a => a.employeeId === user.id);
  const presentDays = userAttendance.filter(a => a.status === 'present').length;
  const totalDays = userAttendance.length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  
  const userLeaves = mockLeaveRequests.filter(l => l.employeeId === user.id);
  const pendingLeaves = userLeaves.filter(l => l.status === 'pending').length;
  
  // Admin stats
  const allPendingLeaves = mockLeaveRequests.filter(l => l.status === 'pending').length;
  const totalEmployees = mockPayroll.length;
  const totalPresent = mockAttendance.filter(a => a.status === 'present' && a.date === new Date().toISOString().split('T')[0]).length;
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-6 text-pink-200" />
              <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            </div>
            <p className="text-purple-100 flex items-center gap-2 text-lg">
              <CalendarClock className="size-5" />
              {currentDate}
            </p>
          </div>
          <Avatar className="size-16 border-4 border-white/30 shadow-xl ring-4 ring-white/20">
            <AvatarFallback className="bg-white text-purple-600 text-xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <Users className="size-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {totalEmployees}
                </div>
                <p className="text-sm text-gray-500 mt-1">Active members</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Present Today</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalPresent}</div>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="size-3" />
                  {Math.round((totalPresent / totalEmployees) * 100)}% attendance
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <AlertCircle className="size-6 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{allPendingLeaves}</div>
                <p className="text-sm text-gray-500 mt-1">Leave approvals needed</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Monthly Payroll</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="size-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">$420K</div>
                <p className="text-sm text-gray-500 mt-1">Total disbursement</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Calendar className="size-6 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{attendanceRate}%</div>
                <p className="text-sm text-gray-500 mt-1">{presentDays} of {totalDays} days</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Leave Balance</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Clock className="size-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">12 days</div>
                <p className="text-sm text-gray-500 mt-1">Available this year</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <FileText className="size-6 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{pendingLeaves}</div>
                <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Monthly Salary</CardTitle>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="size-6 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${(user.salary || 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-1">Gross payment</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-purple-50 bg-gradient-to-r from-purple-50/50 to-pink-50/30">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5 text-purple-600" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-6">
            {isAdmin ? (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  onClick={() => onNavigate('leave')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                      <FileText className="size-4 text-yellow-600" />
                    </div>
                    Review Leave Requests
                  </span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {allPendingLeaves}
                  </Badge>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-green-300 hover:bg-green-50 transition-colors group"
                  onClick={() => onNavigate('attendance')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Calendar className="size-4 text-green-600" />
                    </div>
                    View All Attendance
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  onClick={() => onNavigate('payroll')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <DollarSign className="size-4 text-blue-600" />
                    </div>
                    Manage Payroll
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-green-300 hover:bg-green-50 transition-colors group"
                  onClick={() => onNavigate('attendance')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Clock className="size-4 text-green-600" />
                    </div>
                    View My Attendance
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  onClick={() => onNavigate('leave')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText className="size-4 text-blue-600" />
                    </div>
                    Apply for Leave
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-12 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                  onClick={() => onNavigate('payroll')}
                >
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                      <DollarSign className="size-4 text-purple-600" />
                    </div>
                    View Payroll
                  </span>
                  <ArrowRight className="size-4 text-gray-400" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-purple-50 bg-gradient-to-r from-green-50/50 to-emerald-50/30">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="size-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Checked in successfully</p>
                  <p className="text-xs text-gray-500">Today at 9:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="size-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Leave request submitted</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <DollarSign className="size-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Payroll processed</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
