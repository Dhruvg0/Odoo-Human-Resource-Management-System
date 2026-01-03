import { User, AttendanceRecord, LeaveRequest, PayrollRecord } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'dhruv@gmail.com',
    role: 'employee',
    name: 'DHRUV',
    phone: '+1 234-567-8900',
    address: '123 Main St, New York, NY 10001',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2022-01-15',
    salary:  85000,
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'jane.smith@dayflow.com',
    role: 'employee',
    name: 'Jane Smith',
    phone: '+1 234-567-8901',
    address: '456 Oak Ave, New York, NY 10002',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2021-06-20',
    salary: 75000,
  },
  {
    id: '3',
    employeeId: 'ADMIN001',
    email: 'hr@gmail.com',
    role: 'admin',
    name: 'Sarah Johnson',
    phone: '+1 234-567-8902',
    address: '789 Pine Rd, New York, NY 10003',
    department: 'HR',
    position: 'HR Manager',
    joinDate: '2020-03-10',
    salary: 95000,
  },
  {
    id: '4',
    employeeId: 'EMP003',
    email: 'mike.brown@dayflow.com',
    role: 'employee',
    name: 'Mike Brown',
    phone: '+1 234-567-8903',
    address: '321 Elm St, New York, NY 10004',
    department: 'Engineering',
    position: 'Junior Developer',
    joinDate: '2023-02-01',
    salary: 65000,
  },
  {
    id: '5',
    employeeId: 'EMP004',
    email: 'emily.davis@dayflow.com',
    role: 'employee',
    name: 'Emily Davis',
    phone: '+1 234-567-8904',
    address: '654 Maple Dr, New York, NY 10005',
    department: 'Sales',
    position: 'Sales Executive',
    joinDate: '2022-08-15',
    salary: 70000,
  },
];

// Generate attendance records for the last 30 days
export const mockAttendance: AttendanceRecord[] = [];
const today = new Date();
for (let i = 0; i < 30; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split('T')[0];
  
  // Skip weekends
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  
  mockUsers.forEach(user => {
    const random = Math.random();
    let status: AttendanceRecord['status'];
    let checkIn: string | undefined;
    let checkOut: string | undefined;
    
    if (random > 0.9) {
      status = 'absent';
    } else if (random > 0.85) {
      status = 'leave';
    } else if (random > 0.80) {
      status = 'half-day';
      checkIn = '09:00 AM';
      checkOut = '01:00 PM';
    } else {
      status = 'present';
      checkIn = '09:00 AM';
      checkOut = '06:00 PM';
    }
    
    mockAttendance.push({
      id: `att-${user.id}-${dateStr}`,
      employeeId: user.id,
      date: dateStr,
      status,
      checkIn,
      checkOut,
    });
  });
}

// Mock leave requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: '1',
    employeeName: 'John Doe',
    leaveType: 'paid',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    remarks: 'Family vacation',
    status: 'approved',
    adminComment: 'Approved. Enjoy your vacation!',
    submittedDate: '2026-01-02',
  },
  {
    id: 'leave-2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    leaveType: 'sick',
    startDate: '2026-01-05',
    endDate: '2026-01-06',
    remarks: 'Medical appointment',
    status: 'pending',
    submittedDate: '2026-01-03',
  },
  {
    id: 'leave-3',
    employeeId: '4',
    employeeName: 'Mike Brown',
    leaveType: 'paid',
    startDate: '2026-01-15',
    endDate: '2026-01-17',
    remarks: 'Personal matters',
    status: 'pending',
    submittedDate: '2026-01-02',
  },
  {
    id: 'leave-4',
    employeeId: '5',
    employeeName: 'Emily Davis',
    leaveType: 'unpaid',
    startDate: '2026-01-08',
    endDate: '2026-01-09',
    remarks: 'Extended weekend',
    status: 'rejected',
    adminComment: 'Too many pending requests. Please reschedule.',
    submittedDate: '2026-01-01',
  },
];

// Mock payroll records
export const mockPayroll: PayrollRecord[] = mockUsers.map(user => ({
  id: `payroll-${user.id}`,
  employeeId: user.id,
  employeeName: user.name,
  basicSalary: user.salary || 0,
  allowances: (user.salary || 0) * 0.2,
  deductions: (user.salary || 0) * 0.1,
  netSalary: (user.salary || 0) * 1.1,
  month: 'January 2026',
}));