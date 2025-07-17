import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Download,
  Calendar as CalendarIcon,
  Search,
  Filter,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  status: "present" | "absent" | "late";
  course: string;
  section: string;
}

interface AttendanceTableProps {
  userRole?: "admin" | "teacher" | "student";
  courseId?: string;
  sectionId?: string;
  date?: Date;
  students?: Student[];
  attendanceRecords?: AttendanceRecord[];
}

const AttendanceTable = ({
  userRole = "teacher",
  courseId = "",
  sectionId = "",
  date = new Date(),
  students = [
    {
      id: "1",
      name: "John Doe",
      studentId: "S12345",
      email: "john.doe@university.edu",
    },
    {
      id: "2",
      name: "Jane Smith",
      studentId: "S12346",
      email: "jane.smith@university.edu",
    },
    {
      id: "3",
      name: "Robert Johnson",
      studentId: "S12347",
      email: "robert.johnson@university.edu",
    },
    {
      id: "4",
      name: "Emily Davis",
      studentId: "S12348",
      email: "emily.davis@university.edu",
    },
    {
      id: "5",
      name: "Michael Wilson",
      studentId: "S12349",
      email: "michael.wilson@university.edu",
    },
  ],
  attendanceRecords = [
    {
      id: "1",
      studentId: "1",
      studentName: "John Doe",
      date: new Date(2023, 5, 1),
      status: "present",
      course: "Computer Science 101",
      section: "A",
    },
    {
      id: "2",
      studentId: "2",
      studentName: "Jane Smith",
      date: new Date(2023, 5, 1),
      status: "absent",
      course: "Computer Science 101",
      section: "A",
    },
    {
      id: "3",
      studentId: "3",
      studentName: "Robert Johnson",
      date: new Date(2023, 5, 1),
      status: "present",
      course: "Computer Science 101",
      section: "A",
    },
    {
      id: "4",
      studentId: "4",
      studentName: "Emily Davis",
      date: new Date(2023, 5, 1),
      status: "late",
      course: "Computer Science 101",
      section: "A",
    },
    {
      id: "5",
      studentId: "5",
      studentName: "Michael Wilson",
      date: new Date(2023, 5, 1),
      status: "present",
      course: "Computer Science 101",
      section: "A",
    },
  ],
}: AttendanceTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all-courses");
  const [selectedSection, setSelectedSection] =
    useState<string>("all-sections");
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("all-departments");
  const [attendanceData, setAttendanceData] = useState<
    Record<string, "present" | "absent" | "late">
  >(
    students.reduce((acc, student) => {
      const record = attendanceRecords.find((r) => r.studentId === student.id);
      return { ...acc, [student.id]: record?.status || "absent" };
    }, {}),
  );

  // Mock data for filters
  const courses = [
    "Computer Science 101",
    "Mathematics 202",
    "Physics 101",
    "English Literature 303",
  ];
  const sections = ["A", "B", "C", "D"];
  const departments = ["Computer Science", "Mathematics", "Physics", "English"];

  const handleAttendanceChange = (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    // In a real app, this would send the attendance data to the server
    console.log("Saving attendance data:", attendanceData);
    // Show success message or handle response
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log("Exporting attendance data");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAttendanceRecords = attendanceRecords.filter(
    (record) =>
      (selectedCourse !== "all-courses"
        ? record.course === selectedCourse
        : true) &&
      (selectedSection !== "all-sections"
        ? record.section === selectedSection
        : true) &&
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderTeacherView = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-courses">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-sections">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  Section {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card className="bg-background">
        <CardHeader className="pb-2">
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Late</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendanceData[student.id] === "present"}
                      onCheckedChange={() =>
                        handleAttendanceChange(student.id, "present")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendanceData[student.id] === "absent"}
                      onCheckedChange={() =>
                        handleAttendanceChange(student.id, "absent")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendanceData[student.id] === "late"}
                      onCheckedChange={() =>
                        handleAttendanceChange(student.id, "late")
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderStudentView = () => (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>My Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-courses">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(record.date, "PPP")}</TableCell>
                <TableCell>{record.course}</TableCell>
                <TableCell>Section {record.section}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "present"
                        ? "default"
                        : record.status === "late"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {record.status.charAt(0).toUpperCase() +
                      record.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderAdminView = () => (
    <>
      <Tabs defaultValue="records" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-departments">
                    All Departments
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-courses">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sections">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <Card className="bg-background">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {
                          students.find((s) => s.id === record.studentId)
                            ?.studentId
                        }
                      </TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell>{record.course}</TableCell>
                      <TableCell>Section {record.section}</TableCell>
                      <TableCell>{format(record.date, "PPP")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "present"
                              ? "default"
                              : record.status === "late"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card className="bg-background">
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground">
                Attendance statistics visualization would be displayed here.
                <br />
                (Charts and graphs showing attendance patterns by course,
                department, etc.)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <div className="w-full bg-background p-6">
      {userRole === "teacher" && renderTeacherView()}
      {userRole === "student" && renderStudentView()}
      {userRole === "admin" && renderAdminView()}
    </div>
  );
};

export default AttendanceTable;
