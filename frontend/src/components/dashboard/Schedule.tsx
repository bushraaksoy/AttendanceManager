import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react";
import {
  EVENT_TYPE_COLORS,
  STATUS_COLORS,
  TIME_SLOTS,
  AVAILABLE_COURSES,
  DEMO_STUDENT_SCHEDULE,
  type ScheduleEvent,
} from "@/utils/constants";

interface ScheduleProps {
  userRole?: "admin" | "teacher" | "student";
}

const Schedule: React.FC<ScheduleProps> = ({ userRole = "student" }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [selectedCourse, setSelectedCourse] = useState<string>("all-courses");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use demo schedule data from constants
  const scheduleEvents: ScheduleEvent[] = DEMO_STUDENT_SCHEDULE;

  const courses = AVAILABLE_COURSES;

  const getEventTypeColor = (type: string) => {
    return (
      EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] ||
      EVENT_TYPE_COLORS.default
    );
  };

  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      STATUS_COLORS.scheduled
    );
  };

  const filteredEvents = scheduleEvents.filter((event) => {
    const matchesCourse =
      selectedCourse === "all-courses" || event.course === selectedCourse;
    return matchesCourse;
  });

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const getDayEvents = (date: Date) => {
    return filteredEvents.filter(
      (event) => event.date.toDateString() === date.toDateString(),
    );
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = addDays(selectedDate, direction === "next" ? 7 : -7);
    setSelectedDate(newDate);
  };

  const renderDayView = () => {
    const dayEvents = getDayEvents(selectedDate);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => (
              <Card
                key={event.id}
                className="bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsDialogOpen(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}
                        />
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge
                          variant="outline"
                          className={getEventTypeColor(event.type)}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Classroom: {event.classroom}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{event.teacher}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {event.course} - {event.section}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-background">
              <CardContent className="p-8 text-center text-muted-foreground">
                No events scheduled for this day
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const timeSlots = TIME_SLOTS;

  const getEventPosition = (startTime: string, endTime: string) => {
    const [startHour, startMinutes] = startTime.split(":").map(Number);
    const [endHour, endMinutes] = endTime.split(":").map(Number);

    // Calculate minutes from 8:00 AM (start of schedule)
    const startTotalMinutes = startHour * 60 + startMinutes;
    const endTotalMinutes = endHour * 60 + endMinutes;
    const scheduleStartMinutes = 8 * 60; // 8:00 AM in minutes

    const startPosition = startTotalMinutes - scheduleStartMinutes;
    const duration = endTotalMinutes - startTotalMinutes;

    return {
      top: Math.max(0, (startPosition / 60) * 60), // 60px per hour, ensure non-negative
      height: Math.max(30, (duration / 60) * 60), // Minimum 30px height
    };
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(selectedDate);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Week of {format(weekDays[0], "MMMM d")} -{" "}
            {format(weekDays[6], "MMMM d, yyyy")}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex border rounded-lg bg-background overflow-hidden">
          {/* Time axis */}
          <div className="w-16 border-r bg-muted/30">
            <div className="h-12 border-b flex items-center justify-center text-xs font-medium">
              Time
            </div>
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="h-[60px] border-b border-border/50 flex items-start justify-center pt-1 text-xs text-muted-foreground"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="flex-1 grid grid-cols-7">
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getDayEvents(day);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayIndex}
                  className="border-r last:border-r-0 relative"
                >
                  {/* Day header */}
                  <div
                    className={`h-12 border-b flex flex-col items-center justify-center text-xs ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="font-medium">{format(day, "EEE")}</div>
                    <div className="text-xs">{format(day, "d")}</div>
                  </div>

                  {/* Time slots background */}
                  {timeSlots.map((time, timeIndex) => (
                    <div
                      key={time}
                      className="h-[60px] border-b border-border/20 hover:bg-muted/20 transition-colors"
                    />
                  ))}

                  {/* Events positioned absolutely */}
                  <div className="absolute top-12 left-0 right-0">
                    {dayEvents.map((event) => {
                      const position = getEventPosition(
                        event.startTime,
                        event.endTime,
                      );
                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow z-10 ${getEventTypeColor(event.type)}`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                          }}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDialogOpen(true);
                          }}
                        >
                          <div className="p-2 h-full flex flex-col justify-start overflow-hidden">
                            <div className="text-xs font-semibold truncate mb-1">
                              {event.course}
                            </div>
                            <div className="text-xs truncate opacity-90 mb-1">
                              {event.title}
                            </div>
                            <div className="text-xs truncate opacity-80">
                              {event.classroom}
                            </div>
                            <div className="text-xs truncate opacity-70 mt-auto">
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${getStatusColor(event.status)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>
              Events for {format(selectedDate, "MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getDayEvents(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDialogOpen(true);
                  }}
                >
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime} • {event.classroom}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getEventTypeColor(event.type)}
                  >
                    {event.type}
                  </Badge>
                </div>
              ))}
              {getDayEvents(selectedDate).length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No events for this day
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="bg-background p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {userRole === "student" ? "My Schedule" : "Schedule"}
        </h1>
        <p className="text-muted-foreground">
          {userRole === "student"
            ? "View your class schedule and upcoming events"
            : "Manage and view class schedules"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
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

        <Tabs
          value={viewMode}
          onValueChange={(value) =>
            setViewMode(value as "day" | "week" | "month")
          }
        >
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-[600px]">
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(selectedEvent.status)}`}
                />
                <Badge
                  variant="outline"
                  className={getEventTypeColor(selectedEvent.type)}
                >
                  {selectedEvent.type}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Classroom</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.classroom}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Room</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.room}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Teacher</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.teacher}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="font-medium">
                    {selectedEvent.course} - Section {selectedEvent.section}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(selectedEvent.date, "EEEE, MMMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
