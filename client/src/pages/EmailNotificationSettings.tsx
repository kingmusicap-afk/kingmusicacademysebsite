import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, Clock, Save, AlertCircle } from 'lucide-react';

interface NotificationSettings {
  scholarshipApprovedEnabled: boolean;
  scholarshipRejectedEnabled: boolean;
  churchBookingConfirmedEnabled: boolean;
  sponsorQuarterlyReportEnabled: boolean;
  quarterlyReportDay: number;
  quarterlyReportMonth: number;
}

export default function EmailNotificationSettings() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [settings, setSettings] = useState<NotificationSettings>({
    scholarshipApprovedEnabled: true,
    scholarshipRejectedEnabled: true,
    churchBookingConfirmedEnabled: true,
    sponsorQuarterlyReportEnabled: true,
    quarterlyReportDay: 1,
    quarterlyReportMonth: 1
  });
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'KingMusic2025') {
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
      loadSettings();
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setLoginError('');
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleDateChange = (field: 'quarterlyReportDay' | 'quarterlyReportMonth', value: number) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Email Settings</h1>
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
          <h1 className="text-3xl font-bold text-primary">Email Notification Settings</h1>
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

      <div className="container py-8 max-w-3xl">
        {/* Success Message */}
        {saveSuccess && (
          <Card className="p-4 mb-6 bg-green-50 border-l-4 border-l-green-500">
            <p className="text-green-700 font-semibold">Settings saved successfully!</p>
          </Card>
        )}

        {/* Automatic Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Automatic Notifications</h2>
          </div>

          <div className="space-y-6">
            {/* Scholarship Approved */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Scholarship Application Approved</h3>
                <p className="text-sm text-gray-600">Send automatic email when a scholarship application is approved</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.scholarshipApprovedEnabled}
                  onChange={() => handleToggle('scholarshipApprovedEnabled')}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            {/* Scholarship Rejected */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Scholarship Application Rejected</h3>
                <p className="text-sm text-gray-600">Send automatic email when a scholarship application is rejected</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.scholarshipRejectedEnabled}
                  onChange={() => handleToggle('scholarshipRejectedEnabled')}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            {/* Church Booking Confirmed */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Church Booking Confirmation</h3>
                <p className="text-sm text-gray-600">Send automatic confirmation email when a church books the package</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.churchBookingConfirmedEnabled}
                  onChange={() => handleToggle('churchBookingConfirmedEnabled')}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Quarterly Reports */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Quarterly Sponsor Reports</h2>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Send Quarterly Impact Reports</h3>
                <p className="text-sm text-gray-600">Automatically send sponsors quarterly reports about scholarship impact</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sponsorQuarterlyReportEnabled}
                  onChange={() => handleToggle('sponsorQuarterlyReportEnabled')}
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            {/* Schedule */}
            {settings.sponsorQuarterlyReportEnabled && (
              <div className="p-4 bg-blue-50 border-l-4 border-l-blue-500 rounded-lg">
                <p className="text-sm text-gray-700 mb-4">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Quarterly reports will be sent on the selected date each quarter
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Day of Month</label>
                    <select
                      value={settings.quarterlyReportDay}
                      onChange={(e) => handleDateChange('quarterlyReportDay', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Starting Month</label>
                    <select
                      value={settings.quarterlyReportMonth}
                      onChange={(e) => handleDateChange('quarterlyReportMonth', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={1}>January (Q1)</option>
                      <option value={4}>April (Q2)</option>
                      <option value={7}>July (Q3)</option>
                      <option value={10}>October (Q4)</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Reports will be sent on the {settings.quarterlyReportDay}th of January, April, July, and October.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Email Templates Preview */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Templates</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Scholarship Approved</h3>
              <p className="text-sm text-gray-600">Congratulations email sent when a scholarship is approved</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Scholarship Rejected</h3>
              <p className="text-sm text-gray-600">Notification email sent when a scholarship application is rejected</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Church Booking Confirmed</h3>
              <p className="text-sm text-gray-600">Confirmation email with booking details sent to churches</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Quarterly Sponsor Report</h3>
              <p className="text-sm text-gray-600">Impact report showing scholarship distribution and student progress</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="flex-1 bg-primary hover:bg-blue-900 text-white flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
