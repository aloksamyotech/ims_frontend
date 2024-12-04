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
      title: 'Classification',
      type: 'collapse',
      icon: icons.IconSettingsAutomation,
      children: [
        {
          id: '09',
          title: 'Category',
          type: 'item',
          url: '/dashboard/category',
          icon: icons.IconCategory,
          breadcrumbs: false
        },
        // {
        //   id: '10',
        //   title: 'Unit',
        //   type: 'item',
        //   url: '/dashboard/unit',
        //   icon: icons.IconBrandUnity,
        //   breadcrumbs: false
        // }
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
    {
      id: '12',
      title: 'Profile',
      type: 'item',
      url: '/dashboard/profile',
      icon: icons.IconUser,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
