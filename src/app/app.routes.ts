import { Routes, CanActivate } from '@angular/router';

/** Layouts */
import { PrincipalLayout } from './layouts/principal-layout/principal-layout';
import { TeacherLayout } from './layouts/teacher-layout/teacher-layout';
import { StudentLayout } from './layouts/student-layout/student-layout';

/** Principal */
import { Dashboard as PrincipalDashboard } from './pages/principal/dashboard/dashboard';
import { AutomatedResults } from './pages/principal/automated-results/automated-results';
import { ClassWiseSummary } from './pages/principal/class-wise-summary/class-wise-summary';
import { CollectFees } from './pages/principal/collect-fees/collect-fees';
import { Assignments } from './pages/principal/assignments/assignments';
import { CourseMaterial } from './pages/principal/course-material/course-material';
import { CreateNotice } from './pages/principal/create-notice/create-notice';
import { DailyAttendance } from './pages/principal/daily-attendance/daily-attendance';
import { EventCalendar } from './pages/principal/event-calendar/event-calendar';
import { ExamScheduling } from './pages/principal/exam-scheduling/exam-scheduling';
import { FeeStructures } from './pages/principal/fee-structures/fee-structures';
import { ManageStudents as PrincipalManageStudents } from './pages/principal/manage-students/manage-students';
import { ManageTeachers } from './pages/principal/manage-teachers/manage-teachers';
import { MarksEntry } from './pages/principal/marks-entry/marks-entry';
import { MonthlyReport } from './pages/principal/monthly-report/monthly-report';
import { PerformanceReports } from './pages/principal/performance-reports/performance-reports';
import { ProgressReports } from './pages/principal/progress-reports/progress-reports';
import { PublishAnnouncement } from './pages/principal/publish-announcement/publish-announcement';
import { RoleManage } from './pages/principal/role-manage/role-manage';
import { RecieptInvoice } from './pages/principal/reciept-invoice/reciept-invoice';
import { PendingDue } from './pages/principal/pending-due/pending-due';

/** Teacher */
import { Dashboard as TeacherDashboard } from './pages/teacher/dashboard/dashboard';
import { AutoGrading } from './pages/teacher/auto-grading/auto-grading';
import { ClassAttendanceReports } from './pages/teacher/class-attendance-reports/class-attendance-reports';
import { CreateExamPaper } from './pages/teacher/create-exam-paper/create-exam-paper';
import { CreateQuizzes } from './pages/teacher/create-quizzes/create-quizzes';
import { EnterMarks } from './pages/teacher/enter-marks/enter-marks';
import { GenerateGradeReports } from './pages/teacher/generate-grade-reports/generate-grade-reports';
import { GradeAssignment } from './pages/teacher/grade-assignment/grade-assignment';
import { ManageCourses } from './pages/teacher/manage-courses/manage-courses';
import { ManageStudents as TeacherManageStudents } from './pages/teacher/manage-students/manage-students';
import { MarkDailyAttendance } from './pages/teacher/mark-daily-attendance/mark-daily-attendance';
import { PostClassAnnouncements } from './pages/teacher/post-class-announcements/post-class-announcements';
import { ReviewResults } from './pages/teacher/review-results/review-results';
import { TrackStudentProgress } from './pages/teacher/track-student-progress/track-student-progress';
import { UploadAssignment } from './pages/teacher/upload-assignment/upload-assignment';
import { UploadMaterials } from './pages/teacher/upload-materials/upload-materials';
import { ViewAssignedClasses } from './pages/teacher/view-assigned-classes/view-assigned-classes';
import { ViewNotices } from './pages/teacher/view-notices/view-notices';
import { ViewStudentSubmission } from './pages/teacher/view-student-submission/view-student-submission';

/** Student */
import { Dashboard as StudentDashboard } from './pages/student/dashboard/dashboard';
import { AccessResources } from './pages/student/access-resources/access-resources';
import { CheckGrades } from './pages/student/check-grades/check-grades';
import { ClassTimetable } from './pages/student/class-timetable/class-timetable';
import { DownloadReportCards } from './pages/student/download-report-cards/download-report-cards';
import { ExamSchedules } from './pages/student/exam-schedules/exam-schedules';
import { MonthlySummary } from './pages/student/monthly-summary/monthly-summary';
import { MyAttendanceReport } from './pages/student/my-attendance-report/my-attendance-report';
import { ParentDetails } from './pages/student/parent-details/parent-details';
import { SchoolAnnouncements } from './pages/student/school-announcements/school-announcements';
import { SubmitWork } from './pages/student/submit-work/submit-work';
import { TeachersAndSubjects } from './pages/student/teachers-and-subjects/teachers-and-subjects';
import { TrackLearningProgress } from './pages/student/track-learning-progress/track-learning-progress';
import { UpcomingExams } from './pages/student/upcoming-exams/upcoming-exams';
import { UpdateDetails } from './pages/student/update-details/update-details';
import { ViewAssignments } from './pages/student/view-assignments/view-assignments';
import { ViewCourses } from './pages/student/view-courses/view-courses';
import { ViewEnrolledClasses } from './pages/student/view-enrolled-classes/view-enrolled-classes';
import { ViewMarks } from './pages/student/view-marks/view-marks';
import { PersonalInformation } from './pages/student/personal-information/personal-information';
import { UpcomingEvents } from './pages/student/upcoming-events/upcoming-events';
import { Login } from './auth/login/login';
import { PrincipalGuard } from './core/guards/principal-guard';
import { TeacherGuard } from './core/guards/teacher-guard';
import { StudentGuard } from './core/guards/student-guard';
import { Classrooms } from './pages/principal/classrooms/classrooms';
import { ManageSubjects } from './pages/principal/manage-subjects/manage-subjects';
import { ManageTimeTable } from './pages/principal/manage-time-table/manage-time-table';
import { ManageLeaves as PrincipalManageLeaves } from './pages/principal/manage-leaves/manage-leaves';
import { ManageLeaves as TeacherManageLeaves } from './pages/teacher/manage-leaves/manage-leaves';

