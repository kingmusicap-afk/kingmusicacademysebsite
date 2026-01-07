import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Users, CheckCircle, Clock, XCircle, Edit2, X, Trash2 } from 'lucide-react';

interface Enrollment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: number;
  location: string;
  courseType: string;
  specificCourse: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingStatus, setEditingStatus] = useState<'pending' | 'paid' | 'overdue'>('pending');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'enrollments' | 'schedule' | 'attendance' | 'capacity' | 'reminders'>('enrollments');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Simple authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this should be a proper backend authentication
    if (password === 'KingMusic2025') {
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Invalid password');
    }
  };

  // Fetch enrollments
  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/enrollments');
      if (response.ok) {
        const data = await response.json();
        // Transform data to include payment status
        const enrollmentsWithStatus = data.map((enrollment: any) => ({
          ...enrollment,
          paymentStatus: calculatePaymentStatus(enrollment.createdAt)
        }));
        setEnrollments(enrollmentsWithStatus);
        setFilteredEnrollments(enrollmentsWithStatus);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentStatus = (createdAt: string): 'pending' | 'paid' | 'overdue' => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      return 'overdue';
    } else if (hoursDiff > 0) {
      return 'pending';
    }
    return 'pending';
  };

  const handleEditClick = (enrollment: Enrollment) => {
    setEditingId(enrollment.id);
    setEditingStatus(enrollment.paymentStatus);
  };

  const handleUpdatePaymentStatus = async () => {
    if (editingId === null) return;

    try {
      setUpdateLoading(true);
      const response = await fetch(`/api/enrollments/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: editingStatus,
        }),
      });

      if (response.ok) {
        const updatedEnrollments = enrollments.map(e =>
          e.id === editingId ? { ...e, paymentStatus: editingStatus } : e
        );
        setEnrollments(updatedEnrollments);
        setEditingId(null);
      } else {
        alert('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete enrollment
  const handleDeleteEnrollment = async (enrollmentId: number) => {
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedEnrollments = enrollments.filter(e => e.id !== enrollmentId);
        setEnrollments(updatedEnrollments);
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete enrollment');
      }
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      alert('Error deleting enrollment');
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = enrollments;

    if (filterCourse !== 'all') {
      filtered = filtered.filter(e => e.courseType === filterCourse);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(e => e.location === filterLocation);
    }

    if (filterPayment !== 'all') {
      filtered = filtered.filter(e => e.paymentStatus === filterPayment);
    }

    setFilteredEnrollments(filtered);
  }, [filterCourse, filterLocation, filterPayment, enrollments]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-0 shadow-2xl">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Admin Dashboard</h1>
          <p className="text-gray-600 text-center mb-6">King Music Academy</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
                autoFocus
              />
              {loginError && (
                <p className="text-red-600 text-sm mt-2">{loginError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-2"
            >
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const stats = {
    total: enrollments.length,
    paid: enrollments.filter(e => e.paymentStatus === 'paid').length,
    pending: enrollments.filter(e => e.paymentStatus === 'pending').length,
    overdue: enrollments.filter(e => e.paymentStatus === 'overdue').length,
  };

  const courses = Array.from(new Set(enrollments.map(e => e.courseType)));
  const locations = Array.from(new Set(enrollments.map(e => e.location)));

  const scheduleData = [
    { day: 'Tuesday', location: 'Goodlands', times: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
    { day: 'Wednesday', location: 'Quatre Bornes', times: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
    { day: 'Thursday', location: 'Flacq', times: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
    { day: 'Friday', location: 'Quatre Bornes', times: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'] },
  ];

  const getStudentsForSchedule = (day: string, location: string) => {
    return enrollments.filter(e => e.location === location && e.courseType === 'Instruments');
  };

  const getStudentsForSpecializedCourse = (course: string) => {
    return enrollments.filter(e => e.specificCourse === course);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-0 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Paid</p>
                <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-200" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'enrollments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Enrollments
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'capacity'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Class Capacity
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reminders'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Reminders
          </button>
        </div>

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <>
            {/* Filters */}
            <Card className="p-6 border-0 shadow-subtle mb-8">
              <h2 className="text-lg font-bold text-primary mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Type
                  </label>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Courses</option>
                    {courses.filter(Boolean).map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Locations</option>
                    {locations.filter(Boolean).map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Enrollments Table */}
            <Card className="border-0 shadow-subtle overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">Loading enrollments...</p>
                </div>
              ) : filteredEnrollments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No enrollments found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEnrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {enrollment.firstName} {enrollment.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.age || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.specificCourse}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{enrollment.location}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enrollment.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : enrollment.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {enrollment.paymentStatus.charAt(0).toUpperCase() + enrollment.paymentStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {enrollment.createdAt && !isNaN(new Date(enrollment.createdAt).getTime())
                              ? new Date(enrollment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleEditClick(enrollment)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </Button>
                              {deleteConfirm === enrollment.id ? (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-2"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    onClick={() => setDeleteConfirm(null)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => setDeleteConfirm(enrollment.id)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Summary */}
            <div className="mt-8 text-center text-gray-600">
              <p>Showing {filteredEnrollments.length} of {enrollments.length} enrollments</p>
            </div>
          </>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Instrument Courses Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scheduleData.map((schedule) => (
                <Card key={`${schedule.day}-${schedule.location}`} className="p-6 border-0 shadow-subtle">
                  <h3 className="text-lg font-bold text-primary mb-4">{schedule.day} - {schedule.location}</h3>
                  <div className="space-y-3">
                    {schedule.times.map(time => {
                      const students = getStudentsForSchedule(schedule.day, schedule.location);
                      return (
                        <div key={time} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="font-semibold text-gray-900">{time}</p>
                          {students.length > 0 ? (
                            <ul className="text-sm text-gray-600 mt-2 space-y-1">
                              {students.map(s => (
                                <li key={s.id}>• {s.firstName} {s.lastName} - {s.specificCourse}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400 mt-2">No students scheduled</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* Thursday Evening Specialized Courses */}
            <Card className="p-6 border-0 shadow-subtle">
              <h3 className="text-lg font-bold text-primary mb-4">Thursday 7:00 PM - Specialized Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Media Production', 'Audio Engineering', 'Songwriting Workshop', 'Worship Leadership'].map(course => {
                  const students = getStudentsForSpecializedCourse(course);
                  return (
                    <div key={course} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <p className="font-semibold text-gray-900 mb-3">{course}</p>
                      {students.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {students.map(s => (
                            <li key={s.id}>• {s.firstName} {s.lastName}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">No students enrolled</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">Attendance Tracking</h2>
                <a href="/api/attendance/report/all" download>
                  <Button className="bg-primary hover:bg-blue-900 text-white">
                    Download Report
                  </Button>
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-4">Mark student attendance and download comprehensive attendance reports.</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Features:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>✓ Mark attendance for each class session</li>
                  <li>✓ Track attendance by date and student</li>
                  <li>✓ Download CSV attendance reports</li>
                  <li>✓ Add notes for missed classes</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Capacity Tab */}
        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-subtle">
              <h2 className="text-lg font-bold text-primary mb-4">Class Capacity Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Current Configuration</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Default capacity: 10 students per class</li>
                    <li>• Locations: Goodlands, Quatre Bornes, Flacq</li>
                    <li>• Time slots: 2:00 PM - 5:00 PM</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Features</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Set maximum capacity per class</li>
                    <li>✓ Display "Full" status when capacity reached</li>
                    <li>✓ Manage enrollment limits by location</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">Class Reminders Management</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      fetch('/api/reminders/create-batch', { method: 'POST' })
                        .then(r => r.json())
                        .then(d => alert(`Created ${d.created} reminders`))
                        .catch(e => alert('Error creating reminders'));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Batch
                  </Button>
                  <Button
                    onClick={() => {
                      fetch('/api/reminders/send-pending', { method: 'POST' })
                        .then(r => r.json())
                        .then(d => alert(`Sent ${d.emailsSent} emails, ${d.whatsappsSent} WhatsApp messages`))
                        .catch(e => alert('Error sending reminders'));
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Send Pending
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Email Reminders</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Automated 24-hour email reminders</li>
                    <li>✓ Course and location details included</li>
                    <li>✓ Contact information provided</li>
                    <li>✓ Professional HTML templates</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">WhatsApp Reminders</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Automated 24-hour WhatsApp messages</li>
                    <li>✓ Friendly emoji-enhanced messages</li>
                    <li>✓ Direct contact information</li>
                    <li>✓ Reduces class no-shows</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 border-0 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">Update Payment Status</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as 'pending' | 'paid' | 'overdue')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleUpdatePaymentStatus}
                  disabled={updateLoading}
                  className="flex-1 bg-primary hover:bg-blue-900 text-white"
                >
                  {updateLoading ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
