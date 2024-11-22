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

export const fetchCategories = async () => {
    return fetchApi(urls.category.fetch); 
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

export const fetchSuppliers = async () => {
    return fetchApi(urls.supplier.fetch); 
};

export const addSupplier = async (newSupplier) => {
    return addApi(urls.supplier.add, newSupplier); 
};

export const updateSupplier = async (updatedSupplier) => {
    return updateEntity('supplier', updatedSupplier); 
};

// customer
export const deleteCustomer = async (_id) => {
    return deleteApi(urls.customer.delete, _id); 
};

export const fetchCustomers = async () => {
    return fetchApi(urls.customer.fetch); 
};

export const addCustomer = async (newCustomer) => {
    return addApi(urls.customer.add, newCustomer); 
};

export const updateCustomer = async (updatedCustomer) => {
    return updateEntity('customer', updatedCustomer); 
};

// product
export const deleteProduct = async (_id) => {
    return deleteApi(urls.product.delete, _id); 
};

export const fetchProducts = async () => {
    return fetchApi(urls.product.fetch); 
};

export const addProduct = async (newProduct) => {
    return addApi(urls.product.add, newProduct); 
};

export const updateProduct = async (updatedProduct) => {
    return updateEntity('product', updatedProduct); 
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

// order
export const deleteOrder = async (_id) => {
    return deleteApi(urls.order.delete, _id); 
};

export const fetchOrders = async () => {
    return fetchApi(urls.order.fetch); 
};

export const addOrder = async (newOrder) => {
    return addApi(urls.order.add, newOrder); 
};

// purchase
export const deletePurchase = async (_id) => {
    return deleteApi(urls.purchase.delete, _id); 
};

export const fetchPurchases = async () => {
    return fetchApi(urls.purchase.fetch); 
};

export const addPurchase = async (newPurchase) => {
    return addApi(urls.purchase.add, newPurchase); 
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