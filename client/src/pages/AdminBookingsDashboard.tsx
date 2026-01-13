import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Search, Filter, Mail, Eye, CheckCircle, Clock, XCircle, MessageSquare, Download } from 'lucide-react';

interface ScholarshipApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  courseInterested: string;
  financialSituation: string;
  whyNeedScholarship: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  notes?: string;
}

interface ChurchBooking {
  id: number;
  churchName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  preferredDate: string;
  numberOfParticipants: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  notes?: string;
}

type TabType = 'scholarships' | 'church-bookings';

export default function AdminBookingsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('scholarships');
  
  // Scholarship state
  const [scholarships, setScholarships] = useState<ScholarshipApplication[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<ScholarshipApplication[]>([]);
  const [scholarshipSearch, setScholarshipSearch] = useState('');
  const [scholarshipStatusFilter, setScholarshipStatusFilter] = useState<string>('all');
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipApplication | null>(null);
  const [scholarshipNotes, setScholarshipNotes] = useState('');
  
  // Church booking state
  const [churchBookings, setChurchBookings] = useState<ChurchBooking[]>([]);
  const [filteredChurchBookings, setFilteredChurchBookings] = useState<ChurchBooking[]>([]);
  const [churchSearch, setChurchSearch] = useState('');
  const [churchStatusFilter, setChurchStatusFilter] = useState<string>('all');
  const [selectedChurchBooking, setSelectedChurchBooking] = useState<ChurchBooking | null>(null);
  const [churchNotes, setChurchNotes] = useState('');
  
  // General state
  const [loading, setLoading] = useState(false);

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Louanges7&') {
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
      loadData();
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      // Load scholarships
      const scholarshipRes = await fetch('/api/scholarships/applications');
      if (scholarshipRes.ok) {
        const data = await scholarshipRes.json();
        setScholarships(data);
        setFilteredScholarships(data);
      }

      // Load church bookings
      const churchRes = await fetch('/api/church-packages/bookings');
      if (churchRes.ok) {
        const data = await churchRes.json();
        setChurchBookings(data);
        setFilteredChurchBookings(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter scholarships
  useEffect(() => {
    let filtered = scholarships;

    if (scholarshipSearch) {
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
        s.lastName.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(scholarshipSearch.toLowerCase())
      );
    }

    if (scholarshipStatusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === scholarshipStatusFilter);
    }

    setFilteredScholarships(filtered);
  }, [scholarshipSearch, scholarshipStatusFilter, scholarships]);

  // Filter church bookings
  useEffect(() => {
    let filtered = churchBookings;

    if (churchSearch) {
      filtered = filtered.filter(c =>
        c.churchName.toLowerCase().includes(churchSearch.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(churchSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(churchSearch.toLowerCase())
      );
    }

    if (churchStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === churchStatusFilter);
    }

    setFilteredChurchBookings(filtered);
  }, [churchSearch, churchStatusFilter, churchBookings]);

  // Update scholarship status
  const updateScholarshipStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/scholarships/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: scholarshipNotes })
      });

      if (response.ok) {
        setScholarships(scholarships.map(s =>
          s.id === id ? { ...s, status: newStatus as any, notes: scholarshipNotes } : s
        ));
        setSelectedScholarship(null);
        setScholarshipNotes('');
      }
    } catch (error) {
      console.error('Error updating scholarship:', error);
    }
  };

  // Update church booking status
  const updateChurchBookingStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/church-packages/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: churchNotes })
      });

      if (response.ok) {
        setChurchBookings(churchBookings.map(c =>
          c.id === id ? { ...c, status: newStatus as any, notes: churchNotes } : c
        ));
        setSelectedChurchBooking(null);
        setChurchNotes('');
      }
    } catch (error) {
      console.error('Error updating church booking:', error);
    }
  };

  // Send email
  const sendEmail = async (type: 'scholarship' | 'church', id: number, email: string, subject: string, message: string) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message })
      });

      if (response.ok) {
        alert('Email sent successfully!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Admin Dashboard</h1>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-subtle">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container flex gap-8">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'scholarships'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-primary'
            }`}
          >
            Scholarship Applications ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveTab('church-bookings')}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'church-bookings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-primary'
            }`}
          >
            Church Package Bookings ({churchBookings.length})
          </button>
        </div>
      </div>

      <div className="container py-8">
        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={scholarshipSearch}
                      onChange={(e) => setScholarshipSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={scholarshipStatusFilter}
                    onChange={(e) => setScholarshipStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-primary hover:bg-blue-900 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Course</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScholarships.map((app) => (
                      <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{app.firstName} {app.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.courseInterested}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            onClick={() => {
                              setSelectedScholarship(app);
                              setScholarshipNotes(app.notes || '');
                            }}
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-primary/5"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Church Bookings Tab */}
        {activeTab === 'church-bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={churchSearch}
                      onChange={(e) => setChurchSearch(e.target.value)}
                      placeholder="Search by church or contact..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={churchStatusFilter}
                    onChange={(e) => setChurchStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-primary hover:bg-blue-900 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Church Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Participants</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChurchBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{booking.churchName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.contactPerson}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.numberOfParticipants}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            onClick={() => {
                              setSelectedChurchBooking(booking);
                              setChurchNotes(booking.notes || '');
                            }}
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary hover:bg-primary/5"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Scholarship Detail Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Application Details</h2>
                <button onClick={() => setSelectedScholarship(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">First Name</p>
                  <p className="font-semibold">{selectedScholarship.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Name</p>
                  <p className="font-semibold">{selectedScholarship.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedScholarship.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedScholarship.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{selectedScholarship.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course Interested</p>
                  <p className="font-semibold">{selectedScholarship.courseInterested}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Financial Situation</p>
                <p className="font-semibold">{selectedScholarship.financialSituation}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Why They Need Scholarship</p>
                <p className="text-gray-700">{selectedScholarship.whyNeedScholarship}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Internal Notes</p>
                <textarea
                  value={scholarshipNotes}
                  onChange={(e) => setScholarshipNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => updateScholarshipStatus(selectedScholarship.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateScholarshipStatus(selectedScholarship.id, 'rejected')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => sendEmail('scholarship', selectedScholarship.id, selectedScholarship.email, 'Scholarship Application Update', 'Your application has been reviewed.')}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Church Booking Detail Modal */}
      {selectedChurchBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary">Booking Details</h2>
                <button onClick={() => setSelectedChurchBooking(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Church Name</p>
                  <p className="font-semibold">{selectedChurchBooking.churchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-semibold">{selectedChurchBooking.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedChurchBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedChurchBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{selectedChurchBooking.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preferred Date</p>
                  <p className="font-semibold">{new Date(selectedChurchBooking.preferredDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number of Participants</p>
                  <p className="font-semibold">{selectedChurchBooking.numberOfParticipants}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="font-semibold">Rs {selectedChurchBooking.numberOfParticipants * 2000}</p>
                </div>
              </div>

              {selectedChurchBooking.message && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-700">{selectedChurchBooking.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-2">Internal Notes</p>
                <textarea
                  value={churchNotes}
                  onChange={(e) => setChurchNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => updateChurchBookingStatus(selectedChurchBooking.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateChurchBookingStatus(selectedChurchBooking.id, 'rejected')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => sendEmail('church', selectedChurchBooking.id, selectedChurchBooking.email, 'Church Package Booking Update', 'Your booking has been reviewed.')}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
