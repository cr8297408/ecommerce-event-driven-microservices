export enum Topics {
  // Products
  CREATE_PRODUCT='product.create',
  PRODUCT_CREATED='product.created',
  PRODUCT_CREATION_FAILED='product.creation.failed',
  UPDATE_PRODUCT='product.update',
  PRODUCT_UPDATED='product.updated',
  PRODUCT_UPDATED_FAILED='product.update.failed',
  DELETE_PRODUCT='product.delete',
  PRODUCT_DELETED='product.deleted',
  PRODUCT_DELETION_FAILED='product.deletion.failed',

  // Inventory
  RESERVE_STOCK='inventory.reserve',
  STOCK_RESERVED='inventory.reserved',
  STOCK_RESERVATION_FAILED='inventory.reservation.failed',
  RELEASE_STOCK='inventory.release',
  STOCK_RELEASED='inventory.released',
  STOCK_RELEASE_FAILED='inventory.release.failed',

  // Orders/Checkout
  CREATE_ORDER='order.create',
  ORDER_CREATED='order.created',
  ORDER_CREATION_FAILED='order.creation.failed',
  ORDER_CONFIRMED='order.confirmed',
  ORDER_CANCELLED='order.cancelled',

  // Payments
  PROCESS_PAYMENT='payment.process',
  PAYMENT_PROCESSED='payment.processed',
  PAYMENT_FAILED='payment.failed',
}