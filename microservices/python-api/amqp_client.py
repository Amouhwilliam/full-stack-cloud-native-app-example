import json
from asyncio import get_event_loop
import os
import asyncio
import aio_pika
from aio_pika.abc import AbstractIncomingMessage
from ws_client import ws_handler
from aio_pika import IncomingMessage, connect
from dotenv import load_dotenv
load_dotenv()


class AMQPHandler:
    QUEUE_NAME = 'to_python_app_queue'
    RABBITMQ_HOSTNAME=os.getenv("RABBITMQ_HOSTNAME")# "localhost"
    RABBITMQ_USER=os.getenv("RABBITMQ_USER")# "guest"
    RABBITMQ_PASSWORD=os.getenv("RABBITMQ_PASSWORD")# "guest"
    RABBITMQ_PORT=os.getenv("RABBITMQ_PORT")# 5672
    RABBITMQ_PROTOCOL=os.getenv("RABBITMQ_PROTOCOL")# "amqp://"

    def __init__(self):
        self.connection = None
        self.channel = None
        print(os.getenv("RABBITMQ_HOSTNAME"))
        print("--------------------------------")
        print(f"{self.RABBITMQ_PROTOCOL}{self.RABBITMQ_USER}:{self.RABBITMQ_PASSWORD}@{self.RABBITMQ_HOSTNAME}:{self.RABBITMQ_PORT}/")

    async def init(self):
        self.connection = await aio_pika.connect(
            f"{self.RABBITMQ_PROTOCOL}{self.RABBITMQ_USER}:{self.RABBITMQ_PASSWORD}@{self.RABBITMQ_HOSTNAME}:{self.RABBITMQ_PORT}/"#, loop=get_event_loop()
        )
        channel: aio_pika.abc.AbstractChannel = await self.connection.channel()
        # Declaring queue
        queue: aio_pika.abc.AbstractQueue = await channel.declare_queue(
            self.QUEUE_NAME,
            durable= True
        )
        print("RabbitMQ connection established")
        # Start listening the queue with name 'hello'
        await queue.consume(self.on_message, no_ack=False)#

        print(" [*] Waiting for messages. To exit press CTRL+C")
        #asyncio.Future()

    async def on_message(data, message: IncomingMessage) -> None:
        await ws_handler.notify_all(message=json.loads(message.body))
        print("Before sleep!")
        await asyncio.sleep(2)  # Represents async I/O operations
        print("After sleep!")
        await message.ack()


    async def publish(self, data: dict):
        message = aio_pika.Message(
            body=json.dumps(data).encode(),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        )
        exchange = await self.channel.declare_exchange(
            self.QUEUE_NAME,
            aio_pika.ExchangeType.FANOUT,
        )
        await exchange.publish(
            message,
            routing_key=self.QUEUE_NAME,
        )


amqp_handler = AMQPHandler()


"""
        async with queue.iterator() as queue_iter:
            # Cancel consuming after __exit__
            async for message in queue_iter:
                async with message.process():
                    print(message.body)
                    await ws_handler.notify_all(message=json.loads(message.body))
                    #self.handle_message(message.body)
                    if queue.name in message.body.decode():
                        break

        print("RabbitMQ connection established")
       
       # return self.connection

    @classmethod
    async def handle_message(cls, message):
        async with message.process():
            await ws_handler.notify_all(
                message=json.loads(message.body),
            )

"""