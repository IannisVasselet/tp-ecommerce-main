#!/bin/bash

echo "🚀 Démarrage des bases de données MiniShop"

# Démarrer la base de données Product Service (port 8764)
echo "📦 Démarrage Product Service DB (port 8764)..."
cd product-service/deploy/local
docker-compose -p product up -d database
cd ../../..

# Démarrer la base de données Cart Service (port 8765)  
echo "🛒 Démarrage Cart Service DB (port 8765)..."
cd cart-service/deploy/local
docker-compose -p cart up -d database
cd ../../..

# Démarrer la base de données Order Service (port 8766)
echo "📋 Démarrage Order Service DB (port 8766)..."
cd order-service/deploy/local
docker-compose -p order up -d order-database
cd ../../..

echo "⏳ Attente que toutes les bases de données soient prêtes..."
sleep 15

echo "✅ État des conteneurs:"
docker ps

echo "📊 Récapitulatif des ports:"
echo "  - Product Service: localhost:3000 (DB: 8764)"
echo "  - Cart Service: localhost:3002 (DB: 8765)" 
echo "  - Order Service: localhost:3003 (DB: 8766)"
