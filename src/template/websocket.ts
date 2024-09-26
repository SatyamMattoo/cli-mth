let socket = null;

function connectWebSocket() {
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    if (event.data.includes("File updated:")) {
      // Logic to reload the page or update the content
      window.location.reload(); // Reload the page on file change
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed, reconnecting...");
    setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

connectWebSocket();
