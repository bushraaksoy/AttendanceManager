// Event type colors for schedule display
export const EVENT_TYPE_COLORS = {
  lecture: "bg-blue-100 text-blue-800 border-blue-200",
  lab: "bg-green-100 text-green-800 border-green-200",
  exam: "bg-red-100 text-red-800 border-red-200",
  assignment: "bg-yellow-100 text-yellow-800 border-yellow-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

// Status colors for schedule events
export const STATUS_COLORS = {
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  scheduled: "bg-blue-500",
};

// Time slots for schedule display (8 AM to 7 PM)
export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

// Available courses list
export const AVAILABLE_COURSES = [
  "CS101",
  "CS201",
  "CS301",
  "MATH201",
  "MATH301",
  "PHYS101",
  "PHYS201",
  "ENG205",
  "BIO110",
  "CHEM101",
];

// Get current week dates for demo schedule
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1);

  return {
    monday: new Date(monday),
    tuesday: new Date(monday.getTime() + 24 * 60 * 60 * 1000),
    wednesday: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000),
    thursday: new Date(monday.getTime() + 3 * 24 * 60 * 60 * 1000),
    friday: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000),
  };
};

const weekDates = getCurrentWeekDates();

// Demo schedule for a single student with varying times, courses, and sections
export const DEMO_STUDENT_SCHEDULE = [
  {
    id: "demo-1",
    title: "Introduction to Programming",
    course: "CS101",
    section: "A",
    teacher: "Dr. Alan Turing",
    room: "CS-301",
    classroom: "A102",
    startTime: "08:00",
    endTime: "10:00",
    date: weekDates.monday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-2",
    title: "Programming Lab Session",
    course: "CS101",
    section: "A",
    teacher: "Dr. Alan Turing",
    room: "CS-Lab1",
    classroom: "A201",
    startTime: "14:00",
    endTime: "16:00",
    date: weekDates.monday,
    type: "lab" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-3",
    title: "Calculus II",
    course: "MATH201",
    section: "B",
    teacher: "Dr. Katherine Johnson",
    room: "MATH-101",
    classroom: "B203",
    startTime: "09:00",
    endTime: "11:00",
    date: weekDates.tuesday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-4",
    title: "Data Structures",
    course: "CS201",
    section: "C",
    teacher: "Dr. Donald Knuth",
    room: "CS-302",
    classroom: "A105",
    startTime: "11:00",
    endTime: "13:00",
    date: weekDates.tuesday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-5",
    title: "Physics Lab",
    course: "PHYS101",
    section: "A",
    teacher: "Dr. Richard Feynman",
    room: "PHYS-Lab1",
    classroom: "C301",
    startTime: "14:00",
    endTime: "16:00",
    date: weekDates.tuesday,
    type: "lab" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-6",
    title: "Object-Oriented Programming",
    course: "CS101",
    section: "A",
    teacher: "Dr. Alan Turing",
    room: "CS-301",
    classroom: "A102",
    startTime: "10:00",
    endTime: "12:00",
    date: weekDates.wednesday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-7",
    title: "Advanced Calculus",
    course: "MATH301",
    section: "A",
    teacher: "Dr. Emmy Noether",
    room: "MATH-201",
    classroom: "B104",
    startTime: "08:00",
    endTime: "10:00",
    date: weekDates.thursday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-8",
    title: "Data Structures Lab",
    course: "CS201",
    section: "C",
    teacher: "Dr. Donald Knuth",
    room: "CS-Lab2",
    classroom: "A202",
    startTime: "15:00",
    endTime: "17:00",
    date: weekDates.thursday,
    type: "lab" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-9",
    title: "Programming Midterm Exam",
    course: "CS101",
    section: "A",
    teacher: "Dr. Alan Turing",
    room: "EXAM-Hall1",
    classroom: "D101",
    startTime: "09:00",
    endTime: "11:00",
    date: weekDates.friday,
    type: "exam" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-10",
    title: "Physics Theory",
    course: "PHYS201",
    section: "B",
    teacher: "Dr. Marie Curie",
    room: "PHYS-201",
    classroom: "C205",
    startTime: "12:00",
    endTime: "14:00",
    date: weekDates.friday,
    type: "lecture" as const,
    status: "scheduled" as const,
  },
  {
    id: "demo-11",
    title: "Programming Assignment Due",
    course: "CS101",
    section: "A",
    teacher: "Dr. Alan Turing",
    room: "Online",
    classroom: "Online",
    startTime: "16:00",
    endTime: "17:00",
    date: weekDates.friday,
    type: "assignment" as const,
    status: "scheduled" as const,
  },
];

// Interface for schedule events
export interface ScheduleEvent {
  id: string;
  title: string;
  course: string;
  section: string;
  teacher: string;
  room: string;
  classroom: string;
  startTime: string;
  endTime: string;
  date: Date;
  type: "lecture" | "lab" | "exam" | "assignment";
  status: "scheduled" | "completed" | "cancelled";
}
