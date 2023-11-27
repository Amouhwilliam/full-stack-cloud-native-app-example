from typing import Dict
from uuid import uuid4
import json
from fastapi import WebSocket


class WSHandler:
    def __init__(self):
        self.connection: Dict[uuid4, WebSocket] = {}

    async def new_connect(self, websocket: WebSocket) -> uuid4:
        id_ = uuid4()

        self.connection[id_] = websocket
        #from amqp_client import amqp_handler
        """await amqp_handler.publish(
            {
                'from': 'SYSTEM',
                'message': f'{id_} connected',
            }
        )"""
        return id_

    async def delete_connection(self, *, id_):
        from amqp_client import amqp_handler
        """await amqp_handler.publish(
            {
                'from': 'SYSTEM',
                'message': f'{id_} disconnected',
            }
        )"""
        del self.connection[id_]

    async def handle_message(self, *, id_, data):
        from amqp_client import amqp_handler

       # await amqp_handler.publish({'from': str(id_), 'message': data})

    async def notify_all(self, *, message):
        print(f'Hello -- {message}')
                                  
        for id_, ws_inst in self.connection.items():
            if ws_inst.client_state != 2:
                await ws_inst.send_text(json.dumps(message))


ws_handler = WSHandler()