import { useState } from 'react';
import { User, AttendanceRecord } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { mockAttendance, mockUsers, mockLeaveRequests } from '../data/mockData';

interface AttendancePageProps {
  user: User;
}

export function AttendancePage({ user }: AttendancePageProps) {
  const isAdmin = user.role === 'admin';
  const [selectedEmployee, setSelectedEmployee] = useState(user.id);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Filter attendance based on role
  const attendanceData = isAdmin 
    ? mockAttendance.filter(a => a.employeeId === selectedEmployee)
    : mockAttendance.filter(a => a.employeeId === user.id);

  // Get leave requests for the employee
  const leaveData = isAdmin
    ? mockLeaveRequests.filter(l => l.employeeId === selectedEmployee)
    : mockLeaveRequests.filter(l => l.employeeId === user.id);

  // Calculate statistics
  const presentDays = attendanceData.filter(a => a.status === 'present').length;
  const absentDays = attendanceData.filter(a => a.status === 'absent').length;
  const halfDays = attendanceData.filter(a => a.status === 'half-day').length;
  const leaveDays = attendanceData.filter(a => a.status === 'leave').length;
  const totalDays = attendanceData.length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      present: { label: 'Present', className: 'bg-green-500 text-white' },
      absent: { label: 'Absent', className: 'bg-red-500 text-white' },
      'half-day': { label: 'Half Day', className: 'bg-yellow-500 text-white' },
      leave: { label: 'Leave', className: 'bg-blue-500 text-white' },
    };
    return variants[status];
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Calendar view logic
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getAttendanceForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendance = attendanceData.find(a => a.date === dateStr);
    const leave = leaveData.find(l => {
      const leaveStart = new Date(l.startDate);
      const leaveEnd = new Date(l.endDate);
      const currentDate = new Date(dateStr);
      return currentDate >= leaveStart && currentDate <= leaveEnd;
    });
    
    return { attendance, leave };
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-20" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const { attendance, leave } = getAttendanceForDate(day);
    calendarDays.push(
      <div
        key={day}
        className="h-20 border border-purple-100 rounded-lg p-2 hover:bg-purple-50 transition-colors relative"
      >
        <div className="font-semibold text-sm text-gray-700 mb-1">{day}</div>
        {attendance && (
          <div className={`text-xs px-2 py-1 rounded ${getStatusBadge(attendance.status).className}`}>
            {getStatusBadge(attendance.status).label}
          </div>
        )}
        {leave && (
          <div className={`text-xs px-2 py-1 rounded text-white mt-1 ${getLeaveStatusColor(leave.status)}`}>
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor and manage attendance records</p>
        </div>
        {isAdmin && (
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map(u => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name} ({u.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {attendanceRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" />
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-green-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{presentDays}</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-red-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{absentDays}</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-yellow-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Half Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{halfDays}</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-blue-500" />
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{leaveDays}</div>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-purple-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="size-5 text-purple-600" />
                  Monthly Calendar
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="font-semibold text-gray-900 min-w-[150px] text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-sm">Present / Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span className="text-sm">Half Day / Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-sm">Absent / Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">Leave</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-purple-600 mb-2">
                    {day}
                  </div>
                ))}
                {calendarDays}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-5 text-purple-600" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Detailed attendance records</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {attendanceData.slice(0, 10).map((record, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="size-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        {record.checkIn && record.checkOut && (
                          <p className="text-sm text-gray-600">
                            {record.checkIn} - {record.checkOut}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusBadge(record.status).className}>
                      {getStatusBadge(record.status).label}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
