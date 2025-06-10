# 🚀 Guide d'Utilisation - Collection Insomnia MiniShop

## 📥 Import de la Collection

1. **Ouvrir Insomnia**
2. **Cliquer sur "Import"** ou utiliser `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Shift+I` (Mac)
3. **Sélectionner le fichier** `MiniShop-Insomnia-Collection.json`
4. **Cliquer sur "Import"**

## 🏗️ Structure de la Collection

### 📦 **Product Service** (Port 3000)
- `GET /products` - Liste tous les produits
- `GET /products/{id}` - Détails d'un produit

### 🛒 **Cart Service** (Port 3002)
- `POST /cart/{userId}/items` - Ajouter un produit au panier
- `GET /cart/{userId}` - Voir le contenu du panier
- `DELETE /cart/{userId}/items/{productId}` - Supprimer un produit
- `DELETE /cart/{userId}` - Vider le panier

### 📋 **Order Service** (Port 3003)
- `POST /orders` - Créer une commande depuis le panier
- `GET /orders/{userId}` - Lister les commandes d'un utilisateur
- `GET /orders/order/{orderId}` - Détails d'une commande

### 🎯 **E2E Workflow Tests**
- Séquence complète de tests pour valider le workflow e-commerce

## 🔧 Configuration

### Variables d'Environnement
Les variables suivantes sont pré-configurées :

```json
{
  "base_url_product": "http://localhost:3000",
  "base_url_cart": "http://localhost:3002", 
  "base_url_order": "http://localhost:3003",
  "user_id": "user-test-123",
  "product_id": "REPLACE_WITH_ACTUAL_PRODUCT_ID",
  "order_id": "REPLACE_WITH_ACTUAL_ORDER_ID"
}
```

## 🎯 Guide de Test E2E Complet

### **Étape 1: Préparer les IDs de Produits**

1. **Exécuter** `📦 Product Service > Get All Products`
2. **Copier** les IDs des produits dans la réponse
3. **Mettre à jour** les requêtes E2E avec les vrais IDs :
   - Modifier `PUT_IPHONE_ID_HERE` dans "E2E: Add iPhone to Cart"
   - Modifier `PUT_SAMSUNG_ID_HERE` dans "E2E: Add Samsung to Cart"

### **Étape 2: Workflow E2E Complet**

Exécuter les requêtes **dans cet ordre** :

1. **E2E: Add iPhone to Cart** ✅
   - Vérifie que le produit est ajouté avec la quantité 2

2. **E2E: Add Samsung to Cart** ✅
   - Ajoute un deuxième type de produit

3. **E2E: Check Cart Contents** ✅
   - Vérifie que le panier contient bien les 2 produits
   - Note le nombre total d'items

4. **E2E: Create Order** ✅
   - Transforme le panier en commande
   - **Copier l'ID de la commande** dans la réponse

5. **E2E: Check User Orders** ✅
   - Vérifie que la commande est bien créée

6. **E2E: Verify Cart is Empty** ✅
   - Confirme que le panier a été vidé après la commande

## 🔍 Tests Unitaires par Service

### Product Service
```bash
# Tester la disponibilité
GET /products
GET /products/{specific-id}
```

### Cart Service
```bash
# Workflow panier
POST /cart/user-123/items
GET /cart/user-123
DELETE /cart/user-123/items/{productId}
DELETE /cart/user-123
```

### Order Service
```bash
# Workflow commandes
POST /orders
GET /orders/user-123
GET /orders/order/{orderId}
```

## 🚨 Troubleshooting

### **Services non disponibles**
- Vérifier que les 3 services sont démarrés :
  - Product Service : `http://localhost:3000`
  - Cart Service : `http://localhost:3002`
  - Order Service : `http://localhost:3003`

### **Erreurs de validation**
- Vérifier que les IDs de produits existent dans Product Service
- S'assurer que les quantités sont > 0
- Vérifier que le panier n'est pas vide avant de créer une commande

### **Erreurs de base de données**
- S'assurer que PostgreSQL est démarré pour chaque service
- Vérifier que les migrations ont été exécutées

## 📊 Exemples de Réponses Attendues

### Produit
```json
{
  "id": "uuid-here",
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "isAvailable": true
}
```

### Panier
```json
{
  "userId": "user-test-123",
  "items": [
    {
      "id": "uuid-here",
      "productId": "product-uuid",
      "quantity": 2,
      "createdAt": "2025-06-10T..."
    }
  ],
  "totalItems": 2
}
```

### Commande
```json
{
  "id": "order-uuid",
  "userId": "user-test-123",
  "totalPrice": 1999.98,
  "status": "PENDING",
  "createdAt": "2025-06-10T...",
  "items": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "price": 999.99
    }
  ]
}
```

## 🎉 Validation du Succès

✅ **Tous les services répondent correctement**
✅ **Les produits sont récupérés avec succès**
✅ **Les items sont ajoutés au panier**
✅ **Le panier affiche le bon contenu**
✅ **La commande est créée avec le bon total**
✅ **Le panier est vidé après la commande**
✅ **Les commandes sont listées correctement**

Votre architecture microservices MiniShop fonctionne parfaitement ! 🚀
