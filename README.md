
# README for Approuter and Middleware Projects

## Overview

This repository contains two main projects: `approuter` and `middleware`. The `approuter` project runs a simple Approuter that serves an `index.html` file and makes API calls to the `middleware` service using the Approuter's beforeRequestHandler handler. The `middleware` project is a separate Kubernetes service that listens on port 8080 for API calls. It logs the content of requests received from the Approuter and returns a hello message.

Both projects include their Kubernetes deployment files and Dockerfiles.

## Project Structure

- **approuter/**
  - `Dockerfile`: Docker configuration for the Approuter service.
  - `k8s/`: Kubernetes deployment and service YAML files.
  - `static/index.html`: Simple HTML file served by the Approuter.
  - `app.js/`: Approuter code.

- **middleware/**
  - `Dockerfile`: Docker configuration for the Middleware service.
  - `k8s/`: Kubernetes deployment and service YAML files.
  - `server.js/`: Middleware code.

## Prerequisites

- Kubernetes cluster with `socmiddleware` namespace created.
- Docker and Kubernetes CLI tools installed (Docker, kubectl).
- Docker registry pull secret set up in the `socmiddleware` namespace and configured in the k8s yaml files for both projects.

## Running the Projects

### Building and Deploying

1. **Build the Docker Images**:
   - Navigate to each project directory and build the Docker images:
     ```bash
     docker build -t your-approuter-image-name ./approuter/
     docker build -t your-middleware-image-name ./middleware/
     ```
   - Push the images to your Docker registry.

2. **Update Kubernetes Deployment Files**:
   - In each project's `k8s/` directory, update the deployment files with the corresponding Docker image names.

3. **Apply Kubernetes Configurations**:
   - Apply the Kubernetes files to your cluster:
     ```bash
     kubectl apply -f approuter/k8s/approuter.yaml
     kubectl apply -f middleware/k8s/middleware.yaml
     ```

### Testing and Debugging

1. **Port Forward the Approuter Service**:
   ```bash
   kubectl port-forward svc/socmiddleware 5000:5000 -n socmiddleware
   ```

2. **Test the Approuter API**:
   ```bash
   curl -v http://localhost:5000/path?query=value
   ```

   This command should return the content served by the `index.html` in the Approuter, and the Middleware service should log the request details.

## Notes

- Ensure that your Kubernetes cluster has access to the Docker registry where the images are hosted.
- Adjust Docker image names and Kubernetes configurations as necessary for your environment.
- Monitor the logs of both services for insights and to ensure they are functioning as expected. Logs can be accessed using `kubectl logs [pod-name]`.
