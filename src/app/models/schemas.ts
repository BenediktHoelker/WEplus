import { schema } from 'normalizr';

export const filterSchema = new schema.Entity('filters');
export const statusSchema = new schema.Entity('status');
export const yardSchema = new schema.Entity('yards');
export const deviationTypeSchema = new schema.Entity('deviationTypes');

export const deviationSchema = new schema.Entity('deviations', {
  type: deviationTypeSchema
});

export const yardDeliverySchema = new schema.Entity('yardDeliveries', {
  status: statusSchema
});

export const deliverySchema = new schema.Entity('deliveries', {
  deviations: [deviationSchema],
  status: statusSchema,
  yardDeliveries: [yardDeliverySchema]
});

