/**
 * Kafka Client Token
 * 
 * Este token se usa para inyectar un cliente Kafka genérico
 * que NO está acoplado a ningún microservicio específico.
 * 
 * Uso:
 * - @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka
 */
export const KAFKA_CLIENT = 'KAFKA_CLIENT';
