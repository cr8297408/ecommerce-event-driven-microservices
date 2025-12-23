import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventModel } from '@ecommerce/domain';
import { Observable } from 'rxjs';

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
  emit(event: EventModel): Observable<any> {
    return this.kafkaClient.emit(event.topic, event.data);
  }

  /**
   * Envía un mensaje y espera una respuesta (patrón request-response)
   * @param topic - Nombre del topic
   * @param message - Mensaje a enviar
   * @returns Observable con la respuesta
   */
  send<TResult = any, TInput = any>(event: EventModel) {
    return this.kafkaClient.send<TResult, TInput>(event.topic, event.data);
  }

  /**
   * Cierra la conexión con Kafka
   */
  async close() {
    await this.kafkaClient.close();
  }
}
