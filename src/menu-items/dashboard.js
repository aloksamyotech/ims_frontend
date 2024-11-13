import {
  IconHome,
  IconBoxMultiple,
  IconBriefcase,
  IconBoxModel,
  IconChecklist,
  IconShoppingCart,
  IconSettingsAutomation,
  IconSettings 
} from '@tabler/icons';

const icons = {
  IconHome,
  IconBoxMultiple,
  IconBriefcase,
  IconBoxModel,
  IconChecklist,
  IconShoppingCart,
  IconSettingsAutomation,
  IconSettings 
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //


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
      icon: icons.IconBoxModel,
      breadcrumbs: false
    },
    {
      id: '02',
      title: 'Products',
      type: 'item',
      url: '/dashboard/products',
      icon: icons.IconBoxModel,
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
      icon: icons.IconBoxMultiple,
      children: [
        {
          id: '06',
          title: 'Suppliers',
          type: 'item',
          url: '/dashboard/suppliers',
          icon: icons.IconBoxMultiple,
          breadcrumbs: false
        },
        {
          id: '07',
          title: 'Customers',
          type: 'item',
          url: '/dashboard/customers',
          icon: icons.IconBoxMultiple,
          breadcrumbs: false
        }
      ]
    },
    {
      id: '08',
      title: 'Classification',
      type: 'collapse',
      icon: icons.IconSettingsAutomation,
      children: [
        {
          id: '09',
          title: 'Category',
          type: 'item',
          url: '/dashboard/category',
          icon: icons.IconSettingsAutomation,
          breadcrumbs: false
        },
        {
          id: '10',
          title: 'Unit',
          type: 'item',
          url: '/dashboard/unit',
          icon: icons.IconSettingsAutomation,
          breadcrumbs: false
        },
      ]
    },
    {
      id: '11',
      title: 'Reports',
      type: 'item',
      url: '/dashboard/reports',
      icon: icons.IconChecklist,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
