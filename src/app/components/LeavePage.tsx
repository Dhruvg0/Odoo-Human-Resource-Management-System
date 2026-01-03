import { useState, useEffect } from 'react';
import { User, LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Calendar, FileText, CheckCircle2, XCircle, Clock, Bell } from 'lucide-react';
import { mockLeaveRequests } from '../data/mockData';
import { toast } from 'sonner';

interface LeavePageProps {
  user: User;
}

export function LeavePage({ user }: LeavePageProps) {
  const isAdmin = user.role === 'admin';
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [newLeave, setNewLeave] = useState({
    leaveType: 'paid' as LeaveType,
    startDate: '',
    endDate: '',
    remarks: '',
  });
  const [approvalComment, setApprovalComment] = useState('');

  // Filter leaves based on role
  const displayLeaves = isAdmin 
    ? leaves 
    : leaves.filter(l => l.employeeId === user.id);

  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  // Check for recently updated leaves (approved/rejected) for employees
  const recentlyUpdatedLeaves = !isAdmin 
    ? leaves.filter(l => 
        l.employeeId === user.id && 
        (l.status === 'approved' || l.status === 'rejected') &&
        l.adminComment
      )
    : [];

  const handleApplyLeave = () => {
    const leave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: user.id,
      employeeName: user.name,
      ...newLeave,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    
    setLeaves([leave, ...leaves]);
    setShowApplyDialog(false);
    setNewLeave({
      leaveType: 'paid',
      startDate: '',
      endDate: '',
      remarks: '',
    });
    
    toast.success('Leave request submitted successfully!', {
      description: 'Your request is now pending admin approval.',
    });
  };

  const handleApproval = (leaveId: string, status: 'approved' | 'rejected') => {
    const updatedLeaves = leaves.map(leave => 
      leave.id === leaveId 
        ? { ...leave, status, adminComment: approvalComment }
        : leave
    );
    
    setLeaves(updatedLeaves);
    setShowApprovalDialog(false);
    
    // Show notification
    const leaveRequest = updatedLeaves.find(l => l.id === leaveId);
    if (status === 'approved') {
      toast.success('Leave request approved!', {
        description: `${leaveRequest?.employeeName}'s leave has been approved.`,
      });
    } else {
      toast.error('Leave request rejected', {
        description: `${leaveRequest?.employeeName}'s leave has been rejected.`,
      });
    }
    
    setSelectedLeave(null);
    setApprovalComment('');
  };

  const getStatusBadge = (status: LeaveStatus) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      approved: { variant: 'default' as const, icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { variant: 'destructive' as const, icon: XCircle, className: '' },
    };
    return variants[status];
  };

  const getLeaveTypeBadge = (type: LeaveType) => {
    const variants = {
      paid: 'bg-blue-100 text-blue-800 border-blue-200',
      sick: 'bg-purple-100 text-purple-800 border-purple-200',
      unpaid: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return variants[type];
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">
            {isAdmin 
              ? 'Review and approve employee leave requests' 
              : 'Apply for and track your leave requests'
            }
          </p>
        </div>
        {!isAdmin && (
          <Button onClick={() => setShowApplyDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Calendar className="size-4 mr-2" />
            Apply for Leave
          </Button>
        )}
      </div>

      {/* Employee Notifications for Approved/Rejected Leaves */}
      {!isAdmin && recentlyUpdatedLeaves.length > 0 && (
        <div className="space-y-3">
          {recentlyUpdatedLeaves.map((leave) => (
            <Alert 
              key={leave.id} 
              className={`border-0 shadow-md ${leave.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <Bell className="size-4" />
              <AlertTitle className="flex items-center gap-2 font-semibold">
                {leave.status === 'approved' ? (
                  <>
                    <CheckCircle2 className="size-4 text-green-600" />
                    Leave Request Approved!
                  </>
                ) : (
                  <>
                    <XCircle className="size-4 text-red-600" />
                    Leave Request Rejected
                  </>
                )}
              </AlertTitle>
              <AlertDescription>
                <p className="mb-1">
                  Your {leave.leaveType} leave request for{' '}
                  {new Date(leave.startDate).toLocaleDateString()} -{' '}
                  {new Date(leave.endDate).toLocaleDateString()} has been {leave.status}.
                </p>
                {leave.adminComment && (
                  <p className="text-sm mt-2 italic">
                    <strong>Admin Comment:</strong> {leave.adminComment}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{displayLeaves.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {displayLeaves.filter(l => l.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {displayLeaves.filter(l => l.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {displayLeaves.filter(l => l.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Approval Panel - ONLY FOR ADMIN */}
      {isAdmin && pendingLeaves.length > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="border-b border-yellow-100">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="size-4 text-yellow-600" />
              </div>
              Pending Approvals
              <Badge className="ml-2 bg-yellow-600 text-white">
                {pendingLeaves.length}
              </Badge>
            </CardTitle>
            <CardDescription>Review and approve leave requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {pendingLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-4 bg-white border-0 shadow-sm rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-gray-900">{leave.employeeName}</p>
                    <Badge variant="outline" className={getLeaveTypeBadge(leave.leaveType)}>
                      {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} 
                    ({calculateDays(leave.startDate, leave.endDate)} days)
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{leave.remarks}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedLeave(leave);
                      setShowApprovalDialog(true);
                    }}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Leave Requests */}
      <Card className="border-0 shadow-md">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="size-4 text-indigo-600" />
            </div>
            {isAdmin ? 'All Leave Requests' : 'My Leave Requests'}
          </CardTitle>
          <CardDescription>
            {isAdmin ? 'Complete history of all leave requests' : 'View your leave request history and status'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {displayLeaves.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="size-12 mx-auto mb-4 opacity-50" />
                <p>No leave requests found</p>
              </div>
            ) : (
              displayLeaves.map((leave) => {
                const statusBadge = getStatusBadge(leave.status);
                const StatusIcon = statusBadge.icon;
                
                return (
                  <div key={leave.id} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {isAdmin && <p className="font-medium text-gray-900">{leave.employeeName}</p>}
                          <Badge variant="outline" className={getLeaveTypeBadge(leave.leaveType)}>
                            {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave
                          </Badge>
                          <Badge className={statusBadge.className}>
                            <StatusIcon className="size-3 mr-1" />
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          <span>
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{calculateDays(leave.startDate, leave.endDate)} days</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(leave.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Remarks</Label>
                        <p className="text-sm text-gray-700">{leave.remarks}</p>
                      </div>
                      
                      {leave.adminComment && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <Label className="text-xs text-gray-500">Admin Comment</Label>
                          <p className="text-sm text-gray-700">{leave.adminComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply Leave Dialog - FOR ALL USERS */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Submit a new leave request for approval</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select
                value={newLeave.leaveType}
                onValueChange={(value: LeaveType) => setNewLeave({ ...newLeave, leaveType: value })}
              >
                <SelectTrigger id="leaveType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Please provide reason for leave..."
                value={newLeave.remarks}
                onChange={(e) => setNewLeave({ ...newLeave, remarks: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplyLeave}
              disabled={!newLeave.startDate || !newLeave.endDate || !newLeave.remarks}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog - ONLY FOR ADMIN */}
      {isAdmin && (
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Leave Request</DialogTitle>
              <DialogDescription>
                Approve or reject this leave request
              </DialogDescription>
            </DialogHeader>
            
            {selectedLeave && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-600">Employee</Label>
                    <p>{selectedLeave.employeeName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-600">Leave Type</Label>
                    <Badge variant="outline" className={getLeaveTypeBadge(selectedLeave.leaveType)}>
                      {selectedLeave.leaveType.charAt(0).toUpperCase() + selectedLeave.leaveType.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-600">Duration</Label>
                    <p className="text-sm">
                      {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}
                      ({calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days)
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Remarks</Label>
                    <p className="text-sm">{selectedLeave.remarks}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminComment">Admin Comment (Optional)</Label>
                  <Textarea
                    id="adminComment"
                    placeholder="Add a comment..."
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowApprovalDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => selectedLeave && handleApproval(selectedLeave.id, 'rejected')}
              >
                <XCircle className="size-4 mr-2" />
                Reject
              </Button>
              <Button 
                onClick={() => selectedLeave && handleApproval(selectedLeave.id, 'approved')}
              >
                <CheckCircle2 className="size-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}