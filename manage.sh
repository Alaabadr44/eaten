#!/bin/bash

# Detect OS
OS="$(uname)"
HOST_IP=""

# 🩺 IP Detection Logic
echo "---------------------------------------"
echo "📡 Available IP Addresses:"
detected_ips=()

if [[ "$OS" == "Darwin" ]]; then
    # macOS
    detected_ips=($(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'))
elif [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"CYGWIN"* ]] || [[ "$OS" == *"MSYS"* ]]; then
    # Windows (Git Bash)
    detected_ips=($(ipconfig //all | grep "IPv4" | awk -F: '{print $2}' | sed 's/^(Preferred)//g' | tr -d '\r ' | grep -v '^$'))
else
    # Linux
    if command -v hostname &> /dev/null; then
        detected_ips=($(hostname -I))
    else
        detected_ips=($(ip addr | grep 'state UP' -A2 | grep 'inet ' | awk '{print $2}' | cut -f1 -d'/'))
    fi
fi

i=1
for ip in "${detected_ips[@]}"; do
    echo "$i) $ip"
    ((i++))
done
echo "---------------------------------------"
read -r -p "Enter Choice (Index or Manual IP) [1]: " ip_choice
ip_choice=${ip_choice:-1}

if [[ "$ip_choice" =~ ^[0-9]+$ ]] && [ "$ip_choice" -le "${#detected_ips[@]}" ] && [ "$ip_choice" -gt 0 ]; then
    HOST_IP=${detected_ips[$((ip_choice-1))]}
elif [[ "$ip_choice" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    HOST_IP=$ip_choice
else
    HOST_IP=${detected_ips[0]}
    echo "⚠️  Invalid choice. Defaulting to $HOST_IP"
fi

echo "✅ Selected IP: $HOST_IP"

# 🔒 SSL Generation Logic
echo "🔒 Generating SSL Certificates for $HOST_IP..."
mkdir -p backend/nginx/ssl

if ! command -v openssl &> /dev/null; then
    echo "❌ Error: 'openssl' is not installed. Cert generation failed."
else
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout backend/nginx/ssl/server.key \
      -out backend/nginx/ssl/server.crt \
      -subj "/C=US/ST=State/L=City/O=Eaten/CN=$HOST_IP" \
      -addext "subjectAltName=IP:$HOST_IP" 2>/dev/null || \
      openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout backend/nginx/ssl/server.key \
      -out backend/nginx/ssl/server.crt \
      -subj "/CN=$HOST_IP" 2>/dev/null
    echo "✅ SSL Certificates ready."
fi

# 🐳 Docker Compose Command Selection
DOCKER_CMD="docker compose"
if command -v docker-compose &> /dev/null; then
    DOCKER_CMD="docker-compose"
fi

USE_SUDO=""
if ! docker info > /dev/null 2>&1; then
    USE_SUDO="sudo -E"
fi

# 🍔 Menu System
echo "---------------------------------------"
echo "🚀 Eaten Project Manager"
echo "1) 🎨 Build Frontend Only (Port 8081)"
echo "2) ⚙️  Build Backend Only  (Port 3001)"
echo "3) 🔥 Full Rebuild & Start"
echo "4) 🔄 Restart Services"
echo "5) 🌱 Seed Database (Admin, Services, Zones)"
echo "6) 📜 View Logs"
echo "7) 👋 Exit"
echo "---------------------------------------"
read -r -p "Enter Choice [1-7]: " choice

case "$choice" in
    1)
        echo "Building Frontend..."
        $USE_SUDO $DOCKER_CMD build frontend
        $USE_SUDO $DOCKER_CMD up -d --force-recreate frontend nginx
        ;;
    2)
        echo "Building Backend..."
        $USE_SUDO $DOCKER_CMD build backend
        $USE_SUDO $DOCKER_CMD up -d --force-recreate backend nginx
        ;;
    3)
        echo "Full Rebuild..."
        $USE_SUDO $DOCKER_CMD down
        $USE_SUDO $DOCKER_CMD up -d --build
        ;;
    4)
        echo "Restarting Services..."
        $USE_SUDO $DOCKER_CMD restart
        ;;
    5)
        echo "🌱 Seeding project data..."
        $USE_SUDO $DOCKER_CMD exec -T backend node dist/scripts/create-admin || echo "Admin script failed."
        $USE_SUDO $DOCKER_CMD exec -T backend node dist/scripts/create-services || echo "Services script failed."
        $USE_SUDO $DOCKER_CMD exec -T backend node dist/scripts/create-zones || echo "Zones script failed."
        ;;
    6)
        $USE_SUDO $DOCKER_CMD logs -f
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice."
        exit 1
        ;;
esac

echo "---------------------------------------"
echo "✅ Operation Completed."
echo "🔗 Frontend direct: http://$HOST_IP:8081"
echo "🔗 Backend direct: http://$HOST_IP:3001"
echo "🔒 HTTPS Secure: https://$HOST_IP"
echo "---------------------------------------"
