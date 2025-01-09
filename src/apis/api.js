import { deleteApi, addApi, fetchApi, updateEntity } from './common.js';
import { urls } from './urls.js';

// unit
export const deleteUnit = async (_id) => {
  return deleteApi(urls.unit.delete, _id);
};

export const fetchUnits = async () => {
  return fetchApi(urls.unit.fetch);
};

export const addUnit = async (newUnit) => {
  return addApi(urls.unit.add, newUnit);
};

export const updateUnits = async (updatedUnit) => {
  return updateEntity('unit', updatedUnit);
};

// category
export const deleteCategory = async (_id) => {
  return deleteApi(urls.category.delete, _id);
};

export const fetchCategories = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.category.fetch}?${queryString}`);
};

export const addCategory = async (newCategory) => {
  return addApi(urls.category.add, newCategory);
};

export const updateCategory = async (updatedCategory) => {
  return updateEntity('category', updatedCategory);
};

// supplier
export const deleteSupplier = async (_id) => {
  return deleteApi(urls.supplier.delete, _id);
};

export const fetchSuppliers = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.supplier.fetch}?${queryString}`);
};

export const addSupplier = async (newSupplier) => {
  return addApi(urls.supplier.add, newSupplier);
};

export const updateSupplier = async (updatedSupplier) => {
  return updateEntity('supplier', updatedSupplier);
};

export const countSuppliers = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.supplier.count}?${queryString}`);
};

export const fetchSupplierById = async (id) => {
  return fetchApi(`${urls.supplier.fetchbyid.replace(':id', id)}`);
};

// customer
export const deleteCustomer = async (_id) => {
  return deleteApi(urls.customer.delete, _id);
};

export const fetchCustomers = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.customer.fetch}?${queryString}`);
};

export const fetchCustomerById = async (id) => {
  return fetchApi(`${urls.customer.fetchbyid.replace(':id', id)}`);
};


export const addCustomer = async (newCustomer) => {
  return addApi(urls.customer.add, newCustomer);
};

export const updateCustomer = async (updatedCustomer) => {
  return updateEntity('customer', updatedCustomer);
};

export const countCustomers = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.customer.count}?${queryString}`);
};

//employee
export const deleteEmployee = async (_id) => {
  return deleteApi(urls.employee.delete, _id);
};

export const fetchEmployees = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.employee.fetch}?${queryString}`);
};

export const addEmployee = async (newEmployee) => {
  return addApi(urls.employee.add, newEmployee);
};

export const updateEmployee = async (updatedEmployee) => {
  return updateEntity('employee', updatedEmployee);
};

export const countEmployees = async () => {
  return fetchApi(urls.employee.count);
};

// product
export const deleteProduct = async (_id) => {
  return deleteApi(urls.product.delete, _id);
};

export const fetchProducts = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.product.fetch}?${queryString}`);
};

export const fetchProductById = async (id) => {
  return fetchApi(`${urls.product.fetchbyid.replace(':id', id)}`);
};

export const addProduct = async (newProduct) => {
  return addApi(urls.product.add, newProduct);
};


export const updateProduct = async (updatedProduct) => {
  return updateEntity('product', updatedProduct);
};

export const fetchLowStock = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.product.lowstock}?${queryString}`);
};

export const fetchQuantityAlert = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.product.quantityalert}?${queryString}`);
};

// user
export const deleteUser = async (_id) => {
  return deleteApi(urls.user.delete, _id);
};

export const fetchUsers = async () => {
  return fetchApi(urls.user.fetch);
};

export const updateUser = async (updatedUser) => {
  return updateEntity('user', updatedUser);
};

export const addUser = async (newUser) => {
  return addApi(urls.user.add, newUser);
};

export const countCompany = async () => {
  return fetchApi(urls.user.count);
};

// order
export const deleteOrder = async (_id) => {
  return deleteApi(urls.order.delete, _id);
};

export const fetchOrders = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.fetch}?${queryString}`);
};

export const addOrder = async (newOrder) => {
  return addApi(urls.order.add, newOrder);
};

export const countOrders = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.count}?${queryString}`);
};

export const totalSalesAmount = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.totalamount}?${queryString}`);
};

export const totalSoldQuantity = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.totalquantity}?${queryString}`);
};

export const totalSoldProfit = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.totalprofit}?${queryString}`);
};

export const getTotalSales = async () => {
  return fetchApi(urls.order.totalsales);
};

export const soldQuantityByDate = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.soldquantitybydate}?${queryString}`);
};

export const soldSalesByDate = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.soldsalesbydate}?${queryString}`);
};

export const getTopSellingCatgeory = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.order.topcategory}?${queryString}`);
};


// purchase
export const deletePurchase = async (_id) => {
  return deleteApi(urls.purchase.delete, _id);
};

export const fetchPurchases = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.purchase.fetch}?${queryString}`);
};

export const addPurchase = async (newPurchase) => {
  return addApi(urls.purchase.add, newPurchase);
};

export const countPurchases = async (queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  return fetchApi(`${urls.purchase.count}?${queryString}`);
};

//report
export const getSupplierProductReport = async () => {
  return fetchApi(urls.report.getSupplierProductReport);
};

export const getCustomerProductReport = async () => {
  return fetchApi(urls.report.getCustomerProductReport);
};

//admin
export const fetchAdmin = async () => {
  return fetchApi(urls.admin.fetch);
};

export const updateAdmin = async (updatedAdmin) => {
  return updateEntity('admin', updatedAdmin);
};

//subscription
export const deleteSubscription = async (_id) => {
  return deleteApi(urls.subscription.delete, _id);
};

export const fetchSubscription = async () => {
  return fetchApi(urls.subscription.fetch);
};

export const addSubscription = async (newSubscription) => {
  return addApi(urls.subscription.add, newSubscription);
};

export const countSubscriptions = async () => {
  return fetchApi(urls.subscription.count);
};

export const updateSubscription = async (updatedSubscription) => {
  return updateEntity('subscription', updatedSubscription);
};
