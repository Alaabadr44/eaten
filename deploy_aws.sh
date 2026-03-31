#!/bin/bash

# Configuration
REMOTE_USER="ubuntu"
REMOTE_HOST="35.158.235.111"
PEM_KEY="Waterway-Apps.pem"
REMOTE_APP_DIR="/home/ubuntu/eaten-app"
CALLCENTER_DIR="/home/ubuntu/app"
DOMAIN="eaten.waterway.group"

echo "🚀 Starting NUCLEAR deployment of Eaten to AWS ($REMOTE_HOST)..."

# 1. Build Frontend Locally
echo "📦 Building Frontend..."
cd frontend
npm install
VITE_API_URL="https://eaten.waterway.group/api" \
VITE_CHAT_AI_URL="https://clinton-declaration-int-currencies.trycloudflare.com/chat" \
npm run build
cd ..

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# 2. Package
echo "📂 Packaging..."
rm -rf deploy_package deploy_package.zip
mkdir -p deploy_package/frontend_dist
cp -R frontend/dist/* deploy_package/frontend_dist/
cp frontend/nginx.conf deploy_package/frontend_nginx.conf
cp -R backend deploy_package/backend
cp docker-compose.yml deploy_package/docker-compose.yml
cp .env deploy_package/.env 2>/dev/null || touch deploy_package/.env

# Server-Side Dockerfile (Frontend)
cat << 'FE_DOCKER' > deploy_package/frontend.Dockerfile
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend_dist /usr/share/nginx/html
COPY frontend_nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
FE_DOCKER

# Update docker-compose.yml
sed -i '' 's|build: ./frontend|build: { context: ., dockerfile: frontend.Dockerfile }|g' deploy_package/docker-compose.yml

# Zip
zip -r deploy_package.zip deploy_package > /dev/null

# 3. Upload
echo "📤 Uploading..."
scp -i "$PEM_KEY" -o StrictHostKeyChecking=no deploy_package.zip "$REMOTE_USER@$REMOTE_HOST:~/"

# 4. Remote Nuclear Deployment
echo "🏗️ Nuclear deployment and routing fix..."
ssh -i "$PEM_KEY" -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << SSH_END
    # Clean and Extract
    echo "⚙️  Cleaning up old files..."
    sudo rm -rf $REMOTE_APP_DIR/backend $REMOTE_APP_DIR/frontend_dist $REMOTE_APP_DIR/deploy_package
    mkdir -p $REMOTE_APP_DIR
    python3 -m zipfile -e ~/deploy_package.zip $REMOTE_APP_DIR
    
    # Move
    mv $REMOTE_APP_DIR/deploy_package/* $REMOTE_APP_DIR/
    rmdir $REMOTE_APP_DIR/deploy_package
    
    # Deploy Docker
    cd $REMOTE_APP_DIR
    sudo docker compose build --no-cache backend
    sudo docker compose up -d
    
    # Proxy Config
    echo "🌐 Routing fix..."
    CONFIG_FILE="$CALLCENTER_DIR/nginx_current.conf"
    if ! grep -q "$DOMAIN" "\$CONFIG_FILE"; then
        sudo bash -c "cat << 'EON' >> \$CONFIG_FILE

server {
    listen 80;
    server_name $DOMAIN;
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;
    ssl_certificate /etc/nginx/certs/eaten_fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/eaten_privkey.pem;
    location / {
        proxy_pass http://172.17.0.1:8082;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EON"
        cd $CALLCENTER_DIR && sudo docker compose restart
    fi
    rm ~/deploy_package.zip
SSH_END

if [ $? -eq 0 ]; then
    echo "✅ Nuclear Deployment Successful!"
    echo "🔗 URL: https://$DOMAIN"
else
    echo "❌ Deployment failed!"
    exit 1
fi
