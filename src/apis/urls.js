
export const urls = {
  base: 'https://ims.samyotech.in/api',
  // base: 'http://localhost:4200/api',
  unit: {
    add: '/unit/save/',
    delete: '/unit/deleteById/:id',
    update: '/unit/update/:id',
    fetch: '/unit/fetch/',
  },
  category: {
    add: '/category/save/',
    delete: '/category/deleteById/:id',
    update: '/category/update/:id',
    fetch: '/category/fetch/',
  },
  supplier: {
    add: '/supplier/save/',
    delete: '/supplier/deleteById/:id',
    update: '/supplier/update/:id',
    fetch: '/supplier/fetch/',
    count: '/supplier/count/',
    fetchbyid: '/supplier/fetchById/:id'
  },
  customer: {
    add: '/customer/save/',
    delete: '/customer/deleteById/:id',
    update: '/customer/update/:id',
    fetch: '/customer/fetch/',
    count: '/customer/count/',
    fetchbyid: '/customer/fetchById/:id'
  },
  employee: {
    add: '/employee/save/',
    delete: '/employee/deleteById/:id',
    update: '/employee/update/:id',
    fetch: '/employee/fetch/',
    count: '/employee/count/',
    fetchbyid: '/employee/fetchById/:id'
  },
  product: {
    add: '/product/save/',
    delete: '/product/deleteById/:id',
    update: '/product/update/:id',
    fetch: '/product/fetch/',
    lowstock: '/product/lowstock/',
    quantityalert:'/product/quantityalert/',
    fetchbyid: '/product/fetchById/:id'
  },
  user: {
    delete: '/user/deleteById/:id',
    update: '/user/update/:id',
    fetch: '/user/fetch/',
    add: '/user/save/',
    count: '/user/count/',
  },
  order: {
    add: '/order/save/',
    delete: '/order/deleteById/:id',
    fetch: '/order/fetch/',
    fetchbyid: '/order/fetchById/:id',
    count: '/order/count/',
    totalprofit: '/order/total-profit',
    totalamount: '/order/total-amount/',
    totalquantity: '/order/total-quantity/',
    totalsales: '/order/total-sales',
    soldquantitybydate: '/order/sold-quantity-date',
    soldsalesbydate: '/order/sold-sales-date',
    topcategory: '/order/total-category',
  },
  purchase: {
    add: '/purchase/save/',
    delete: '/purchase/deleteById/:id',
    fetch: '/purchase/fetch/',
    fetchbyid: '/purchase/fetchById/:id',
    count: '/purchase/count/',
  },
  report: {
    getSupplierProductReport: '/purchase/fetchSupplierProductReport',
    getCustomerProductReport: '/order/fetchCustomerProductReport',
  },
  admin: {
    fetch: '/admin/fetch/',
    update: '/admin/update/:id',
  },
  subscription: {
    add: '/subscription/save/',
    delete: '/subscription/deleteById/:id',
    fetch: '/subscription/fetch/',
    update: '/subscription/update/:id',
    count: '/subscription/count/',
  },
};


