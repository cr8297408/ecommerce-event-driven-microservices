import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProducerService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Conectar el cliente de Kafka al iniciar el módulo
    await this.kafkaClient.connect();
  }

  /**
   * Envía un mensaje a un topic de Kafka
   * @param topic - Nombre del topic
   * @param message - Mensaje a enviar (será serializado a JSON)
   * @returns Observable con la respuesta
   */
  async emit<T = any>(topic: string, message: T) {
    return this.kafkaClient.emit(topic, message);
  }

  /**
   * Envía un mensaje y espera una respuesta (patrón request-response)
   * @param topic - Nombre del topic
   * @param message - Mensaje a enviar
   * @returns Observable con la respuesta
   */
  send<TResult = any, TInput = any>(topic: string, message: TInput) {
    return this.kafkaClient.send<TResult, TInput>(topic, message);
  }

  /**
   * Cierra la conexión con Kafka
   */
  async close() {
    await this.kafkaClient.close();
  }
}
