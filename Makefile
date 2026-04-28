.PHONY: help install dev build start test lint type-check docker-build docker-up docker-down
.DEFAULT_GOAL := help

help:
	@echo ""
	@echo "  install       Install dependencies"
	@echo "  dev           Run in watch mode (tsx)"
	@echo "  build         Compile TypeScript → dist/"
	@echo "  start         Run compiled output"
	@echo "  test          Run all tests"
	@echo "  lint          ESLint + Prettier check"
	@echo "  type-check    TypeScript type check (no emit)"
	@echo "  docker-build  Build Docker image"
	@echo "  docker-up     Start stack via Compose"
	@echo "  docker-down   Stop stack"
	@echo ""

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

test:
	npm test

lint:
	npm run lint && npm run format:check

type-check:
	npm run type-check

docker-build:
	docker build -t brand-fidelity-api:local .

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
