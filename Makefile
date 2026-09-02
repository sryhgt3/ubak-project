.PHONY: dev dev-build dev-down prod prod-build prod-down logs prod-logs clean

# ==========================================
# Development Commands
# ==========================================

# Menjalankan environment development di background
dev:
	docker compose -f docker-compose.yml up -d

# Build ulang dan jalankan environment development
dev-build:
	docker compose -f docker-compose.yml up -d --build

# Mematikan environment development
dev-down:
	docker compose -f docker-compose.yml down

# Melihat log environment development
logs:
	docker compose -f docker-compose.yml logs -f


# ==========================================
# Production Commands
# ==========================================

# Menjalankan environment production di background
prod:
	docker compose -f docker-compose-prod.yml up -d

# Build ulang dan jalankan environment production
prod-build:
	docker compose -f docker-compose-prod.yml up -d --build

# Mematikan environment production
prod-down:
	docker compose -f docker-compose-prod.yml down

# Melihat log environment production
prod-logs:
	docker compose -f docker-compose-prod.yml logs -f


# ==========================================
# Utility Commands
# ==========================================

# Membersihkan file cache dan redundant (kecuali DB)
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	@echo "Cleaned up python cache files."
