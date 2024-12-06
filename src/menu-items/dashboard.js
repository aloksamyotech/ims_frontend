import {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconStackPop,
  IconChecklist,
  IconShoppingCart,
  IconSettingsAutomation,
  IconSettings,
  IconUser,
  IconCategory,
  IconBrandUnity,
  IconAccessible,
  IconUserPlus
} from '@tabler/icons';

const icons = {
  IconHome,
  IconUsers,
  IconBriefcase,
  IconStackPop,
  IconChecklist,
  IconShoppingCart,
  IconSettingsAutomation,
  IconSettings,
  IconUser,
  IconCategory,
  IconBrandUnity,
  IconAccessible,
  IconUserPlus
};
import AdminDashboard from 'views/dashboard/Default';
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

// let imsToken = localStorage.getItem("imsToken")
// imsToken = JSON.parse(imsToken)
// const payload = parseJWT(imsToken)
// console.log("payload", payload);

const role = (localStorage.getItem('role'));

const dashboard = {
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
      url: '/dashboard/users',
      icon: icons.IconAccessible,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Products',
      type: 'item',
      url: '/dashboard/products',
      icon: icons.IconStackPop,
      breadcrumbs: false
    },
    {
      id: '03',
      title: 'Orders',
      type: 'item',
      url: '/dashboard/orders',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },
    {
      id: '04',
      title: 'Purchases',
      type: 'item',
      url: '/dashboard/purchases',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: '05',
      title: 'Clients',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: '06',
          title: 'Suppliers',
          type: 'item',
          url: '/dashboard/suppliers',
          icon: icons.IconUserPlus,
          breadcrumbs: false
        },
        {
          id: '07',
          title: 'Customers',
          type: 'item',
          url: '/dashboard/customers',
          icon: icons.IconUserPlus,
          breadcrumbs: false
        }
      ]
    },
    {
      id: '08',
      title: 'Category',
      type: 'item',
      url: '/dashboard/category',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: '09',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.IconChecklist,
      breadcrumbs: false
    },
    {
      id: '10',
      title: 'Profile',
      type: 'item',
      url: '/dashboard/profile',
      icon: icons.IconUser,
      breadcrumbs: false
    },
  ]
};

const Admindashboard = {
  title: 'Admin Dashboard Menu',
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
      title: 'Employee Management',
      type: 'item',
      url: '/dashboard/employee',
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
      icon: icons.IconCategory,
      breadcrumbs: false
     },
     {
     id: '04',
     title: 'Company',
     type: 'item',
     url: '/dashboard/company',
     icon: icons.IconCategory,
     breadcrumbs: false
     },
  ]
}

export default (role === 'user') ? dashboard : Admindashboard;
