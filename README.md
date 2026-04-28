# 📚 Online Könyvtár – Library App

Teljes stack webalkalmazás könyvek és szerzők kezelésére modern DevOps környezettel.

---

## 🏗️ Technológiai stack

| Réteg          | Technológia                   |
| -------------- | ----------------------------- |
| Frontend       | Angular 21 + Angular Material |
| Backend        | ASP.NET 10 Web API            |
| Adatbázis      | MongoDB                       |
| Konténerizálás | Docker + Docker Compose       |
| Orchestration  | Kubernetes (Minikube)         |
| CI             | GitHub Actions                |
| CD             | ArgoCD (GitOps)               |

---

## 🚀 Gyors indítás (Docker Compose)

### Előfeltételek

* Docker Desktop telepítve és fut
* Git telepítve

### Indítás

```bash
# Repo klónozása
git clone https://github.com/Werbygbr/library-app.git
cd library-app

# Alkalmazás indítása
docker-compose up --build
```

### Elérés

* Frontend: http://localhost:4200
* Swagger API: http://localhost:8080/swagger

### Leállítás

```bash
docker-compose down
```

---

## ☸️ Kubernetes futtatás (Minikube)

### Előfeltételek

* Docker Desktop
* Minikube
* kubectl

### Lépések

```bash
# Repo klónozása
git clone https://github.com/Werbygbr/library-app.git
cd library-app

# Minikube indítása
minikube start

# Deploy
kubectl apply -f k8s/

# Podok figyelése
kubectl get pods -w
```

### Megnyitás

```bash
minikube service frontend
```

⚠️ Fontos: a terminált nyitva kell tartani a futás alatt.

### Ellenőrzés

```bash
kubectl get pods
kubectl get services
```

---

## 🔄 CI/CD Pipeline

### ⚙️ GitHub Actions (CI)

Minden `main` branch push esetén:

* Backend Docker image build
* Frontend Docker image build
* Push GitHub Container Registry-be (ghcr.io)

---

### 🚀 ArgoCD (CD)

* Automatikus deploy Kubernetes clusterbe (GitOps)
* Repo folyamatos figyelése

### ArgoCD UI elérés

```bash
kubectl port-forward svc/argocd-server -n argocd 8091:443
```

👉 https://localhost:8091

**Belépés:**

* User: `admin`
* Password lekérése:

```bash
$encoded = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encoded))
```

---

## 📁 Projekt struktúra

```
library-app/
├── LibraryApi/              # ASP.NET Backend
│   ├── Controllers/         # API végpontok
│   ├── Models/              # Book, Author modellek
│   ├── Services/            # Business logic
│   ├── Settings/            # MongoDB config
│   └── Dockerfile
│
├── library-frontend/        # Angular Frontend
│   ├── src/app/
│   │   ├── components/      # UI komponensek
│   │   ├── models/          # TypeScript interfészek
│   │   └── services/        # HTTP hívások
│   └── Dockerfile
│
├── k8s/                     # Kubernetes manifestek
│   ├── mongodb-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── argocd-application.yaml
│
├── .github/workflows/
│   └── ci.yml               # CI pipeline
│
└── docker-compose.yml
```

---

## 🌐 API végpontok

### 📚 Könyvek

| Method | Endpoint        | Leírás       |
| ------ | --------------- | ------------ |
| GET    | /api/books      | Összes könyv |
| GET    | /api/books/{id} | Egy könyv    |
| POST   | /api/books      | Létrehozás   |
| PUT    | /api/books/{id} | Módosítás    |
| DELETE | /api/books/{id} | Törlés       |

---

### ✍️ Szerzők

| Method | Endpoint          | Leírás        |
| ------ | ----------------- | ------------- |
| GET    | /api/authors      | Összes szerző |
| GET    | /api/authors/{id} | Egy szerző    |
| POST   | /api/authors      | Létrehozás    |
| PUT    | /api/authors/{id} | Módosítás     |
| DELETE | /api/authors/{id} | Törlés        |

---

## 💡 Funkciók

* 📚 Könyvek CRUD
* ✍️ Szerzők CRUD
* 📊 Dashboard statisztikák
* 🔍 Részletes könyv nézet
* 📄 Lapozás (pagination)
* 📱 Reszponzív UI
* 🎨 Angular Material design
