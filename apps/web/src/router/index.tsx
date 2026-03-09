/**
 * 라우터 설정
 * - 모든 페이지 경로를 중앙에서 관리
 * - 새 페이지 추가 시 이 파일의 routes 배열에 추가
 * - Layout으로 감싸여 Header/Footer가 자동 적용
 */
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home/Home';
import Projects from '../pages/Projects/Projects';
import About from '../pages/About/About';
import PatchNotes from '../pages/PatchNotes/PatchNotes';
import Announcements from '../pages/Announcements/Announcements';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Callback from '../pages/Auth/Callback';
import Recruit from '../pages/Recruit/Recruit';
import RecruitAdmin from '../pages/Recruit/RecruitAdmin';
import ProjectOverview from '../pages/Internal/ProjectOverview';
import NotFound from '../pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/projects',
    element: <Layout><Projects /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><About /></Layout>,
  },
  {
    path: '/patchnotes',
    element: <Layout><PatchNotes /></Layout>,
  },
  {
    path: '/announcements',
    element: <Layout><Announcements /></Layout>,
  },
  {
    path: '/recruit',
    element: <Layout><Recruit /></Layout>,
  },
  {
    path: '/recruit/admin',
    element: <Layout><RecruitAdmin /></Layout>,
  },
  {
    path: '/internal/overview',
    element: <Layout><ProjectOverview /></Layout>,
  },
  {
    path: '/auth/login',
    element: <Layout><Login /></Layout>,
  },
  {
    path: '/auth/register',
    element: <Layout><Register /></Layout>,
  },
  {
    path: '/auth/callback',
    element: <Layout><Callback /></Layout>,
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);
