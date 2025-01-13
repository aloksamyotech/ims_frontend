import {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconStackPop,
  IconChecklist,
  IconShoppingCart,
  IconMailbox,
  IconSettingsAutomation,
  IconSettings,
  IconUser,
  IconCategory,
  IconBrandUnity,
  IconAccessible,
  IconUserPlus
} from '@tabler/icons';
import InsightsIcon from '@mui/icons-material/Insights';
import AssessmentIcon from '@mui/icons-material/Assessment';

import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const icons = {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconStackPop,
  IconChecklist,
  IconShoppingCart,
  IconMailbox,
  IconSettingsAutomation,
  IconSettings,
  IconUser,
  IconCategory,
  IconBrandUnity,
  IconAccessible,
  IconUserPlus,
  TrendingDownIcon,
  MonetizationOnIcon,
  InsightsIcon,
  AssessmentIcon
};
import AdminDashboard from 'views/dashboard/Default';
// ==============================|| DASHBOARD MENU ITEMS ||============================== //
const role = localStorage.getItem('role');
const permissions = (localStorage.getItem('permissions') || '').split(',');

export const dashboard = {
  title: <span style={{ fontWeight: 'bold' }}> Dashboard-Menu</span>,
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Employee Management',
      type: 'item',
      url: '/dashboard/employee',
      icon: icons.IconAccessible,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Statistics',
      type: 'item',
      url: '/dashboard/statistics',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Products',
      type: 'item',
      url: '/dashboard/products',
      icon: icons.IconStackPop,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Low-Stocks',
      type: 'item',
      url: '/dashboard/product-report',
      icon: icons.TrendingDownIcon,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Financial Summary',
      type: 'item',
      url: '/dashboard/financial',
      icon: icons.MonetizationOnIcon,
      breadcrumbs: false
    },
    {
      id: '06',
      title: 'Orders',
      type: 'item',
      url: '/dashboard/orders',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },
    {
      id: '07',
      title: 'Purchases',
      type: 'item',
      url: '/dashboard/purchases',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: '08',
      title: 'Clients',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: '09',
          title: 'Suppliers',
          type: 'item',
          url: '/dashboard/suppliers',
          icon: icons.IconUserPlus,
          breadcrumbs: false
        },
        {
          id: '10',
          title: 'Customers',
          type: 'item',
          url: '/dashboard/customers',
          icon: icons.IconUserPlus,
          breadcrumbs: false
        }
      ]
    },
    {
      id: '11',
      title: 'Category',
      type: 'item',
      url: '/dashboard/category',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: '12',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.IconChecklist,
      breadcrumbs: false
    },
    {
      id: '13',
      title: 'Subscription',
      type: 'item',
      url: '/dashboard/user-subscription',
      icon: icons.IconMailbox,
      breadcrumbs: false
    },
    {
      id: '14',
      title: 'Profile',
      type: 'item',
      url: '/dashboard/profile',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

const Admindashboard = {
  title: <span style={{ fontWeight: 'bold' }}>Admin Dashboard-Menu</span>,
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/admin',
      icon: icons.IconHome,
      breadcrumbs: false
    },
    {
      id: '01',
      title: 'Company Management',
      type: 'item',
      url: '/dashboard/company',
      icon: icons.IconAccessible,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/admin-report',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Subscription',
      type: 'item',
      url: '/dashboard/subscription',
      icon: icons.IconMailbox,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Profile',
      type: 'item',
      url: '/dashboard/admin-profile',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export const filterMenuItems = (menuItems, permissions) => {
  return menuItems.filter((item) => permissions.includes(item.id));
};

let finalMenu = [];

if (role === 'user') {
  finalMenu = dashboard;
} else if (role === 'employee') {
  finalMenu = {
    ...dashboard,
    children: filterMenuItems(dashboard.children, permissions)
  };
} else if (role === 'admin') {
  finalMenu = Admindashboard;
}

export default finalMenu;
