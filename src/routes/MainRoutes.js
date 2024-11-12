import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Employee = Loadable(lazy(() => import('views/EmployeeManagement')));
const Orders = Loadable(lazy(() => import('views/OrderManagement')));
const Purchase = Loadable(lazy(() => import('views/PurchaseManagement')));
const Products = Loadable(lazy(() => import('views/ProductManagement')));
const AddProduct = Loadable(lazy(() => import('views/AddProductPage/AddProductPage')));
const Reports = Loadable(lazy(() => import('views/Report')));
const Customers = Loadable(lazy(() => import('views/Customer')));
const Suppliers = Loadable(lazy(() => import('views/Supplier')));
const Category = Loadable(lazy(() => import('views/AddCategory')));
const Unit = Loadable(lazy(() => import('views/AddUnit')));
const AddOrder = Loadable(lazy(() => import('views/AddOrderPage/AddOrderPage')));
const CreateInvoice = Loadable(lazy(() => import('views/CreateInvoice/createInvoice')))
const AddPurchase = Loadable(lazy(() => import('views/AddPurchasePage/AddPurchasePage')));
const AddQuotation = Loadable(lazy(() => import('views/AddQuotationPage/AddQuotationPage')));
const ViewInvoice = Loadable(lazy(() => import('views/ViewInvoicePage/viewInvoicePage')))
const DownloadInvoice = Loadable(lazy(() => import('views/DownloadInvoicePage/downloadInvoicePage')))
const ViewPurchase = Loadable(lazy(() => import('views/PurchasePage/viewPurchasePage')))

// ==============================|| MAIN ROUTING ||============================== //

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
          path: 'orders',
          children: [
            {
              path: '',
              element: <Orders />
            },
            {
              path: 'download-invoice/:id',
              element: < DownloadInvoice />
            },
            {
              path: 'view-invoice/:id',
              element: < ViewInvoice />
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
                },
              ]
            }

          ]
        },
        {
          path: 'products',
          children: [
            {
              path: '',
              element: <Products />
            },
            {
              path: 'add-product',
              element: <AddProduct />
            },
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
              element: < ViewPurchase />
            },
            {
              path: 'add-purchase',
              element: <AddPurchase />
            },
          ]
        },
        {
          path: 'reports',
          children: [
            {
              path: '',
              element: <Reports />
            },
            {
              path: 'add-quotation',
              element: <AddQuotation />
            },
          ]
        },
        {
          path: 'suppliers',
          element: <Suppliers />
        },
        {
          path: 'customers',
          element: <Customers />
        },
        {
          path: 'category',
          element: <Category />
        },
        {
          path: 'unit',
          element: <Unit />
        },
       
      ]
    }
  ]
};

export default MainRoutes;
