import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Users, CheckCircle, Clock, XCircle, Edit2, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'enrollments' | 'schedule'>('enrollments');

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
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'enrollments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Enrollments
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Schedule
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
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Button
                              onClick={() => handleEditClick(enrollment)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
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

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                {enrollments.find(e => e.id === editingId)?.firstName} {enrollments.find(e => e.id === editingId)?.lastName}
              </p>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value as 'pending' | 'paid' | 'overdue')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setEditingId(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePaymentStatus}
                disabled={updateLoading}
                className="flex-1 bg-primary hover:bg-blue-900 text-white"
              >
                {updateLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
