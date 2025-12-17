import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function RulesAndRegulations() {

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-subtle">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Rules & Regulations</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="p-8 border-0 shadow-subtle">
            <h2 className="text-3xl font-bold text-primary mb-4">King Music Academy</h2>
            <p className="text-lg text-gray-700 mb-6">
              Welcome to King Music Academy, a Christian-based music education institution dedicated to developing musical excellence within a framework of Christian values and principles.
            </p>
            <p className="text-gray-700 mb-4">
              By enrolling in King Music Academy, students and parents/guardians acknowledge and agree to adhere to the following rules and regulations that govern our academy community.
            </p>
          </Card>

          {/* Core Values */}
          <Card className="p-8 border-0 shadow-subtle bg-blue-50">
            <h3 className="text-2xl font-bold text-primary mb-6">Our Christian Foundation</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>1. Christian Values:</strong> King Music Academy is a Christian academy committed to teaching music within the context of Christian principles. We believe that music is a divine gift meant to glorify God and serve humanity. All students are expected to respect and uphold these Christian values during their time with us.
              </p>
              <p>
                <strong>2. Spiritual Development:</strong> Our curriculum integrates spiritual growth alongside musical training. Students will be exposed to gospel music, worship principles, and the role of music in ministry and community service.
              </p>
              <p>
                <strong>3. Moral Conduct:</strong> Students are expected to conduct themselves with integrity, respect, and dignity in accordance with Christian teachings. This includes treating instructors, fellow students, and academy property with respect.
              </p>
            </div>
          </Card>

          {/* Attendance & Conduct */}
          <Card className="p-8 border-0 shadow-subtle">
            <h3 className="text-2xl font-bold text-primary mb-6">Attendance & Conduct</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>4. Regular Attendance:</strong> Students are required to attend all scheduled lessons. Regular attendance is essential for musical progress and development. Excessive absences may result in course suspension.
              </p>
              <p>
                <strong>5. Punctuality:</strong> Students must arrive on time for all lessons. Late arrivals disrupt the learning environment and may result in shortened lesson time.
              </p>
              <p>
                <strong>6. Professional Behavior:</strong> Students must maintain respectful and professional behavior at all times. This includes listening to instructors, following directions, and maintaining a positive attitude toward learning.
              </p>
              <p>
                <strong>7. Classroom Conduct:</strong> Students must refrain from disruptive behavior, including excessive talking, using mobile phones during lessons, or any conduct that interferes with the learning of others.
              </p>
            </div>
          </Card>

          {/* Practice & Commitment */}
          <Card className="p-8 border-0 shadow-subtle">
            <h3 className="text-2xl font-bold text-primary mb-6">Practice & Commitment</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>8. Regular Practice:</strong> Students are expected to practice their instrument/vocal skills regularly between lessons. Consistent practice is crucial for musical development and progress.
              </p>
              <p>
                <strong>9. Course Participation:</strong> Students are expected to participate in academy events, concerts, and performances when required. These events are integral to the learning experience and community building.
              </p>
              <p>
                <strong>10. Instrument Care:</strong> Students are responsible for maintaining their instruments in good condition. Damage due to negligence may result in repair costs charged to the student.
              </p>
            </div>
          </Card>

          {/* Payment & Enrollment */}
          <Card className="p-8 border-0 shadow-subtle">
            <h3 className="text-2xl font-bold text-primary mb-6">Payment & Enrollment</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>11. Tuition Payment:</strong> Monthly tuition fees must be paid on time. Late payments may result in suspension of lessons until payment is received.
              </p>
              <p>
                <strong>12. Non-Refundable Deposit:</strong> The first payment serves as a non-refundable security deposit to confirm enrollment. This deposit cannot be refunded under any circumstances.
              </p>
              <p>
                <strong>13. Course Duration:</strong> Standard courses are 12 months in duration. Students are expected to commit to the full course period.
              </p>
              <p>
                <strong>14. Withdrawal Policy:</strong> Students wishing to withdraw must provide written notice. Tuition payments are non-refundable once lessons have commenced.
              </p>
            </div>
          </Card>

          {/* Respect & Safety */}
          <Card className="p-8 border-0 shadow-subtle">
            <h3 className="text-2xl font-bold text-primary mb-6">Respect & Safety</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>15. Respect for Others:</strong> Students must treat all academy members—instructors, staff, and fellow students—with respect and courtesy. Discrimination, harassment, or bullying of any kind is strictly prohibited.
              </p>
              <p>
                <strong>16. Academy Property:</strong> Students must respect and care for all academy property, including instruments, equipment, and facilities. Damage or loss of academy property may result in financial liability.
              </p>
              <p>
                <strong>17. Health & Safety:</strong> Students must follow all health and safety guidelines established by the academy. This includes proper handling of instruments and equipment.
              </p>
            </div>
          </Card>

          {/* Acknowledgment */}
          <Card className="p-8 border-0 shadow-subtle bg-green-50">
            <h3 className="text-2xl font-bold text-green-700 mb-4">Enrollment Acknowledgment</h3>
            <p className="text-gray-700 mb-6">
              By checking the acknowledgment box during enrollment, you confirm that you have read, understood, and agree to comply with all rules and regulations of King Music Academy. You also acknowledge that King Music Academy is a Christian institution and commit to respecting its Christian values and principles.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> December 2024
            </p>
          </Card>

          {/* Back Button */}
          <div className="text-center">
            <Link href="/">
              <Button
                className="bg-primary hover:bg-blue-900 text-white"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
