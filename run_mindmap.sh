#!/bin/bash

# Move to the project directory
cd "$(dirname "$0")"

# Define the port number
PORT=8000

# Check if the port is already in use and kill the process
if lsof -i :$PORT &> /dev/null; then
    echo "⚠️ Port $PORT is already in use. Stopping the process..."
    PID=$(lsof -ti :$PORT)
    kill -9 $PID
    echo "✅ Process on port $PORT has been terminated."
    sleep 2
fi

# Check if Python3 is installed
if command -v python3 &> /dev/null
then
    echo "✅ Starting Python HTTP Server on port $PORT..."
    python3 -m http.server $PORT &
    SERVER_PID=$!
else
    echo "❌ Python3 not found! Please install Python3."
    exit 1
fi

# Wait for the server to start
sleep 2

# Open the project in the default browser
if command -v open &> /dev/null; then
    open "http://localhost:$PORT"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT"
else
    echo "❌ Could not detect the web browser!"
fi

# Allow user to stop the server with Ctrl+C
echo "🌐 Server is running at http://localhost:$PORT"
echo "Press Ctrl+C to stop the server."

# Keep the script running until user stops it
wait $SERVER_PID
