import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Church, Music, Users, Zap } from 'lucide-react';

export default function ChurchPackage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const bookingData = {
      churchName: formData.get('churchName') as string,
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      preferredDate: formData.get('preferredDate') as string,
      numberOfParticipants: formData.get('numberOfParticipants') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/church-packages/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert('Failed to submit booking request');
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
            <Church className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Church Worship Seminar & Training</h1>
            <p className="text-xl text-blue-100">
              Bring professional worship leadership and sound system training to your church musicians
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">What's Included</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive one-off workshop designed specifically for church musicians and worship teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Module 1 */}
            <Card className="p-8 border-0 shadow-subtle hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 rounded-lg p-4 mb-4 inline-block">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Module 1: Worship Leadership</h3>
              <p className="text-gray-700 mb-4">
                Learn how to lead worship in church with excellence and spiritual depth. Master the art of connecting your congregation to God through music.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Worship philosophy and purpose</li>
                <li>✓ Song selection and arrangement</li>
                <li>✓ Leading with confidence</li>
                <li>✓ Engaging your congregation</li>
              </ul>
            </Card>

            {/* Module 2 */}
            <Card className="p-8 border-0 shadow-subtle hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 rounded-lg p-4 mb-4 inline-block">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Module 2: Sound Systems</h3>
              <p className="text-gray-700 mb-4">
                Master the minimum equipment needed for professional church sound. Learn setup, mixing, and troubleshooting for optimal audio quality.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Essential equipment overview</li>
                <li>✓ Microphone techniques</li>
                <li>✓ Mixing and levels</li>
                <li>✓ Troubleshooting common issues</li>
              </ul>
            </Card>

            {/* Module 3 */}
            <Card className="p-8 border-0 shadow-subtle hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 rounded-lg p-4 mb-4 inline-block">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Module 3: Rehearsal & Songs</h3>
              <p className="text-gray-700 mb-4">
                Organize effective rehearsals and work on songs to be sung in church. Build a cohesive worship team that delivers excellence.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Rehearsal structure</li>
                <li>✓ Song arrangement</li>
                <li>✓ Team coordination</li>
                <li>✓ Performance preparation</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Pricing</h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Per Person</p>
                <div className="text-5xl font-bold text-primary mb-4">Rs 2,000</div>
                <p className="text-gray-700 mb-6">
                  One-off seminar covering all three modules with hands-on training and practical exercises
                </p>
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-primary mb-4">What You Get:</h4>
                  <ul className="space-y-3 text-left text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span>Full day workshop with Kheejoo Jenkins</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span>All three modules with practical training</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span>Hands-on sound system setup</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span>Song arrangement and rehearsal guidance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  Minimum 10 participants recommended. Flexible scheduling available.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Book Your Seminar</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below to request a date for your church's worship seminar
            </p>
          </div>

          <Card className="p-8 border-0 shadow-premium">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✓</div>
                <h4 className="text-2xl font-bold text-primary mb-2">Booking Request Received!</h4>
                <p className="text-gray-700 mb-4">
                  Thank you for your interest. We will contact you within 2 business days to confirm the date and payment details.
                </p>
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Church Name *</label>
                  <input
                    type="text"
                    name="churchName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your church name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                    <input
                      type="text"
                      placeholder="e.g., Worship Leader, Pastor"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Church Location *</label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City/Region"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Participants *</label>
                    <input
                      type="number"
                      name="numberOfParticipants"
                      required
                      min="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Minimum 10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information (Optional)</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Any special requests or additional details..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Total Cost:</strong> Rs 2,000 × Number of Participants
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Payment details will be provided upon confirmation
                  </p>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-2">
                  Submit Booking Request
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  * Required fields. We will contact you within 2 business days to confirm.
                </p>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container text-center">
          <p>&copy; 2025 King Music Academy. All rights reserved. | Professional Music Education in Mauritius</p>
        </div>
      </footer>
    </div>
  );
}
