.PHONY: dev-up dev-down dev-build prod-up prod-down prod-build backend-rebuild-dev backend-rebuild-prod logs-dev logs-prod

# ==========================================
# DEVELOPMENT ENVIRONMENT (docker-compose.yml)
# ==========================================

# Membangun ulang (build) semua container DEV
dev-build:
	docker compose -f docker-compose.yml build

# Menyalakan semua container DEV di background
dev-up:
	docker compose -f docker-compose.yml up -d

# Mematikan semua container DEV
dev-down:
	docker compose -f docker-compose.yml down

# Membangun ulang dan me-restart HANYA backend DEV
backend-rebuild-dev:
	docker compose -f docker-compose.yml build backend
	docker compose -f docker-compose.yml up -d backend

# Melihat log DEV secara real-time
logs-dev:
	docker compose -f docker-compose.yml logs -f


# ==========================================
# PRODUCTION ENVIRONMENT (docker-compose-prod.yml)
# ==========================================

# Membangun ulang (build) semua container PROD
prod-build:
	docker compose -f docker-compose-prod.yml build

# Menyalakan semua container PROD di background
prod-up:
	docker compose -f docker-compose-prod.yml up -d

# Mematikan semua container PROD
prod-down:
	docker compose -f docker-compose-prod.yml down

# Membangun ulang dan me-restart HANYA backend PROD
backend-rebuild-prod:
	docker compose -f docker-compose-prod.yml build backend
	docker compose -f docker-compose-prod.yml up -d backend

# Melihat log PROD secara real-time
logs-prod:
	docker compose -f docker-compose-prod.yml logs -f
