export enum Topics {
  // Products
  CREATE_PRODUCT='product.create',
  PRODUCT_CREATED='product.created',
  PRODUCT_CREATION_FAILED='product.creation.failed',
  UPDATE_PRODUCT='product.update',
  PRODUCT_UPDATED='product.updated',
  DELETE_PRODUCT='product.delete',
  PRODUCT_DELETED='product.deleted',

  // Inventory
  RESERVE_STOCK='inventory.reserve',
  STOCK_RESERVED='inventory.reserved',
  STOCK_RESERVATION_FAILED='inventory.reservation.failed',
  RELEASE_STOCK='inventory.release',
  STOCK_RELEASED='inventory.released',

  // Orders/Checkout
  CREATE_ORDER='order.create',
  ORDER_CREATED='order.created',
  ORDER_CONFIRMED='order.confirmed',
  ORDER_CANCELLED='order.cancelled',

  // Payments
  PROCESS_PAYMENT='payment.process',
  PAYMENT_PROCESSED='payment.processed',
  PAYMENT_FAILED='payment.failed',
}