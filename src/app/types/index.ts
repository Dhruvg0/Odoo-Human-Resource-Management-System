export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  address?: string;
  photo?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  salary?: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  checkIn?: string;
  checkOut?: string;
}

export type LeaveType = 'paid' | 'sick' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks: string;
  status: LeaveStatus;
  adminComment?: string;
  submittedDate: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
}