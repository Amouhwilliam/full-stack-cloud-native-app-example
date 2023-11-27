import Env from '@ioc:Adonis/Core/Env'
import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit'

const rabbitConfig: RabbitConfig = {
  hostname: Env.get('RABBITMQ_HOSTNAME', 'localhost'),

  user: Env.get('RABBITMQ_USER', 'guest'),

  password: Env.get('RABBITMQ_PASSWORD', 'guest'),

  port: Number(Env.get('RABBITMQ_PORT', 5672)),
  
  protocol: Env.get('RABBITMQ_PROTOCOL', 'amqp://'),
}

export default rabbitConfig
