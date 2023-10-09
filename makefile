.PHONY: help startTestnet deployBackend deploy

help:
	@echo "make startTestnet: lanza una blockchain local de icp"
	@echo "make deployBackend: lanza de manera local el canister de backend"
	@echo "make deploy: lanza de manera local todos los canisters"
	@echo "make generate: compila los canisters"

startTestnet:
	sudo dfx start --clean

deployBackend:
	sudo dfx deploy workshopCOLLEDGE_backend

deploy:
	sudo dfx deploy

generate:
	sudo dfx generate workshopCOLLEDGE_backend