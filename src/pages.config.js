import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import MemberPortal from './pages/MemberPortal.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentCancel from './pages/PaymentCancel.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import MembersList from './pages/admin/members/List.jsx';
import MemberDetail from './pages/admin/members/Detail.jsx';
import MemberCreate from './pages/admin/members/Create.jsx';
import MemberEdit from './pages/admin/members/Edit.jsx';
import GroupsList from './pages/admin/groups/List.jsx';
import GroupCreate from './pages/admin/groups/Create.jsx';
import GroupEdit from './pages/admin/groups/Edit.jsx';
import MinistriesList from './pages/admin/ministries/List.jsx';
import MinistryCreate from './pages/admin/ministries/Create.jsx';
import MinistryEdit from './pages/admin/ministries/Edit.jsx';
import EventsList from './pages/admin/events/List.jsx';
import EventCreate from './pages/admin/events/Create.jsx';
import EventEdit from './pages/admin/events/Edit.jsx';
import DonationsList from './pages/admin/donations/List.jsx';
import DonationCreate from './pages/admin/donations/Create.jsx';
import CampaignsList from './pages/admin/campaigns/List.jsx';
import CampaignCreate from './pages/admin/campaigns/Create.jsx';
import CampaignEdit from './pages/admin/campaigns/Edit.jsx';
import PrayersList from './pages/admin/prayers/List.jsx';
import CommunicationsList from './pages/admin/communications/List.jsx';
import CommunicationCreate from './pages/admin/communications/Create.jsx';
import Settings from './pages/admin/Settings.jsx';
export const PAGES = {
  Home,
  portal: MemberPortal,
  login: Login,
  register: Register,
  'payment/success': PaymentSuccess,
  'payment/cancel': PaymentCancel,
};
export const ADMINS = {
  Dashboard,
  members: MembersList,
  'members/create': MemberCreate,
  'members/:id': MemberDetail,
  'members/:id/edit': MemberEdit,
  groups: GroupsList,
  'groups/create': GroupCreate,
  'groups/:id/edit': GroupEdit,
  ministries: MinistriesList,
  'ministries/create': MinistryCreate,
  'ministries/:id/edit': MinistryEdit,
  events: EventsList,
  'events/create': EventCreate,
  'events/:id/edit': EventEdit,
  donations: DonationsList,
  'donations/create': DonationCreate,
  campaigns: CampaignsList,
  'campaigns/create': CampaignCreate,
  'campaigns/:id/edit': CampaignEdit,
  prayers: PrayersList,
  communications: CommunicationsList,
  'communications/create': CommunicationCreate,
  settings: Settings,
};
export const PRIVATE_PAGES = {};
export const pagesConfig = {
  privatePages: PRIVATE_PAGES,
  mainPage: 'Home',
  Pages: PAGES,
  Layout: Layout,
  Admins: ADMINS,
  adminMainPage: 'Dashboard',
  AdminLayout: AdminLayout,
};