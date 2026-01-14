import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Enrollment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  specificCourse?: string;
  courseLevel?: string;
  classDay?: string;
  classTime?: string;
}

interface EditEnrollmentModalProps {
  editingId: number | null;
  enrollments: Enrollment[];
  onClose: () => void;
  onEnrollmentsChange: (enrollments: Enrollment[]) => void;
}

export const EditEnrollmentModal: React.FC<EditEnrollmentModalProps> = ({
  editingId,
  enrollments,
  onClose,
  onEnrollmentsChange,
}) => {
  if (editingId === null) return null;

  const enrollment = enrollments.find(e => e.id === editingId);
  if (!enrollment) return null;

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/enrollments/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          firstName: enrollment.firstName,
          lastName: enrollment.lastName,
          age: enrollment.age,
          location: enrollment.location,
          specificCourse: enrollment.specificCourse,
          courseLevel: enrollment.courseLevel,
          classDay: enrollment.classDay,
          classTime: enrollment.classTime,
          status: enrollment.status,
        }),
      });

      if (response.ok) {
        alert('Student information updated successfully!');
        onClose();
      } else {
        alert('Failed to update student information');
      }
    } catch (error) {
      console.error('Error updating enrollment:', error);
      alert('Error updating student information');
    }
  };

  const updateField = (field: keyof Enrollment, value: any) => {
    const updated = enrollments.map(en =>
      en.id === editingId ? { ...en, [field]: value } : en
    );
    onEnrollmentsChange(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Edit Student Information</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={enrollment.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={enrollment.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={enrollment.age}
              onChange={(e) => updateField('age', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Age"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <select
              value={enrollment.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="East - Flacq">East - Flacq</option>
              <option value="North - Goodlands">North - Goodlands</option>
              <option value="Center - Quatre Bornes">Center - Quatre Bornes</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Course Type
            </label>
            <select
              value={enrollment.course}
              onChange={(e) => updateField('course', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Instrument">Instrument</option>
              <option value="Vocal">Vocal</option>
              <option value="Instrument & Vocal">Instrument & Vocal</option>
            </select>
          </div>

          {/* Specific Course */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Instrument/Course
            </label>
            <input
              type="text"
              value={enrollment.specificCourse || ''}
              onChange={(e) => updateField('specificCourse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Piano, Guitar, Drums"
            />
          </div>

          {/* Course Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Course Level
            </label>
            <select
              value={enrollment.courseLevel || ''}
              onChange={(e) => updateField('courseLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Class Day */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Class Day
            </label>
            <select
              value={enrollment.classDay || ''}
              onChange={(e) => updateField('classDay', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Class Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Class Time
            </label>
            <select
              value={enrollment.classTime || ''}
              onChange={(e) => updateField('classTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={enrollment.status}
              onChange={(e) => updateField('status', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
          <Button onClick={onClose} className="flex-1 bg-gray-400 hover:bg-gray-500">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};
