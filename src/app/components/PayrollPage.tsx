import { useState } from 'react';
import { User, PayrollRecord } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { DollarSign, Download, Edit2, TrendingUp } from 'lucide-react';
import { mockPayroll, mockUsers } from '../data/mockData';

interface PayrollPageProps {
  user: User;
}

export function PayrollPage({ user }: PayrollPageProps) {
  const isAdmin = user.role === 'admin';
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>(mockPayroll);
  const [selectedEmployee, setSelectedEmployee] = useState(user.id);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<PayrollRecord | null>(null);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  const buildPayslipHtml = (payroll: PayrollRecord) => {
    const employee = mockUsers.find(u => u.id === payroll.employeeId);
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Payslip - ${payroll.employeeName} - ${payroll.month}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
        h1 { margin: 0 0 8px 0; }
        h2 { margin: 16px 0 8px 0; }
        .section { border: 1px solid #ddd; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f1f1; }
        .row:last-child { border-bottom: none; }
        .label { color: #555; }
        .value { font-weight: 600; }
      </style>
    </head>
    <body>
      <h1>Payslip</h1>
      <p>${payroll.month}</p>

      <div class="section">
        <h2>Employee Details</h2>
        <div class="row"><span class="label">Name</span><span class="value">${payroll.employeeName}</span></div>
        <div class="row"><span class="label">Employee ID</span><span class="value">${employee?.employeeId || '-'}</span></div>
        <div class="row"><span class="label">Department</span><span class="value">${employee?.department || '-'}</span></div>
        <div class="row"><span class="label">Position</span><span class="value">${employee?.position || '-'}</span></div>
      </div>

      <div class="section">
        <h2>Salary Breakdown</h2>
        <div class="row"><span class="label">Basic Salary</span><span class="value">${formatCurrency(payroll.basicSalary)}</span></div>
        <div class="row"><span class="label">Allowances</span><span class="value">${formatCurrency(payroll.allowances)}</span></div>
        <div class="row"><span class="label">Deductions</span><span class="value">-${formatCurrency(payroll.deductions).replace('$','')}</span></div>
        <div class="row" style="font-size: 1.05rem;">
          <span class="label">Net Salary</span>
          <span class="value">${formatCurrency(payroll.netSalary)}</span>
        </div>
      </div>

      <p style="color:#666; font-size: 12px; margin-top: 24px;">Generated on ${new Date().toLocaleDateString()}</p>
    </body>
    </html>`;
  };

  const handleDownloadPayslip = () => {
    if (!displayPayroll) return;
    const html = buildPayslipHtml(displayPayroll);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = displayPayroll.employeeName.replace(/\s+/g, '_');
    link.href = url;
    link.download = `${safeName}_${displayPayroll.month}_Payslip.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get payroll for display
  const displayPayroll = isAdmin 
    ? payrollData.find(p => p.employeeId === selectedEmployee)
    : payrollData.find(p => p.employeeId === user.id);

  const allPayroll = isAdmin ? payrollData : [displayPayroll].filter(Boolean) as PayrollRecord[];

  const totalPayroll = payrollData.reduce((sum, p) => sum + p.netSalary, 0);

  const handleEditPayroll = () => {
    if (editingPayroll) {
      setPayrollData(payrollData.map(p => 
        p.id === editingPayroll.id ? editingPayroll : p
      ));
      setShowEditDialog(false);
      setEditingPayroll(null);
    }
  };

  const openEditDialog = (payroll: PayrollRecord) => {
    setEditingPayroll({ ...payroll });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Payroll Management</h1>
          <p className="text-gray-600">
            {isAdmin ? 'Manage employee payroll and salary details' : 'View your salary details and payslips'}
          </p>
        </div>
        {displayPayroll && (
          <Button variant="outline" onClick={handleDownloadPayslip}>
            <Download className="size-4 mr-2" />
            Download Payslip
          </Button>
        )}
      </div>

      {/* Admin Stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{payrollData.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">${totalPayroll.toLocaleString()}</div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                ${Math.round(totalPayroll / payrollData.length).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                Growth <TrendingUp className="size-4 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">+5.2%</div>
              <p className="text-xs text-gray-600">vs last month</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Selector (Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Salary Breakdown */}
      {displayPayroll && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Salary Breakdown</CardTitle>
                <CardDescription>{displayPayroll.month}</CardDescription>
              </div>
              {isAdmin && (
                <Button size="sm" onClick={() => openEditDialog(displayPayroll)}>
                  <Edit2 className="size-4 mr-2" />
                  Edit Salary
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <DollarSign className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Basic Salary</p>
                    <p className="text-xl">${displayPayroll.basicSalary.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Allowances</p>
                  <p className="text-xl text-green-600">+${displayPayroll.allowances.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">Housing, Transport, etc.</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Deductions</p>
                  <p className="text-xl text-red-600">-${displayPayroll.deductions.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 mt-1">Tax, Insurance, etc.</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-xs text-gray-600">Amount to be paid</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl">${displayPayroll.netSalary.toLocaleString()}</p>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Processed
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Payment Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary</span>
                    <span>${displayPayroll.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>+ Allowances</span>
                    <span>${displayPayroll.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>- Deductions</span>
                    <span>${displayPayroll.deductions.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span>Net Payment</span>
                    <span>${displayPayroll.netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Payroll Table (Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>All Employee Payroll</CardTitle>
            <CardDescription>Complete payroll overview for all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Basic Salary</TableHead>
                    <TableHead className="text-right">Allowances</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayroll.map((payroll) => {
                    const employee = mockUsers.find(u => u.id === payroll.employeeId);
                    return (
                      <TableRow key={payroll.id}>
                        <TableCell>
                          <div>
                            <p>{payroll.employeeName}</p>
                            <p className="text-xs text-gray-600">{employee?.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{employee?.department}</TableCell>
                        <TableCell className="text-right">${payroll.basicSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">
                          +${payroll.allowances.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -${payroll.deductions.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${payroll.netSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Processed
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(payroll)}
                          >
                            <Edit2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Payroll Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salary</DialogTitle>
            <DialogDescription>
              Update salary components for {editingPayroll?.employeeName}
            </DialogDescription>
          </DialogHeader>
          
          {editingPayroll && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basicSalary">Basic Salary</Label>
                <Input
                  id="basicSalary"
                  type="number"
                  value={editingPayroll.basicSalary}
                  onChange={(e) => {
                    const basicSalary = parseFloat(e.target.value);
                    setEditingPayroll({
                      ...editingPayroll,
                      basicSalary,
                      netSalary: basicSalary + editingPayroll.allowances - editingPayroll.deductions,
                    });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allowances">Allowances</Label>
                <Input
                  id="allowances"
                  type="number"
                  value={editingPayroll.allowances}
                  onChange={(e) => {
                    const allowances = parseFloat(e.target.value);
                    setEditingPayroll({
                      ...editingPayroll,
                      allowances,
                      netSalary: editingPayroll.basicSalary + allowances - editingPayroll.deductions,
                    });
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deductions">Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  value={editingPayroll.deductions}
                  onChange={(e) => {
                    const deductions = parseFloat(e.target.value);
                    setEditingPayroll({
                      ...editingPayroll,
                      deductions,
                      netSalary: editingPayroll.basicSalary + editingPayroll.allowances - deductions,
                    });
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Net Salary</p>
                  <p className="text-xl">${editingPayroll.netSalary.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPayroll}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
