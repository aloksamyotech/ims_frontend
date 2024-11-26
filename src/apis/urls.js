export const urls = {
  base: 'http://localhost:4200',
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
  },
  customer: {
    add: '/customer/save/',
    delete: '/customer/deleteById/:id',
    update: '/customer/update/:id',
    fetch: '/customer/fetch/',
    count: '/customer/count/',
  },
  product: {
    add: '/product/save/',
    delete: '/product/deleteById/:id',
    update: '/product/update/:id',
    fetch: '/product/fetch/',
    lowstock: '/product/lowstock/',
  },
  user: {
    delete: '/user/deleteById/:id',
    update: '/user/update/:id',
    fetch: '/user/fetch/',
  },
  order: {
    add: '/order/save/',
    delete: '/order/deleteById/:id',
    fetch: '/order/fetch/',
    count: '/order/count/',
    totalamount: '/order/total-amount/',
    totalquantity: '/order/total-quantity/',
  },
  purchase: {
    add: '/purchase/save/',
    delete: '/purchase/deleteById/:id',
    fetch: '/purchase/fetch/',
    count: '/purchase/count/',
  },
  report: {
    getSupplierProductReport: '/purchase/fetchSupplierProductReport',
    getCustomerProductReport: '/order/fetchCustomerProductReport',
  },
  admin: {
    fetch: '/admin/fetch/',
    update: '/admin/update/:id',
  }
};


