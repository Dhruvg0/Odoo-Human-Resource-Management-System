import { useRef, useState } from 'react';
import { User } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  Calendar,
  DollarSign,
  FileText,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

export function ProfilePage({ user, onUpdateUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isAdmin = user.role === 'admin';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditedUser(prev => ({ ...prev, photo: reader.result as string }));
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const documents = [
    {
      name: 'Resume - HR Admin.pdf',
      uploadedOn: 'Jan 3, 2026',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      name: 'ID_Proof.pdf',
      uploadedOn: 'Jan 2, 2026',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
    {
      name: 'Education_Certificate.pdf',
      uploadedOn: 'Jan 1, 2026',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="size-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="size-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="size-32">
              {editedUser.photo && (
                <img
                  src={editedUser.photo}
                  alt={editedUser.name}
                  className="size-full rounded-full object-cover"
                />
              )}
              <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3>{user.name}</h3>
              <p className="text-sm text-gray-600">{user.position}</p>
              <Badge variant="secondary" className="mt-2">
                {user.role === 'admin' ? 'Admin' : 'Employee'}
              </Badge>
            </div>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Photo
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Badge variant="outline">{user.employeeId}</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{user.name}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="size-4" />
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    placeholder="+1 234-567-8900"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="size-4" />
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.address || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                    placeholder="123 Main St, City, State ZIP"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="size-4" />
                    <span>{user.address || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Your employment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <Building2 className="size-4" />
                Department
              </Label>
              <p>{user.department}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <Briefcase className="size-4" />
                Position
              </Label>
              <p>{user.position}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-4" />
                Join Date
              </Label>
              <p>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <DollarSign className="size-4" />
                Salary
              </Label>
              <p>${(user.salary || 0).toLocaleString()}/year</p>
              {!isAdmin && (
                <p className="text-xs text-gray-600">Read-only for employees</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Your uploaded documents and certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm">{doc.name}</p>
                    <p className="text-xs text-gray-600">Uploaded on {doc.uploadedOn}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => doc.url && window.open(doc.url, '_blank', 'noopener,noreferrer')}
                  disabled={!doc.url}
                >
                  View
                </Button>
              </div>
            ))}
            {isEditing && (
              <Button variant="outline" className="w-full">
                <FileText className="size-4 mr-2" />
                Upload New Document
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
