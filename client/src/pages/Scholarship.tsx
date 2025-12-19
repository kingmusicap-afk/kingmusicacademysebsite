import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, DollarSign, Users, Award } from 'lucide-react';

export default function Scholarship() {
  const [activeTab, setActiveTab] = useState<'sponsor' | 'apply'>('sponsor');
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const sponsorData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      amount: formData.get('amount') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/scholarships/sponsor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sponsorData),
      });

      if (response.ok) {
        setSponsorSubmitted(true);
        form.reset();
        setTimeout(() => setSponsorSubmitted(false), 3000);
      } else {
        alert('Failed to submit sponsorship request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const applicationData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      age: formData.get('age') as string,
      courseInterested: formData.get('courseInterested') as string,
      financialSituation: formData.get('financialSituation') as string,
      whyNeedScholarship: formData.get('whyNeedScholarship') as string,
    };

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        setApplicationSubmitted(true);
        form.reset();
        setTimeout(() => setApplicationSubmitted(false), 3000);
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-subtle">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/images/king-logo.png" alt="King Music Academy" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-primary hidden sm:inline">King Music Academy</span>
          </div>
          <a href="/" className="text-primary hover:text-blue-900 font-semibold">Back to Home</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Scholarship & Sponsorship Program</h1>
            <p className="text-xl text-blue-100">
              Join our free scholarship program. Be a blessing to someone who can't afford to pay their fees.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('sponsor')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'sponsor'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Become a Sponsor
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'apply'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary'
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Apply for Scholarship
            </button>
          </div>
        </div>
      </section>

      {/* Sponsor Tab */}
      {activeTab === 'sponsor' && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Make a Difference</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Your sponsorship directly impacts talented students who lack financial resources. Help them pursue their musical dreams and develop their gifts.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-primary mb-1">Support Talented Students</h3>
                      <p className="text-gray-600">Help deserving musicians access professional training</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <DollarSign className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-primary mb-1">Flexible Contributions</h3>
                      <p className="text-gray-600">Sponsor any amount - every contribution matters</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-primary mb-1">Quarterly Updates</h3>
                      <p className="text-gray-600">Receive updates on scholarship impact every quarter</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-8 border-0 shadow-premium bg-gradient-to-br from-blue-50 to-blue-100">
                <h3 className="text-2xl font-bold text-primary mb-6">Sponsor Information</h3>
                {sponsorSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">✓</div>
                    <h4 className="text-2xl font-bold text-primary mb-2">Thank You!</h4>
                    <p className="text-gray-700">
                      Your sponsorship request has been received. You will be redirected to the payment page shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSponsorSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+230 XXXX XXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sponsorship Amount (Rs) *</label>
                      <input
                        type="number"
                        name="amount"
                        required
                        min="500"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                      <textarea
                        name="message"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Tell us why you want to sponsor..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-2">
                      Continue to Payment
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      * Required fields. You will receive quarterly updates on scholarship impact.
                    </p>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Apply Tab */}
      {activeTab === 'apply' && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Apply for Scholarship</h2>
              <p className="text-lg text-gray-600">
                If you're passionate about music but facing financial challenges, apply for our scholarship program.
              </p>
            </div>

            <Card className="p-8 border-0 shadow-premium">
              {applicationSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✓</div>
                  <h4 className="text-2xl font-bold text-primary mb-2">Application Received!</h4>
                  <p className="text-gray-700">
                    Thank you for applying. We will review your application and contact you within 5 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+230 XXXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="5"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Interested In *</label>
                    <select
                      name="courseInterested"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a course...</option>
                      <option value="Piano">Piano</option>
                      <option value="Guitar">Guitar</option>
                      <option value="Vocal">Vocal</option>
                      <option value="Drums">Drums</option>
                      <option value="Bass Guitar">Bass Guitar</option>
                      <option value="Media Production">Media Production</option>
                      <option value="Audio Engineering">Audio Engineering</option>
                      <option value="Songwriting">Songwriting & Composition</option>
                      <option value="Worship Leadership">Worship Leadership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Financial Situation *</label>
                    <select
                      name="financialSituation"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select...</option>
                      <option value="Cannot afford any fees">Cannot afford any fees</option>
                      <option value="Can afford partial fees">Can afford partial fees</option>
                      <option value="Temporary financial difficulty">Temporary financial difficulty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you need this scholarship? *</label>
                    <textarea
                      name="whyNeedScholarship"
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Tell us about your passion for music and why you need financial support..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-2">
                    Submit Application
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    * Required fields. We will review your application and contact you within 5 business days.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container text-center">
          <p>&copy; 2025 King Music Academy. All rights reserved. | Professional Music Education in Mauritius</p>
        </div>
      </footer>
    </div>
  );
}
