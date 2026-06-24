FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY ml_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ml_service/ ./ml_service/
COPY Red_Neuronal/ ./Red_Neuronal/

ENV MPLBACKEND=Agg
ENV PYTHONPATH=/app/ml_service:/app/Red_Neuronal

EXPOSE 8080

CMD ["uvicorn", "ml_service.main:app", "--host", "0.0.0.0", "--port", "8080"]
