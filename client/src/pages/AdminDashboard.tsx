import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Enrollment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
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
      </div>
    </div>
  );
}
