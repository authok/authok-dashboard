GOPATH:=$(shell go env GOPATH)

.PHONY: run
run:
	npm start:dev

.PHONY: docker
docker:
	docker build -t authok-mgmt-spa:latest .

.PHONY: publish-image
publish-image: docker
	docker tag authok-mgmt-spa:latest ccr.ccs.tencentyun.com/authok/authok-mgmt-spa:latest
	docker push ccr.ccs.tencentyun.com/authok/authok-mgmt-spa:latest

.PHONY: k8s-deploy
k8s-deploy: publish-image
	kubectl apply -f ./deploy/k8s/authok/authok-mgmt-spa.yml
	kubectl rollout restart -n authok deploy/authok-mgmt-spa
	