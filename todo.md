<b>Things todo: </b>

### Running the websocket server
### Connecting the websocket server with the android application

#### Implementation codee (will require changes later)
```
import okhttp3.*

val client = OkHttpClient()
val wsUrl = "ws://your_server_ip:8000"

val request = Request.Builder().url(wsUrl).build()
val webSocketListener = object : WebSocketListener() {
    override fun onOpen(webSocket: WebSocket, response: Response) {
        webSocket.send("{\"chatroom_id\":\"room_123\", \"sender_id\":\"1\", \"message\":\"Hello!\"}")
    }

    override fun onMessage(webSocket: WebSocket, text: String) {
        println("Received: $text")
    }
}

val webSocket = client.newWebSocket(request, webSocketListener)
```


### Testing the websocket server
```
npm install -g wscat
wscat -c ws://localhost:8000
```


#### Sending the message
```
{"chatroom_id":"room_123", "sender_id":"1", "message":"Hello from WebSocket!"}
```


