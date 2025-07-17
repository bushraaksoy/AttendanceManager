import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, FileText, Users } from "lucide-react";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  teacher: string;
  credits: number;
  students: number;
}

interface Section {
  id: string;
  courseId: string;
  name: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolled: number;
}

interface Lesson {
  id: string;
  sectionId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface CourseManagementProps {
  userRole?: "admin" | "teacher" | "student";
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  userRole = "admin",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all-departments");
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);

  // Mock data
  const courses: Course[] = [
    {
      id: "1",
      code: "CS101",
      name: "Introduction to Computer Science",
      department: "Computer Science",
      teacher: "Dr. Alan Turing",
      credits: 3,
      students: 45,
    },
    {
      id: "2",
      code: "MATH201",
      name: "Calculus II",
      department: "Mathematics",
      teacher: "Dr. Katherine Johnson",
      credits: 4,
      students: 38,
    },
    {
      id: "3",
      code: "PHYS101",
      name: "Physics I",
      department: "Physics",
      teacher: "Dr. Richard Feynman",
      credits: 4,
      students: 52,
    },
    {
      id: "4",
      code: "ENG205",
      name: "Creative Writing",
      department: "English",
      teacher: "Prof. Jane Austen",
      credits: 3,
      students: 25,
    },
    {
      id: "5",
      code: "BIO110",
      name: "Introduction to Biology",
      department: "Biology",
      teacher: "Dr. Rosalind Franklin",
      credits: 4,
      students: 60,
    },
  ];

  const sections: Section[] = [
    {
      id: "1",
      courseId: "1",
      name: "Section A",
      schedule: "Mon/Wed 10:00-11:30",
      room: "CS-301",
      capacity: 30,
      enrolled: 28,
    },
    {
      id: "2",
      courseId: "1",
      name: "Section B",
      schedule: "Tue/Thu 13:00-14:30",
      room: "CS-302",
      capacity: 30,
      enrolled: 17,
    },
    {
      id: "3",
      courseId: "2",
      name: "Section A",
      schedule: "Mon/Wed/Fri 9:00-10:00",
      room: "MATH-101",
      capacity: 40,
      enrolled: 38,
    },
    {
      id: "4",
      courseId: "3",
      name: "Section A",
      schedule: "Tue/Thu 9:00-10:30",
      room: "PHYS-201",
      capacity: 35,
      enrolled: 32,
    },
    {
      id: "5",
      courseId: "3",
      name: "Section B",
      schedule: "Tue/Thu 11:00-12:30",
      room: "PHYS-201",
      capacity: 35,
      enrolled: 20,
    },
  ];

  const lessons: Lesson[] = [
    {
      id: "1",
      sectionId: "1",
      date: "2023-09-05",
      startTime: "10:00",
      endTime: "11:30",
      topic: "Introduction to Programming",
      status: "completed",
    },
    {
      id: "2",
      sectionId: "1",
      date: "2023-09-07",
      startTime: "10:00",
      endTime: "11:30",
      topic: "Variables and Data Types",
      status: "completed",
    },
    {
      id: "3",
      sectionId: "1",
      date: "2023-09-12",
      startTime: "10:00",
      endTime: "11:30",
      topic: "Control Structures",
      status: "scheduled",
    },
    {
      id: "4",
      sectionId: "2",
      date: "2023-09-05",
      startTime: "13:00",
      endTime: "14:30",
      topic: "Introduction to Programming",
      status: "completed",
    },
    {
      id: "5",
      sectionId: "2",
      date: "2023-09-07",
      startTime: "13:00",
      endTime: "14:30",
      topic: "Variables and Data Types",
      status: "cancelled",
    },
  ];

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "English",
    "Biology",
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all-departments" ||
      course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const renderAdminView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-departments">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog
          open={showAddCourseDialog}
          onOpenChange={setShowAddCourseDialog}
        >
          <DialogTrigger asChild>
            <Button className="ml-4">
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new course.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="courseCode" className="text-right">
                  Course Code
                </Label>
                <Input
                  id="courseCode"
                  className="col-span-3"
                  placeholder="e.g. CS101"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="courseName" className="text-right">
                  Course Name
                </Label>
                <Input
                  id="courseName"
                  className="col-span-3"
                  placeholder="e.g. Introduction to Computer Science"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  Teacher
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Assign teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher1">Dr. Alan Turing</SelectItem>
                    <SelectItem value="teacher2">
                      Dr. Katherine Johnson
                    </SelectItem>
                    <SelectItem value="teacher3">
                      Dr. Richard Feynman
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credits" className="text-right">
                  Credits
                </Label>
                <Input
                  id="credits"
                  type="number"
                  className="col-span-3"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddCourseDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowAddCourseDialog(false)}>
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.department}</TableCell>
                <TableCell>{course.teacher}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.students}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No courses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );

  const renderTeacherView = () => {
    // Filter courses assigned to the teacher
    const teacherCourses = courses.filter(
      (course) => course.teacher === "Dr. Alan Turing",
    ); // Assuming logged in teacher

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teacherCourses.map((course) => {
            const courseSections = sections.filter(
              (section) => section.courseId === course.id,
            );
            return (
              <Card key={course.id} className="bg-background">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {course.code}: {course.name}
                      </CardTitle>
                      <CardDescription>
                        {course.department} • {course.credits} credits
                      </CardDescription>
                    </div>
                    <Badge>{courseSections.length} sections</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Students:</span>
                      <span>{course.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sections:</span>
                      <span>
                        {courseSections
                          .map((section) => section.name)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <Users className="mr-2 h-4 w-4" /> Manage Sections
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </>
    );
  };

  const renderStudentView = () => {
    // Assuming student is enrolled in these courses
    const enrolledCourseIds = ["1", "2", "5"];
    const studentCourses = courses.filter((course) =>
      enrolledCourseIds.includes(course.id),
    );

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studentCourses.map((course) => {
            const courseSections = sections.filter(
              (section) => section.courseId === course.id,
            );
            // Assuming student is in the first section of each course
            const studentSection = courseSections[0];
            const sectionLessons = lessons.filter(
              (lesson) => lesson.sectionId === studentSection?.id,
            );
            const completedLessons = sectionLessons.filter(
              (lesson) => lesson.status === "completed",
            ).length;
            const totalLessons = sectionLessons.length;

            return (
              <Card key={course.id} className="bg-background">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {course.code}: {course.name}
                      </CardTitle>
                      <CardDescription>
                        {course.department} • {course.credits} credits
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{studentSection?.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Teacher:</span>
                      <span>{course.teacher}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Schedule:</span>
                      <span>{studentSection?.schedule}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room:</span>
                      <span>{studentSection?.room}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Lessons Completed:
                      </span>
                      <span>
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" /> View Attendance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
        <p className="text-muted-foreground">
          View and manage university courses
        </p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          {userRole === "admin" && (
            <TabsTrigger value="departments">Departments</TabsTrigger>
          )}
          {userRole !== "student" && (
            <TabsTrigger value="sections">Sections</TabsTrigger>
          )}
          {userRole !== "student" && (
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {userRole === "admin" && renderAdminView()}
          {userRole === "teacher" && renderTeacherView()}
          {userRole === "student" && renderStudentView()}
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Manage university departments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Department management interface would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Course Sections</CardTitle>
              <CardDescription>
                Manage course sections and schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Section management interface would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
              <CardDescription>
                Manage course lessons and materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Lesson management interface would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseManagement;
