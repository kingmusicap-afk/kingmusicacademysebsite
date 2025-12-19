import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, TrendingUp, Users, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  totalScholarships: number;
  totalSponsors: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalChurchBookings: number;
  approvedBookings: number;
  completedBookings: number;
  totalRevenue: number;
  upcomingBookings: Array<{
    id: number;
    churchName: string;
    date: string;
    participants: number;
  }>;
  approvalRate: number;
  avgParticipantsPerBooking: number;
}

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'KingMusic2025') {
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
      loadAnalytics();
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Analytics Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
              />
            </div>
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-blue-900 text-white">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-subtle">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Scholarships Card */}
          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Scholarships</p>
                <p className="text-4xl font-bold text-gray-900">{analytics.totalScholarships}</p>
                <p className="text-gray-500 text-xs mt-2">{analytics.totalSponsors} sponsors</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Revenue Card */}
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900">Rs {analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-2">From church packages</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Approval Rate Card */}
          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Approval Rate</p>
                <p className="text-4xl font-bold text-gray-900">{analytics.approvalRate}%</p>
                <p className="text-gray-500 text-xs mt-2">Scholarship applications</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          {/* Church Bookings Card */}
          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Church Bookings</p>
                <p className="text-4xl font-bold text-gray-900">{analytics.totalChurchBookings}</p>
                <p className="text-gray-500 text-xs mt-2">{analytics.approvedBookings} approved</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Applications Status */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Scholarship Applications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Approved</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.approvedApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-700">Pending</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.pendingApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">Rejected</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.rejectedApplications}</span>
              </div>
            </div>
          </Card>

          {/* Bookings Status */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Church Package Bookings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Approved</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.approvedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Completed</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.completedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Avg Participants</span>
                </div>
                <span className="font-bold text-gray-900">{analytics.avgParticipantsPerBooking}</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Revenue per Booking</p>
                <p className="text-2xl font-bold text-primary">
                  Rs {analytics.totalChurchBookings > 0 ? (analytics.totalRevenue / analytics.totalChurchBookings).toLocaleString() : 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Participants Trained</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.upcomingBookings.reduce((sum, b) => sum + b.participants, 0) + (analytics.avgParticipantsPerBooking * analytics.completedBookings)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Pending Applications</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.pendingApplications}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Bookings Calendar */}
        <Card className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Church Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Church Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Participants</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.upcomingBookings.length > 0 ? (
                  analytics.upcomingBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{booking.churchName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.participants}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        Rs {(booking.participants * 2000).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No upcoming bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Section */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 border-2 border-primary/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Scholarship Program</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                You have successfully awarded <strong>{analytics.totalScholarships}</strong> scholarships to deserving students through <strong>{analytics.totalSponsors}</strong> generous sponsors. With an approval rate of <strong>{analytics.approvalRate}%</strong>, the program continues to make a meaningful impact on students' lives.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Church Training Program</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your church package has generated <strong>Rs {analytics.totalRevenue.toLocaleString()}</strong> in revenue from <strong>{analytics.totalChurchBookings}</strong> bookings. You've trained <strong>{analytics.avgParticipantsPerBooking * analytics.completedBookings}</strong> church musicians with <strong>{analytics.approvedBookings}</strong> approved upcoming sessions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
