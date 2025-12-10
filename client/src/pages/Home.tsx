import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music, Award, Users, Sparkles, Heart, MapPin, Mail, Phone } from 'lucide-react';

export default function Home() {
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: '',
    instrument: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnrollmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to a backend
    console.log('Enrollment data:', enrollmentData);
    setSubmitted(true);
    setTimeout(() => {
      setEnrollmentData({ name: '', email: '', phone: '', instrument: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const instruments = [
    { name: 'Drum', icon: '🥁', description: 'Master rhythm and groove' },
    { name: 'Keyboard', icon: '🎹', description: 'Explore harmony and chords' },
    { name: 'Guitar', icon: '🎸', description: 'Learn strumming and fingerpicking' },
    { name: 'Bass Guitar', icon: '🎻', description: 'Feel the foundation of music' },
    { name: 'Vocal', icon: '🎤', description: 'Develop your voice and presence' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-subtle">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/images/king-logo.png" alt="King Music Academy" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-primary hidden sm:inline">King Music Academy</span>
          </div>
          <Button 
            onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary hover:bg-blue-900 text-white"
          >
            Enroll Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur">
                <span className="text-sm font-semibold">🎵 Professional Music Education</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                The Royal Standard
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Master Your Music, Magnify Your Purpose. Learn from a national icon and M.S.K. recipient with 30 years of musical mastery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold"
                  onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Your Journey
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold">30+</div>
                  <p className="text-sm text-blue-100">Years Experience</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">M.S.K.</div>
                  <p className="text-sm text-blue-100">National Honor</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">300+</div>
                  <p className="text-sm text-blue-100">Songs Written</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
              <img 
                src="/images/hero-founder.png" 
                alt="Jenkins Kheejo - King" 
                className="w-full h-auto rounded-2xl shadow-premium object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile Section */}
      <section id="founder" className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Learn from a Legend
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jenkins Kheejo, known as "King," is a decorated musician, composer, and mentor with an extraordinary legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-primary">The Master</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  With 30 years of experience as a Gospel singer, composer, and music producer, Jenkins Kheejo has shaped the sound of Mauritian music. His journey spans continents, performances, and countless lives touched through music.
                </p>
                <p>
                  In 2005, he won the prestigious "Song of the Year" award in Mauritius. In 2015, he was decorated by the President of Mauritius with the title M.S.K., recognizing his exceptional contributions to music and culture.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-premium p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Award className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-primary">National Recognition</h4>
                    <p className="text-gray-600">M.S.K. Decoration by the President of Mauritius (2015)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Music className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-primary">Creative Mastery</h4>
                    <p className="text-gray-600">Over 300 gospel songs composed and multiple audio albums</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-primary">Proven Mentorship</h4>
                    <p className="text-gray-600">Trained musicians to national and international levels</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Heart className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-primary">Spiritual Leadership</h4>
                    <p className="text-gray-600">Founder of Eglise en Adoration, inspiring worship globally</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Overview Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <img 
              src="/images/hero-stage.png" 
              alt="Annual Student Concert" 
              className="w-full h-auto rounded-2xl shadow-premium object-cover"
            />
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Our Mission & Vision
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  <strong>Mission:</strong> To provide high-quality, professional music education rooted in Christian values, making the joy and skill of playing music accessible to everyone in Mauritius.
                </p>
                <p className="text-lg">
                  <strong>Vision:</strong> To see every student confidently use their musical gifts to glorify God, serve their communities, and perform on local and international stages.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded">
                <p className="text-primary font-semibold mb-2">🎵 Christian Values</p>
                <p className="text-gray-700">
                  Every lesson is grounded in Christian values, preparing students not just for performance, but for worship and ministry. We believe music is a gift to glorify and serve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Instruments & Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your instrument and start your 6-month journey to musical mastery. Beginner and Intermediate levels available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {instruments.map((instrument) => (
              <Card key={instrument.name} className="p-6 hover:shadow-lg transition-shadow border-0">
                <div className="text-5xl mb-4">{instrument.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{instrument.name}</h3>
                <p className="text-gray-600 text-sm">{instrument.description}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-0 shadow-subtle">
              <h3 className="text-2xl font-bold text-primary mb-4">Beginner Level</h3>
              <p className="text-gray-700 mb-4">
                Perfect for those starting their musical journey. Learn fundamentals, basic techniques, and foundational music theory.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 6-month course (24 lessons)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 1 hour per lesson, 4 lessons per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Basic techniques and music theory
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Introduction to worship music
                </li>
              </ul>
              <p className="text-2xl font-bold text-primary">Rs 1,200/month</p>
            </Card>

            <Card className="p-8 border-0 shadow-subtle bg-gradient-to-br from-primary/5 to-blue-50">
              <h3 className="text-2xl font-bold text-primary mb-4">Intermediate Level</h3>
              <p className="text-gray-700 mb-4">
                For those ready to advance. Develop advanced techniques, performance skills, and leadership abilities.
              </p>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 6-month course (24 lessons)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 1 hour per lesson, 4 lessons per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Advanced techniques and improvisation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Performance and worship leadership
                </li>
              </ul>
              <p className="text-2xl font-bold text-primary">Rs 1,200/month</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Concert Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                The Annual Student Concert
              </h2>
              <p className="text-lg text-gray-700">
                The ultimate goal of every student at King Music Academy is to perform in our prestigious annual concert. This is your platform to showcase your progress, celebrate your journey, and inspire your family and community.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary">Professional Stage</h4>
                    <p className="text-gray-600">Perform on a high-quality, professional concert stage</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary">Community Celebration</h4>
                    <p className="text-gray-600">Share your talent with family, friends, and the community</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary">Worship & Service</h4>
                    <p className="text-gray-600">Celebrate the spiritual purpose of your musical journey</p>
                  </div>
                </div>
              </div>
            </div>
            <img 
              src="/images/hero-stage.png" 
              alt="Concert Stage" 
              className="w-full h-auto rounded-2xl shadow-premium object-cover"
            />
          </div>
        </div>
      </section>

      {/* Enrollment Section */}
      <section id="enrollment" className="py-20 md:py-28 bg-gradient-to-br from-primary to-blue-900 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Enroll Now
              </h2>
              <p className="text-xl text-blue-100">
                Enrollment is open for February 2026. Secure your spot before January 31st!
              </p>
            </div>

            {submitted ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8 text-center backdrop-blur">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-blue-100">
                  Your enrollment inquiry has been received. We'll contact you soon with more details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={enrollmentData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={enrollmentData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={enrollmentData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="+230 XXXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Choose Your Instrument *</label>
                  <select
                    name="instrument"
                    value={enrollmentData.instrument}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" className="text-gray-800">Select an instrument...</option>
                    <option value="drum" className="text-gray-800">Drum</option>
                    <option value="keyboard" className="text-gray-800">Keyboard</option>
                    <option value="guitar" className="text-gray-800">Guitar</option>
                    <option value="bass" className="text-gray-800">Bass Guitar</option>
                    <option value="vocal" className="text-gray-800">Vocal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={enrollmentData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tell us about your musical background or any questions..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-gray-100 font-bold text-lg"
                >
                  Submit Enrollment
                </Button>

                <p className="text-sm text-blue-100 text-center">
                  * Required fields. Enrollment deadline: January 31, 2026
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary mb-1">Location</h4>
                    <p className="text-gray-700">Goodlands, North Mauritius</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary mb-1">Email</h4>
                    <p className="text-gray-700">info@kingmusicacademy.mu</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary mb-1">Phone</h4>
                    <p className="text-gray-700">+230 XXXX XXXX</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-subtle p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Choose King Music Academy?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Learn from a national icon with 30 years of experience</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Professional, structured 6-month courses</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Christian values integrated into every lesson</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Affordable pricing: Rs 1,200/month</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Performance opportunity at the annual concert</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Music for everyone: beginner to intermediate levels</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/king-logo.png" alt="King Music Academy" className="h-8 w-8 object-contain" />
                <span className="font-bold">King Music Academy</span>
              </div>
              <p className="text-blue-100">
                Professional music education rooted in Christian values. Master Your Music, Magnify Your Purpose.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#founder" className="hover:text-white transition">About the Founder</a></li>
                <li><a href="#enrollment" className="hover:text-white transition">Enroll Now</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Instruments</h4>
              <ul className="space-y-2 text-blue-100">
                <li>Drum • Keyboard • Guitar</li>
                <li>Bass Guitar • Vocal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8 text-center text-blue-100">
            <p>&copy; 2026 King Music Academy. All rights reserved. | Goodlands, Mauritius</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
