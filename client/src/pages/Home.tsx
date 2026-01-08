import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music, Award, Users, Sparkles, Heart, MapPin, Mail, Phone, Share2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('instruments');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form element and read values directly from DOM
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const age = formData.get('age') as string;
    const courseCategory = formData.get('courseCategory') as string;
    const courseName = formData.get('courseName') as string;
    const location = formData.get('location') as string;
    const classDay = formData.get('classDay') as string;
    const classTime = formData.get('classTime') as string;
    const message = formData.get('message') as string;
    
    console.log('Form submitted with data:', { name, email, phone, age, courseCategory, courseName, location, classDay, classTime, message });
    
    // Validate required fields
    if (!name || !email || !phone || !age || !courseCategory || !courseName || !location || !classDay || !classTime) {
      console.log('Validation failed. Missing fields:', {
        name: !name,
        email: !email,
        phone: !phone,
        age: !age,
        courseCategory: !courseCategory,
        courseName: !courseName,
        location: !location,
        classDay: !classDay,
        classTime: !classTime
      });
      alert('Please fill in all required fields');
      return;
    }
    
    // Extract first and last name from the name field
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;
    
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          age: parseInt(age),
          location,
          courseType: courseCategory,
          courseLevel: 'Beginner',
          specificCourse: courseName,
          classDay,
          classTime,
          startDate: new Date().toISOString().split('T')[0],
          notes: message,
        }),
      });
      
      if (response.ok) {
        console.log('Enrollment submitted successfully');
        setSubmitted(true);
        // Reset form
        form.reset();
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        console.error('Enrollment submission failed:', response.statusText);
        const errorData = await response.json().catch(() => ({}));
        alert('Failed to submit enrollment: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('An error occurred while submitting your enrollment. Please try again.');
    }
  };

  // Fetch available slots when location and course are selected
  const handleLocationChange = async (location: string, courseType: string) => {
    setSelectedLocation(location);
    if (location && courseType) {
      setLoadingSlots(true);
      try {
        const encodedLocation = encodeURIComponent(location);
        const encodedCourse = encodeURIComponent(courseType);
        const response = await fetch(`/api/enrollments/available-slots/${encodedLocation}/${encodedCourse}`);
        if (response.ok) {
          const slots = await response.json();
          setAvailableSlots(slots.filter((s: any) => s.isAvailable));
        }
      } catch (error) {
        console.error('Error fetching available slots:', error);
      } finally {
        setLoadingSlots(false);
      }
    }
  };

  const instruments = [
    { name: 'Drum', icon: '🥁', description: 'Master rhythm and groove. Learn by ear and chord charts.' },
    { name: 'Keyboard', icon: '🎹', description: 'Explore harmony and chords. Learn by ear and chord charts.' },
    { name: 'Guitar', icon: '🎸', description: 'Learn strumming and fingerpicking. Learn by ear and chord charts.' },
    { name: 'Bass Guitar', icon: '🎻', description: 'Feel the foundation of music. Learn by ear and chord charts.' },
    { name: 'Vocal', icon: '🎤', description: 'Develop your voice and presence. Learn solfège and music theory.' }
  ];

  const locations = [
    { region: 'North', city: 'Goodlands' },
    { region: 'East', city: 'Flacq' },
    { region: 'Center', city: 'Quatre Bornes' }
  ];

  const courseCategories = {
    instruments: {
      title: 'Instrument & Vocal',
      price: 'Rs 1,200/month',
      duration: '12 Months',
      description: 'Professional instrument training for all levels (Total: Rs 14,400)',
      courses: instruments
    },
    media: {
      title: 'Media Production Course',
      price: 'Rs 2,500/month',
      duration: '3 Months',
      description: 'Master professional video production and streaming (Total: Rs 7,500)',
      modules: [
        {
          title: 'Camera Fundamentals & Pre-Production',
          topics: [
            'Camera settings: ISO, aperture, shutter speed',
            'Exposure triangle and perfect exposure techniques',
            'Composition: rule of thirds, leading lines, framing',
            'White balance and color temperature',
            'Autofocus and manual focus techniques',
            'Camera movement: pans, tilts, dolly shots',
            'Pre-production: shot lists, storyboarding, location scouting',
            'Audio recording basics and microphone types',
            'Camera maintenance and troubleshooting'
          ]
        },
        {
          title: 'Lighting Setup & Techniques',
          topics: [
            'Three-point lighting: key, fill, and back light',
            'Lighting setups for interviews and music performances',
            'Natural light photography and available light',
            'Artificial lighting: LED panels, softboxes, reflectors',
            'Color temperature and matching across scenes',
            'Advanced techniques: rim lighting and creative setups',
            'Lighting for different skin tones',
            'Budget-friendly lighting solutions',
            'Safety and electrical considerations'
          ]
        },
        {
          title: 'Editing & Color Grading',
          topics: [
            'Professional editing software: DaVinci Resolve, Premiere Pro',
            'Editing principles: pacing, rhythm, and storytelling',
            'Different editing styles: narrative, documentary, music videos',
            'Color correction: exposure, contrast, saturation',
            'Advanced color grading: LUTs and creative looks',
            'Audio editing and mixing: levels, EQ, compression',
            'Motion graphics and text animation basics',
            'Transitions and effects best practices',
            'Exporting for YouTube, Instagram, TikTok, broadcast'
          ]
        },
        {
          title: 'Streaming & Professional Delivery',
          topics: [
            'Live streaming setup: OBS, Streamlabs, professional platforms',
            'Streaming for music performances and worship services',
            'Multi-camera streaming and switching techniques',
            'Stream optimization: bitrate, resolution, encoding',
            'Platform-specific requirements: YouTube, Facebook, Twitch',
            'Professional delivery formats: broadcast, cinema, web',
            'Compression and codec selection',
            'Copyright and licensing for music in videos',
            'Portfolio building and monetization strategies'
          ]
        }
      ]
    },
    audio: {
      title: 'Audio Engineering Course',
      price: 'Rs 2,500/month',
      duration: '3 Months',
      description: 'Professional audio production and live sound (Total: Rs 7,500)',
      modules: [
        'Professional Sound System Equipment',
        'Live Mixing Techniques',
        'Studio Recording, Mixing & Mastering',
        'Audio Setup for Streaming'
      ]
    },
    songwriting: {
      title: 'Songwriting & Composition Workshop',
      price: 'Rs 2,500',
      duration: '2 Hours',
      description: 'Transform your inspiration into professional songs (One-time workshop)',
      modules: [
        'Song Concept & Inspiration',
        'Lyric Writing',
        'Melody & Harmony Development'
      ]
    },
    worship: {
      title: 'Worship Leadership Course',
      price: 'Rs 5,000',
      duration: '1 Month',
      description: 'Lead worship with purpose and excellence (Intensive one-month program)',
      modules: [
        'How to Lead Worship in Church',
        'Organizing & Running Rehearsals',
        'Essentials of Praise & Worship',
        'Purpose of Music in Church'
      ]
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
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="hidden md:inline-flex text-primary border-primary hover:bg-primary/5"
            >
              Our Courses
            </Button>
            <Button 
              onClick={() => window.location.href = '/scholarship'}
              variant="outline"
              className="hidden md:inline-flex text-primary border-primary hover:bg-primary/5"
            >
              Scholarship
            </Button>
            <Button 
              onClick={() => window.location.href = '/church-package'}
              variant="outline"
              className="hidden md:inline-flex text-primary border-primary hover:bg-primary/5"
            >
              Church Package
            </Button>
            <Button 
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="hidden md:inline-flex text-primary border-primary hover:bg-primary/5"
            >
              Contact Us
            </Button>
            <Button 
              onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Enroll Now
            </Button>
          </div>
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
                  onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-primary hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.querySelector('[href="#about"]')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <img 
                src="/images/king-hero.png" 
                alt="Kheejoo Jenkins performing" 
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">M.S.K.</div>
              <div className="text-blue-100">National Honor</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">300+</div>
              <div className="text-blue-100">Songs Written</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Founder Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Learn from a Legend</h2>
            
            <p className="text-lg text-gray-700 mb-6">
              Kheejoo Jenkins (King) is a decorated musician, composer, and mentor with an extraordinary legacy. President and Founder of Eglise en Adoration, CEO and Founder of Great Communications Ltd.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold text-primary mb-6">The Master</h3>
              <p className="text-gray-700 mb-4">
                With 30 years of experience as a Gospel singer, composer, and music producer, Jenkins Kheejoo has shaped the sound of Mauritian music. His journey spans continents, performances, and countless lives touched through music.
              </p>
              <p className="text-gray-700">
                In 2005, he won the prestigious "Song of the Year" award in Mauritius. In 2015, he was decorated by the President of Mauritius with the title M.S.K., recognizing his exceptional contributions to music and culture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Award className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary mb-2">National Recognition</h4>
                  <p className="text-gray-600">M.S.K. Decoration by the President of Mauritius (2015)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Music className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Creative Mastery</h4>
                  <p className="text-gray-600">Over 300 gospel songs composed and multiple audio albums</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Proven Mentorship</h4>
                  <p className="text-gray-600">Trained musicians to national and international levels</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Spiritual Leadership</h4>
                  <p className="text-gray-600">President and Founder of Eglise en Adoration, inspiring worship globally</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sparkles className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-primary mb-2">Business Leadership</h4>
                  <p className="text-gray-600">CEO and Founder of Great Communications Ltd</p>
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
              src="/images/king-mission.jpg" 
              alt="Kheejoo Jenkins performing on drums" 
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
                  Every lesson is grounded in Christian values, preparing students not just for performance, but for worship and ministry. We believe music is a gift to glorify and serve God.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Classes Across Mauritius
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              King Music Academy is expanding across the island. Find a location near you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((location) => (
              <Card key={location.region} className="p-8 border-0 shadow-subtle hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-accent" />
                  <h3 className="text-2xl font-bold text-primary">{location.region}</h3>
                </div>
                <p className="text-lg text-gray-700 font-semibold">{location.city}</p>
                <p className="text-gray-600 mt-2">Professional music education in your region</p>
                <Button 
                  className="mt-6 w-full bg-primary hover:bg-blue-900 text-white"
                  onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Enroll in {location.region}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Comprehensive Course Offerings
            </h2>
            <p className="text-lg text-gray-600">
              From instrument mastery to professional production and worship leadership. All courses are 12 months long.
            </p>
          </div>

          {/* Course Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {Object.entries(courseCategories).map(([key, value]) => {
              // Hide tabs for courses not yet released
              if (['media', 'audio', 'songwriting', 'worship'].includes(key)) {
                return null;
              }
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === key
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {key === 'instruments' && '🎸 Instruments'}
                  {key === 'media' && '📹 Media Production'}
                  {key === 'audio' && '🎧 Audio Engineering'}
                  {key === 'songwriting' && '✍️ Songwriting'}
                  {key === 'worship' && '🙏 Worship Leadership'}
                </button>
              );
            })}
          </div>

          {/* Instruments Tab */}
          {activeTab === 'instruments' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {instruments.map((instrument) => (
                  <Card key={instrument.name} className="p-6 hover:shadow-lg transition-shadow border-0">
                    <div className="text-5xl mb-4">{instrument.icon}</div>
                    <h3 className="text-xl font-bold text-primary mb-2">{instrument.name}</h3>
                    <p className="text-gray-600 text-sm">{instrument.description}</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-0 shadow-subtle">
                  <h3 className="text-2xl font-bold text-primary mb-4">Beginner Level</h3>
                  <p className="text-gray-700 mb-4">
                    Perfect for those starting their musical journey. Learn fundamentals, basic techniques, and foundational music theory.
                  </p>
                  <ul className="space-y-2 text-gray-700 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-accent">✓</span> 12-month course (48 lessons)
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
                      <span className="text-accent">✓</span> 12-month course (48 lessons)
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
          )}

          {/* Media Production Tab - HIDDEN FOR LATER RELEASE */}
          {activeTab === 'media' && false && (
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-subtle bg-gradient-to-br from-primary/5 to-blue-50">
                <h3 className="text-3xl font-bold text-primary mb-2">Media Production Course</h3>
                <p className="text-gray-700 mb-8">Master professional video production, cinematography, editing, and streaming.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {(courseCategories.media.modules as any[]).map((module, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-primary mb-3 text-lg">Module {idx + 1}: {module.title}</h4>
                      <ul className="space-y-2">
                        {module.topics.map((topic: string, topicIdx: number) => (
                          <li key={topicIdx} className="flex gap-2 text-gray-700 text-sm">
                            <span className="text-accent font-bold">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Duration: {courseCategories.media.duration}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{courseCategories.media.price}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-blue-900 text-white"
                    onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Audio Engineering Tab - HIDDEN FOR LATER RELEASE */}
          {activeTab === 'audio' && false && (
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-subtle bg-gradient-to-br from-primary/5 to-blue-50">
                <h3 className="text-3xl font-bold text-primary mb-2">Audio Engineering Course</h3>
                <p className="text-gray-700 mb-6">Professional audio production, live sound engineering, and streaming audio setup.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {courseCategories.audio.modules.map((module, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-primary mb-2">Module {idx + 1}</h4>
                      <p className="text-gray-700">{module}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Duration: {courseCategories.audio.duration}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{courseCategories.audio.price}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-blue-900 text-white"
                    onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Songwriting Tab - HIDDEN FOR LATER RELEASE */}
          {activeTab === 'songwriting' && false && (
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-subtle bg-gradient-to-br from-primary/5 to-blue-50">
                <h3 className="text-3xl font-bold text-primary mb-2">Songwriting & Composition Course</h3>
                <p className="text-gray-700 mb-6">Transform your inspiration and lyrics into professional, publishable songs. Learn from a composer with 300+ songs.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {courseCategories.songwriting.modules.map((module, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-primary mb-2">Module {idx + 1}</h4>
                      <p className="text-gray-700">{module}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Duration: {courseCategories.songwriting.duration}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{courseCategories.songwriting.price}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-blue-900 text-white"
                    onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Worship Leadership Tab - HIDDEN FOR LATER RELEASE */}
          {activeTab === 'worship' && false && (
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-subtle bg-gradient-to-br from-primary/5 to-blue-50">
                <h3 className="text-3xl font-bold text-primary mb-2">Worship Leadership Course</h3>
                <p className="text-gray-700 mb-6">Lead worship with excellence and purpose. Learn from a leading worshiper inspiring churches globally.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {courseCategories.worship.modules.map((module, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="font-bold text-primary mb-2">Module {idx + 1}</h4>
                      <p className="text-gray-700">{module}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Duration: {courseCategories.worship.duration}</p>
                    <p className="text-3xl font-bold text-primary mt-2">{courseCategories.worship.price}</p>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-blue-900 text-white"
                    onClick={() => document.getElementById('enrollment')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Concert Section */}
      <section className="py-20 md:py-28 bg-gray-50">
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
              src="/images/concert-2024.jpg" 
              alt="Students performing at annual concert" 
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
              <form ref={formRef} onSubmit={handleSubmit} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
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
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="+230 XXXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Course Category *</label>
                  <select
                    name="courseCategory"
                    required
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      handleLocationChange(selectedLocation, e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select a course category...</option>
                    <option value="Instrument & Vocal">Instrument & Vocal</option>
                    <option value="Media Production">Media Production</option>
                    <option value="Audio Engineering">Audio Engineering</option>
                    <option value="Songwriting & Composition">Songwriting & Composition</option>
                    <option value="Worship Leadership">Worship Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Specific Course/Instrument *</label>
                  <input
                    type="text"
                    name="courseName"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="e.g., Guitar, Media Production, Worship Leadership..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="5"
                    max="120"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Preferred Location *</label>
                  <select
                    name="location"
                    required
                    onChange={(e) => handleLocationChange(e.target.value, selectedCourse)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Select a location...</option>
                    <option value="North - Goodlands">North - Goodlands</option>
                    <option value="East - Flacq">East - Flacq</option>
                    <option value="Center - Quatre Bornes">Center - Quatre Bornes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Preferred Class Day *</label>
                  <select
                    name="classDay"
                    required
                    disabled={availableSlots.length === 0}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{loadingSlots ? 'Loading available days...' : 'Select a day...'}</option>
                    {Array.from(new Set(availableSlots.map((s: any) => s.day))).map((day: any) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Preferred Class Time *</label>
                  <select
                    name="classTime"
                    required
                    disabled={availableSlots.length === 0}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{loadingSlots ? 'Loading available times...' : 'Select a time...'}</option>
                    {Array.from(new Set(availableSlots.map((s: any) => s.time))).map((time: any) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message (Optional)</label>
                  <textarea
                    name="message"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                    placeholder="Tell us about your musical background or any questions..."
                    rows={4}
                  />
                </div>

                {/* Payment Instructions */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold mb-4">💳 Payment Instructions</h3>
                  <div className="flex items-center justify-center mb-6">
                    <img src="/images/mcb-juice-logo.png" alt="MCB Juice" className="h-16 object-contain" />
                  </div>
                  <div className="space-y-3 text-sm">
                    <p><strong>Monthly Subscription:</strong> Rs 1,200/month</p>
                    <p><strong>Payment Method:</strong> Juice by MCB</p>
                    <p className="bg-white/10 p-3 rounded">
                      Send your monthly payment to: <strong>57566278</strong><br/>
                      Include your full name in the message
                    </p>
                    <p><strong>First Payment:</strong> Rs 1,200 (non-refundable deposit to secure your enrollment)</p>
                    <p><strong>Following Months:</strong> Rs 1,200/month</p>
                  </div>
                </div>

                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-6">
                  <p className="text-sm font-semibold">⚠️ Important: Non-Refundable Fee</p>
                  <p className="text-sm mt-2">Once payment is made, it cannot be refunded. Please ensure you are ready to commit to the course before making payment.</p>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rulesAccepted"
                      required
                      className="mt-1 w-5 h-5 accent-white"
                    />
                    <span className="text-sm">
                      I have read and agree to the Rules and Regulations of King Music Academy. I acknowledge that this is a Christian institution and commit to respecting its Christian values and principles. *
                    </span>
                  </label>
                </div>

                <p className="text-sm text-blue-100 text-center">
                  After submitting this form, you will receive a confirmation email. Please complete your payment via Juice by MCB within 24 hours.
                </p>

                <Button 
                  type="submit"
                  className="w-full bg-white text-primary hover:bg-blue-50 font-bold py-3 text-lg"
                >
                  Submit Enrollment
                </Button>

                <p className="text-xs text-blue-100 text-center">
                  * Required fields. Enrollment deadline: January 31, 2026
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section - HIDDEN FOR LATER RELEASE */}
      {false && <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Student Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from our talented students about their transformative journey at King Music Academy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-subtle hover:shadow-lg transition-shadow p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">A</div>
                <div>
                  <h3 className="font-bold text-gray-900">Amira Patel</h3>
                  <p className="text-sm text-gray-600">Piano Student</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-700 italic">"The instructors here are incredibly patient and skilled. I went from complete beginner to playing full songs in just 6 months. Highly recommended!"</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-subtle hover:shadow-lg transition-shadow p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">R</div>
                <div>
                  <h3 className="font-bold text-gray-900">Rohan Kumar</h3>
                  <p className="text-sm text-gray-600">Guitar Student</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-700 italic">"Best decision I made! The structured curriculum and personalized attention helped me master guitar. Now I perform at local events!"</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-subtle hover:shadow-lg transition-shadow p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">S</div>
                <div>
                  <h3 className="font-bold text-gray-900">Sophie Dubois</h3>
                  <p className="text-sm text-gray-600">Vocal Student</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-700 italic">"My confidence in singing has skyrocketed! The vocal training here is world-class. I love the supportive community and professional environment."</p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-lg shadow-subtle hover:shadow-lg transition-shadow p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">M</div>
                <div>
                  <h3 className="font-bold text-gray-900">Marcus Johnson</h3>
                  <p className="text-sm text-gray-600">Audio Engineering</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-gray-700 italic">"The Audio Engineering course was exactly what I needed to start my music production career. Practical skills and industry knowledge!"</p>
            </div>
          </div>
        </div>
      </section>}

      {/* Course Schedule Table */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Course Schedule & Availability</h2>
            <p className="text-lg text-gray-600">Find the perfect class time and location that fits your schedule</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Course</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Location</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Day & Time</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Duration</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody>
                {/* Instrument Courses - Tuesday Goodlands */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Piano / Guitar / Vocal / Drums / Bass Guitar</td>
                  <td className="border border-gray-300 px-4 py-3">Goodlands</td>
                  <td className="border border-gray-300 px-4 py-3">Tuesday: 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">1 hour</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 1,200/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Instrument Courses - Wednesday Quatre Bornes */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Piano / Guitar / Vocal / Drums / Bass Guitar</td>
                  <td className="border border-gray-300 px-4 py-3">Quatre Bornes</td>
                  <td className="border border-gray-300 px-4 py-3">Wednesday: 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">1 hour</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 1,200/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Instrument Courses - Thursday Flacq */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Piano / Guitar / Vocal / Drums / Bass Guitar</td>
                  <td className="border border-gray-300 px-4 py-3">Flacq</td>
                  <td className="border border-gray-300 px-4 py-3">Thursday: 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">1 hour</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 1,200/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Instrument Courses - Friday Quatre Bornes */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Piano / Guitar / Vocal / Drums / Bass Guitar</td>
                  <td className="border border-gray-300 px-4 py-3">Quatre Bornes</td>
                  <td className="border border-gray-300 px-4 py-3">Friday: 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">1 hour</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 1,200/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Specialized Courses - HIDDEN FOR LATER RELEASE */}
                {/* Media Production */}
                {/* <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Media Production</td>
                  <td className="border border-gray-300 px-4 py-3">All Locations</td>
                  <td className="border border-gray-300 px-4 py-3">Thursday, 7:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">3 months</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 2,500/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Audio Engineering */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Audio Engineering</td>
                  <td className="border border-gray-300 px-4 py-3">All Locations</td>
                  <td className="border border-gray-300 px-4 py-3">Thursday, 7:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">3 months</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 2,500/month</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Songwriting Workshop */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Songwriting Workshop</td>
                  <td className="border border-gray-300 px-4 py-3">All Locations</td>
                  <td className="border border-gray-300 px-4 py-3">Thursday, 7:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">2 hours (1-time)</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 2,500</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr>
                {/* Worship Leadership */}
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Worship Leadership</td>
                  <td className="border border-gray-300 px-4 py-3">All Locations</td>
                  <td className="border border-gray-300 px-4 py-3">Thursday, 7:00 PM</td>
                  <td className="border border-gray-300 px-4 py-3">1 month</td>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">Rs 5,000</td>
                  <td className="border border-gray-300 px-4 py-3 text-center"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Open</span></td>
                </tr> */
              </tbody>
            </table>
          </div>


        </div>
      </section>

      {/* Student Gallery Section - HIDDEN FOR LATER RELEASE */}
      {false && <section className="py-20 md:py-28 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Student Gallery</h2>
            <p className="text-lg text-gray-600">Showcase of our talented students performing at concerts, studio sessions, and special events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gallery Item 1 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Student Piano Performance" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Piano Performance</h3>
                  <p className="text-sm text-gray-200">Annual Student Concert 2024</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Guitar Ensemble" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Guitar Ensemble</h3>
                  <p className="text-sm text-gray-200">Group Performance Showcase</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Vocal Studio Session" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Vocal Studio Session</h3>
                  <p className="text-sm text-gray-200">Professional Recording</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 4 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Drums Workshop" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Drums Workshop</h3>
                  <p className="text-sm text-gray-200">Rhythm Mastery Class</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 5 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Media Production Setup" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Media Production</h3>
                  <p className="text-sm text-gray-200">Professional Studio Setup</p>
                </div>
              </div>
            </div>

            {/* Gallery Item 6 */}
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow group">
              <img src="/images/king-concert.jpg" alt="Worship Leadership" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-bold text-lg">Worship Leadership</h3>
                  <p className="text-sm text-gray-200">Church Performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>}

      {/* Performance Calendar Section - HIDDEN FOR LATER RELEASE */}
      {false && <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Upcoming Events & Performances</h2>
            <p className="text-lg text-gray-600">Mark your calendar for exciting student performances and academy events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event 1 */}
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">15</div>
                    <div className="text-sm text-gray-600">February</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">Monthly Student Recital</h3>
                  <p className="text-gray-600 mb-3">Showcase performances by our talented instrument students</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Quatre Bornes Studio</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-blue-900 text-white">Learn More</Button>
            </Card>

            {/* Event 2 */}
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">22</div>
                    <div className="text-sm text-gray-600">February</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">Media Production Showcase</h3>
                  <p className="text-gray-600 mb-3">Student video projects and production work exhibition</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Goodlands Campus</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-blue-900 text-white">Learn More</Button>
            </Card>

            {/* Event 3 */}
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">01</div>
                    <div className="text-sm text-gray-600">March</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">Worship Leadership Workshop</h3>
                  <p className="text-gray-600 mb-3">Special training session with Kheejoo Jenkins</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Flacq Studio</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-blue-900 text-white">Learn More</Button>
            </Card>

            {/* Event 4 */}
            <Card className="p-8 border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">15</div>
                    <div className="text-sm text-gray-600">March</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary mb-2">Annual Student Concert</h3>
                  <p className="text-gray-600 mb-3">Grand finale performance featuring all students and courses</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Grand Theater, Port Louis</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-blue-900 text-white">Learn More</Button>
            </Card>
          </div>
        </div>
      </section>}

      {/* Church Package CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-primary to-blue-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Church Worship Seminar & Training</h2>
            <p className="text-xl text-blue-100 mb-8">
              Bring professional worship leadership and sound system training to your church musicians. Rs 2,000 per person.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/church-package'}
                className="bg-white text-primary hover:bg-blue-50 font-semibold px-8 py-3"
              >
                Learn More
              </Button>
              <Button 
                onClick={() => window.location.href = '/church-package'}
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/23057566278?text=Hi%20King%20Music%20Academy%2C%20I%20have%20questions%20about%20your%20courses%20and%20enrollment."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
        title="Chat with us on WhatsApp"
      >
        <img src="/images/whatsapp-logo-new.png" alt="Chat with us on WhatsApp" className="object-contain" style={{ width: '80px', height: '80px' }} />
      </a>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold">Our Locations</p>
                    <p className="text-gray-400 text-sm">North: Goodlands | East: Flacq | Center: Quatre Bornes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-400 text-sm">info@kingmusicacademy.mu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-gray-400 text-sm">+230 57566278</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400 text-sm mb-4">
                King Music Academy provides professional music education rooted in Christian values, preparing students for performance, worship, and ministry.
              </p>
              <a href="#about" className="text-accent hover:text-white transition">About the Founder</a>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>✓ Learn from a national icon with 30 years of experience</li>
                <li>✓ Comprehensive courses: Instruments, Media, Audio, Songwriting, Worship</li>
                <li>✓ 12-month professional courses with structured curriculum</li>
                <li>✓ Christian values integrated into every lesson</li>
                <li>✓ Affordable pricing from Rs 1,000 - Rs 2,500/month</li>
                <li>✓ Three locations across the island</li>
                <li>✓ Performance opportunity at the annual concert</li>
              </ul>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share with a Friend
              </h3>
              <p className="text-gray-400 mb-4">Know someone interested in music? Share King Music Academy with them!</p>
              <div className="flex justify-center gap-4">
                <a
                  href={`https://wa.me/?text=Check%20out%20King%20Music%20Academy%20-%20Professional%20Music%20Education%20in%20Mauritius!%20Learn%20from%20a%20national%20icon%20with%2030%20years%20of%20experience.%20Courses%20in%20Instruments%2C%20Media%20Production%2C%20Audio%20Engineering%2C%20Songwriting%20%26%20Worship%20Leadership.%20Visit%20us%20today!%20%F0%9F%8E%B5`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  <span>📱 Share on WhatsApp</span>
                </a>
                <a
                  href={`mailto:?subject=King%20Music%20Academy%20-%20Professional%20Music%20Education&body=Hi!%0A%0AI%20wanted%20to%20share%20an%20amazing%20opportunity%20with%20you.%20King%20Music%20Academy%20offers%20professional%20music%20education%20in%20Mauritius%20with%20courses%20in%3A%0A%0A%F0%9F%8E%B8%20Instruments%20(Piano%2C%20Guitar%2C%20Vocal%2C%20Drums%2C%20Bass)%0A%F0%9F%8E%AC%20Media%20Production%0A%F0%9F%94%8A%20Audio%20Engineering%0A%F0%9F%8E%B5%20Songwriting%20%26%20Composition%0A%F0%9F%99%8F%20Worship%20Leadership%0A%0ALearn%20from%20a%20national%20icon%20with%2030%20years%20of%20musical%20mastery!%0A%0ALocations%3A%20Goodlands%2C%20Quatre%20Bornes%2C%20Flacq%0AAffordable%20pricing%20from%20Rs%201%2C200%20-%20Rs%202%2C500%2Fmonth%0A%0ACheck%20us%20out%20and%20start%20your%20musical%20journey%20today!%0A%0AVisit%20our%20website%20for%20more%20details.`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  <Mail className="w-5 h-5" />
                  Share via Email
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 King Music Academy. All rights reserved. | Professional Music Education in Mauritius</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