export const routes: Routes = [
  { path: 'login', component: Login },
  /** Principal area */
  {
    path: 'principal',
    component: PrincipalLayout,
    canActivate: [PrincipalGuard],
    children: [
      { path: 'dashboard', component: PrincipalDashboard },
      { path: 'assignments', component: Assignments },
      { path: 'classrooms', component: Classrooms },
      { path: 'automated-results', component: AutomatedResults },
      { path: 'class-wise-summary', component: ClassWiseSummary },
      { path: 'collect-fees', component: CollectFees },
      { path: 'course-material', component: CourseMaterial },
      { path: 'create-notice', component: CreateNotice },
      { path: 'daily-attendance', component: DailyAttendance },
      { path: 'manage-time-table', component: ManageTimeTable },
      { path: 'event-calendar', component: EventCalendar },
      { path: 'exam-scheduling', component: ExamScheduling },
      { path: 'fee-structures', component: FeeStructures },
      { path: 'manage-students', component: PrincipalManageStudents },
      { path: 'manage-teachers', component: ManageTeachers },
      { path: 'manage-subjects', component: ManageSubjects },
      { path: 'manage-leaves', component: PrincipalManageLeaves },
      { path: 'marks-entry', component: MarksEntry },
      { path: 'monthly-report', component: MonthlyReport },
      { path: 'pending-due', component: PendingDue },
      { path: 'performance-reports', component: PerformanceReports },
      { path: 'progress-reports', component: ProgressReports },
      { path: 'publish-announcement', component: PublishAnnouncement },
      { path: 'receipt-invoice', component: RecieptInvoice },
      { path: 'role-manage', component: RoleManage },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  /** Teacher area */
  {
    path: 'teacher',
    component: TeacherLayout,
    canActivate: [TeacherGuard],
    children: [
      { path: 'dashboard', component: TeacherDashboard },
      { path: 'view-assigned-classes', component: ViewAssignedClasses },
      { path: 'manage-students', component: TeacherManageStudents },
      { path: 'mark-daily-attendance', component: MarkDailyAttendance },
      { path: 'class-attendance-reports', component: ClassAttendanceReports },
      { path: 'create-exam-paper', component: CreateExamPaper },
      { path: 'enter-marks', component: EnterMarks },
      { path: 'generate-grade-reports', component: GenerateGradeReports },
      { path: 'upload-assignment', component: UploadAssignment },
      { path: 'view-student-submission', component: ViewStudentSubmission },
      { path: 'grade-assignment', component: GradeAssignment },
      { path: 'manage-leaves', component: TeacherManageLeaves },
      { path: 'create-quizzes', component: CreateQuizzes },
      { path: 'auto-grading', component: AutoGrading },
      { path: 'review-results', component: ReviewResults },
      { path: 'manage-courses', component: ManageCourses },
      { path: 'upload-materials', component: UploadMaterials },
      { path: 'track-student-progress', component: TrackStudentProgress },
      { path: 'view-notices', component: ViewNotices },
      { path: 'post-class-announcements', component: PostClassAnnouncements },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  /** Student area */
  {
    path: 'student',
    component: StudentLayout,
    canActivate: [StudentGuard],
    children: [
      { path: 'dashboard', component: StudentDashboard },
      { path: 'personal-information', component: PersonalInformation },
      { path: 'update-details', component: UpdateDetails },
      { path: 'parent-details', component: ParentDetails },
      { path: 'view-enrolled-classes', component: ViewEnrolledClasses },
      { path: 'class-timetable', component: ClassTimetable },
      { path: 'teachers-and-subjects', component: TeachersAndSubjects },
      { path: 'my-attendance-report', component: MyAttendanceReport },
      { path: 'monthly-summary', component: MonthlySummary },
      { path: 'view-marks', component: ViewMarks },
      { path: 'download-report-cards', component: DownloadReportCards },
      { path: 'upcoming-exams', component: UpcomingExams },
      { path: 'view-assignments', component: ViewAssignments },
      { path: 'submit-work', component: SubmitWork },
      { path: 'check-grades', component: CheckGrades },
      { path: 'view-courses', component: ViewCourses },
      { path: 'access-resources', component: AccessResources },
      { path: 'track-learning-progress', component: TrackLearningProgress },
      { path: 'school-announcements', component: SchoolAnnouncements },
      { path: 'exam-schedules', component: ExamSchedules },
      { path: 'upcoming-events', component: UpcomingEvents },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
