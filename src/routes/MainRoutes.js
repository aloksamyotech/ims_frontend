import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './protectedRoute';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Employee = Loadable(lazy(() => import('views/EmployeeManagement')));
const Orders = Loadable(lazy(() => import('views/OrderManagement')));
const Purchase = Loadable(lazy(() => import('views/PurchaseManagement')));
const Products = Loadable(lazy(() => import('views/ProductManagement')));
const Reports = Loadable(lazy(() => import('views/Report')));
const Customers = Loadable(lazy(() => import('views/Customer')));
const Suppliers = Loadable(lazy(() => import('views/Supplier')));
const Category = Loadable(lazy(() => import('views/AddCategory')));
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
const UserSubscription = Loadable(lazy(() => import('views/UserSubscription')));
const AdminProfile = Loadable(lazy(() => import('views/AdminComponent/AdminProfile')));
const ViewCompany = Loadable(lazy(() => import('views/AdminComponent/ViewCompany')));
const LowStock = Loadable(lazy(() => import('views/LowStock')));
const FinancialSummary = Loadable(lazy(() => import('views/Financial Summary')));
const Statistics = Loadable(lazy(() => import('views/Statistics')));
const ViewEmployee = Loadable(lazy(() => import('views/ViewEmployeePermissions')));
const AiChatbot = Loadable(lazy(() => import('views/AiChatbot')));

// ==============================|| MAIN ROUTING ||============================== //
const role = localStorage.getItem('role');

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute requiredPermission="default">
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute requiredPermission="default">
              <DashboardDefault />
            </ProtectedRoute>
          )
        },
        {
          path: 'statistics',
          element: (
            <ProtectedRoute requiredPermission="01">
              <Statistics />
            </ProtectedRoute>
          )
        },
        {
          path: 'employee',
          children: [
            {
              path: '',
              element: (
                <ProtectedRoute>
                  <Employee />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-employee/:id',
              element: (
                <ProtectedRoute>
                  <ViewEmployee />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'products',
          children: [
            {
              path: '',
              element: (
                <ProtectedRoute requiredPermission="03">
                  <Products />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-product/:id',
              element: (
                <ProtectedRoute requiredPermission="03">
                  <ViewProduct />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'product-report',
          element: (
            <ProtectedRoute requiredPermission="09">
              <LowStock />
            </ProtectedRoute>
          )
        },
        {
          path: 'financial',
          element: (
            <ProtectedRoute requiredPermission="10">
              <FinancialSummary />
            </ProtectedRoute>
          )
        },
        {
          path: 'orders',
          children: [
            {
              path: '',
              element: (
                <ProtectedRoute requiredPermission="07">
                  <Orders />
                </ProtectedRoute>
              )
            },
            {
              path: 'download-invoice/:id',
              element: (
                <ProtectedRoute requiredPermission="07">
                  <DownloadInvoice />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-order/:id',
              element: (
                <ProtectedRoute requiredPermission="07">
                  <ViewOrder />
                </ProtectedRoute>
              )
            },
            {
              path: 'add-order',
              children: [
                {
                  path: '',
                  element: (
                    <ProtectedRoute requiredPermission="07">
                      <AddOrder />
                    </ProtectedRoute>
                  )
                },
                {
                  path: 'create-invoice',
                  element: (
                    <ProtectedRoute requiredPermission="07">
                      <CreateInvoice />
                    </ProtectedRoute>
                  )
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
              element: (
                <ProtectedRoute requiredPermission="08">
                  <Purchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-purchase/:id',
              element: (
                <ProtectedRoute requiredPermission="08">
                  <ViewPurchase />
                </ProtectedRoute>
              )
            },
            {
              path: 'add-purchase',
              element: (
                <ProtectedRoute requiredPermission="08">
                  <AddPurchase />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'reports',
          element: (
            <ProtectedRoute requiredPermission="12">
              <Reports />
            </ProtectedRoute>
          )
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        },
        {
          path: 'suppliers',
          children: [
            {
              path: '',
              element: (
                <ProtectedRoute requiredPermission="05">
                  <Suppliers />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-supplier/:id',
              element: (
                <ProtectedRoute requiredPermission="05">
                  <ViewSupplier />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'customers',
          children: [
            {
              path: '',
              element: (
                <ProtectedRoute requiredPermission="06">
                  <Customers />
                </ProtectedRoute>
              )
            },
            {
              path: 'view-customer/:id',
              element: (
                <ProtectedRoute requiredPermission="06">
                  <ViewCustomer />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'category',
          element: (
            <ProtectedRoute requiredPermission="02">
              <Category />
            </ProtectedRoute>
          )
        },
        {
          path: 'user-subscription',
          element: (
            <ProtectedRoute>
              <UserSubscription />
            </ProtectedRoute>
          )
        },
        {
          path: 'ai',
          element: (
            <ProtectedRoute>
              <AiChatbot />
            </ProtectedRoute>
          )
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
          path: 'admin-report',
          element: <AdminReports />
        },
        {
          path: 'subscription',
          element: <Subscription />
        },
        {
          path: 'admin-profile',
          element: <AdminProfile />
        },
        {
          path: 'company',
          children: [
            {
              path: '',
              element: <Company />
            },
            {
              path: 'view-company/:id',
              element: <ViewCompany />
            }
          ]
        }
      ]
    }
  ]
};

const render = role === 'admin' ? AdminRoutes : MainRoutes;
export default render;
