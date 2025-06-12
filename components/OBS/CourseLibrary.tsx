import { useState } from 'react';
import { FiBook, FiUsers, FiBookmark, FiDownload } from 'react-icons/fi';

interface Course {
  id: string;
  name: string;
  instructor: string;
  books: Book[];
  enrolledStudents: number;
  progress: number;
  materials: Material[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  isRequired: boolean;
  isAvailable: boolean;
}

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'assignment';
  size: string;
  uploadedAt: string;
}

export default function CourseLibrary() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Mock data - replace with API call
  const courses: Course[] = [
    {
      id: '1',
      name: 'Introduction to Programming',
      instructor: 'Dr. John Smith',
      enrolledStudents: 45,
      progress: 60,
      books: [
        {
          id: '1',
          title: 'Python Programming',
          author: 'Mark Johnson',
          isRequired: true,
          isAvailable: true,
        },
        {
          id: '2',
          title: 'Data Structures in Python',
          author: 'Sarah Williams',
          isRequired: false,
          isAvailable: true,
        },
      ],
      materials: [
        {
          id: '1',
          name: 'Course Syllabus',
          type: 'pdf',
          size: '2.4 MB',
          uploadedAt: '2024-02-20',
        },
        {
          id: '2',
          name: 'Week 1 Lecture',
          type: 'video',
          size: '156 MB',
          uploadedAt: '2024-02-19',
        },
      ],
    },
    {
      id: '2',
      name: 'Advanced Web Development',
      instructor: 'Prof. Emily Brown',
      enrolledStudents: 32,
      progress: 30,
      books: [
        {
          id: '3',
          title: 'Modern JavaScript',
          author: 'David Wilson',
          isRequired: true,
          isAvailable: true,
        },
      ],
      materials: [
        {
          id: '3',
          name: 'Project Guidelines',
          type: 'pdf',
          size: '1.8 MB',
          uploadedAt: '2024-02-18',
        },
      ],
    },
  ];

  const filteredCourses =
    selectedCourse === 'all' ? courses : courses.filter(course => course.id === selectedCourse);

  return (
    <div className="p-6">
      {/* Course Selection */}
      <div className="mb-6">
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">
          Select Course
        </label>
        <select
          id="course"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                <span className="flex items-center text-gray-500">
                  <FiUsers className="h-5 w-5 mr-1" />
                  <span className="text-sm">{course.enrolledStudents} students</span>
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Instructor: {course.instructor}</p>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Course Progress</span>
                  <span className="font-medium text-gray-900">{course.progress}%</span>
                </div>
                <div className="mt-2">
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${course.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Books */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Required Books</h4>
                <ul className="space-y-2">
                  {course.books.map(book => (
                    <li key={book.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBook className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{book.title}</span>
                      </div>
                      {book.isRequired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Materials */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Course Materials</h4>
                <ul className="space-y-2">
                  {course.materials.map(material => (
                    <li key={material.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiBookmark className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{material.name}</span>
                      </div>
                      <button
                        className="text-indigo-600 hover:text-indigo-500"
                        onClick={() => {
                          /* Handle download */
                        }}
                      >
                        <FiDownload className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
