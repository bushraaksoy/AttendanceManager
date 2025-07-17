import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./auth/LoginForm";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-6xl px-4 py-8">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-primary mb-2">
              University Attendance System
            </h1>
            <p className="text-muted-foreground text-lg">
              Track and manage attendance efficiently
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <motion.div
            className="w-full md:w-1/2 lg:w-2/5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <p>
                  © {new Date().getFullYear()} University Attendance System
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 lg:w-3/5 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 1 3 3 3h6c2 0 3-1 3-3v-5" />
                </svg>
                For Administrators
              </h2>
              <p className="text-muted-foreground">
                Manage faculties, departments, courses, and users. Generate
                reports and oversee the entire attendance system.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                For Teachers
              </h2>
              <p className="text-muted-foreground">
                Track attendance for your courses, manage lessons, and view
                attendance statistics for your students.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                For Students
              </h2>
              <p className="text-muted-foreground">
                View your attendance records, check course schedules, and
                monitor your attendance statistics.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
