.PHONY: docker-build
docker-build:
	docker buildx build \
		--platform linux/arm64 \
		-t flanksource/audit-report:latest \
		--load \
		.