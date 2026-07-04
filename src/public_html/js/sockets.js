
let webSocket;

function openSocketsClient(data) {
    const ws = `ws://${data.ip}:${data.port}/`;
    webSocket = new WebSocket(ws);

    webSocket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        wsCommsParse(data);
    };

    webSocket.addEventListener("open", () => {
        console.log("We are connected");
    });

}

// wsw = websocket wrapper - just to avoid ugly dereferences of the undefined webSocket object at startup
function wswSend(msg) {
    if (webSocket) {
        webSocket.send(msg);
    }
}