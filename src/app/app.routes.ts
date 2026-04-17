import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StudentsPageComponent } from './pages/students-page/students-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authGuard } from './services/auth/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { RoleKeys } from './domain-models/Role';
import { TeacherLayoutComponent } from './pages/teacher-layout/teacher-layout.component';
import { TeacherMainMenuComponent } from './pages/teacher-main-menu/teacher-main-menu.component';
import { TeacherReportSearchComponent } from './pages/teacher-report-search/teacher-report-search.component';
import { TeacherReportMainStudentsComponent } from './pages/teacher-report-main-students/teacher-report-main-students.component';
import { TeacherReportGroupComponent } from './pages/teacher-report-group/teacher-report-group.component';
import { TeacherReportAllYearsComponent } from './pages/teacher-report-all-years/teacher-report-all-years.component';
import { TeacherTableSearchComponent } from './pages/teacher-table-search/teacher-table-search.component';
import { TeacherTableComponent } from './pages/teacher-table/teacher-table.component';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'search', redirectTo: 'search/students', pathMatch: 'full'},
    {
        path: 'search', component: SearchPageComponent, 
        canActivate: [authGuard],
        data: { "requiredRoles": [RoleKeys.ADMIN] },
        children: [
            { 
                path: 'students', component: StudentsPageComponent, 
                canActivate: [authGuard],
                data: { "requiredRoles": [RoleKeys.ADMIN] }
            }
        ]
    },
    {
        path: 'teacher',
        component: TeacherLayoutComponent,
        canActivate: [authGuard],
        data: { requiredRoles: [RoleKeys.TEACHER] },
        children: [
            { path: '', component: TeacherMainMenuComponent },
            { path: 'report-search', component: TeacherReportSearchComponent },
            {
                path: 'reports',
                children: [
                    { path: 'students', component: TeacherReportMainStudentsComponent },
                    { path: 'group', component: TeacherReportGroupComponent },
                    { path: 'all-years', component: TeacherReportAllYearsComponent }
                ]
            },
            { path: 'table-search', component: TeacherTableSearchComponent },
            { path: 'table', component: TeacherTableComponent }
        ]
    },
    { path: 'access-denied', component: AccessDeniedComponent }
];
