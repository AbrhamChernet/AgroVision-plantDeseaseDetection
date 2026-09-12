FROM python:3.10-slim

WORKDIR /app

# Install minimal system dependencies required for OpenCV and image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch CPU wheel first (lightweight, ~150MB, avoids massive CUDA download)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install ultralytics, fastapi, uvicorn, pillow
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code and model weights
COPY . .

ENV PORT=8000
EXPOSE 8000

# Dynamic port binding for Railway ($PORT) and local Docker (8000)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

