from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

from ws_client import ws_handler

router = APIRouter()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://127.0.0.1:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                console.log(JSON.stringify(messages)
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@router.get("/")
async def get():
    return "hello world"


@router.websocket('/ws')
async def ws(websocket: WebSocket):
    await websocket.accept()
    id_ = await ws_handler.new_connect(websocket)
    while True:
        try:
            data = await websocket.receive_text()
        except WebSocketDisconnect:
            await ws_handler.delete_connection(id_=id_)
            break

        await ws_handler.handle_message(
            id_=id_,
            data=data,
        )

"""

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

"""