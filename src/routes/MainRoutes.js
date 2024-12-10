import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Employee = Loadable(lazy(() => import('views/EmployeeManagement')));
const Orders = Loadable(lazy(() => import('views/OrderManagement')));
const Purchase = Loadable(lazy(() => import('views/PurchaseManagement')));
const Products = Loadable(lazy(() => import('views/ProductManagement')));
const Reports = Loadable(lazy(() => import('views/Report')));
const Customers = Loadable(lazy(() => import('views/Customer')));
const Suppliers = Loadable(lazy(() => import('views/Supplier')));
const Category = Loadable(lazy(() => import('views/AddCategory')));
const Unit = Loadable(lazy(() => import('views/AddUnit')));
const Profile = Loadable(lazy(() => import('views/Profile')));
const AddOrder = Loadable(lazy(() => import('views/AddOrderPage/AddOrderPage')));
const CreateInvoice = Loadable(lazy(() => import('views/CreateInvoice/createInvoice')));
const AddPurchase = Loadable(lazy(() => import('views/AddPurchasePage/AddPurchasePage')));
const ViewOrder = Loadable(lazy(() => import('views/ViewOrderPage/viewOrderPage')));
const DownloadInvoice = Loadable(lazy(() => import('views/DownloadInvoicePage/downloadInvoicePage')));
const ViewPurchase = Loadable(lazy(() => import('views/PurchasePage/viewPurchasePage')));
const ViewProduct = Loadable(lazy(() => import('views/ViewProductPage/viewProductPage')));
const ViewCustomer = Loadable(lazy(() => import('views/ViewCustomerPage/viewCustomerPage')));
const ViewSupplier = Loadable(lazy(() => import('views/ViewSupplierPage/viewSupplierPage')));
const AdminDashboard = Loadable(lazy(() => import('views/AdminComponent/DefaultDashboard/DefaultAdmin')));
const AdminReports = Loadable(lazy(() => import('views/AdminComponent/ReportManagement')));
const Subscription = Loadable(lazy(() => import('views/AdminComponent/Subscription')));
const Company = Loadable(lazy(() => import('views/AdminComponent/Company')));

// ==============================|| MAIN ROUTING ||============================== //
const role = (localStorage.getItem('role'));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
        {
          path: 'users',
          element: <Employee />
        },
        {
          path: 'products',
          children: [
            {
              path: '',
              element: <Products />
            },
            {
              path: 'view-product/:id',
              element: <ViewProduct />
            }
          ]
        },
        {
          path: 'orders',
          children: [
            {
              path: '',
              element: <Orders />
            },
            {
              path: 'download-invoice/:id',
              element: <DownloadInvoice />
            },
            {
              path: 'view-order/:id',
              element: <ViewOrder />
            },
            {
              path: 'add-order',
              children: [
                {
                  path: '',
                  element: <AddOrder />
                },
                {
                  path: 'create-invoice',
                  element: <CreateInvoice />
                }
              ]
            }
          ]
        },
        {
          path: 'purchases',
          children: [
            {
              path: '',
              element: <Purchase />
            },
            {
              path: 'view-purchase/:id',
              element: <ViewPurchase />
            },
            {
              path: 'add-purchase',
              element: <AddPurchase />
            }
          ]
        },
        {
          path: 'reports',
          element: <Reports />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'suppliers',
          children: [
            {
              path: '',
              element: <Suppliers />
            },
            {
              path: 'view-supplier/:id',
              element: <ViewSupplier />
            }
          ]
        },
        {
          path: 'customers',
          children: [
            {
              path: '',
              element: <Customers />
            },
            {
              path: 'view-customer/:id',
              element: <ViewCustomer />
            }
          ]
        },
        {
          path: 'category',
          element: <Category />
        },
        {
          path: 'admin-reports',
          element: <AdminReports />
        },
        {
          path: 'subscription',
          element: <Subscription />
        },
        {
          path: 'company',
          element: <Company />
        }
      ]
    }
  ]
};

const AdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'admin',
          element: <AdminDashboard />
        },
        {
          path: 'company',
         element: <Company />
         },
         {
          path: 'admin-report',
          element: <AdminReports />
        },
        {
          path: 'subscription',
          element: <Subscription />
        }
      ]
    },
  ]
};

const render = (role === 'user') ? MainRoutes : AdminRoutes;
export default render;
