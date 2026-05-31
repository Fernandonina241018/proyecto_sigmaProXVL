PS G:\My Drive\SigmaProWeb\proyecto_sigmaProXVL> flyctl logs --app sigmapro-ml
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info] INFO Preparing to run: `docker-entrypoint.sh node backend/server.js` as root
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info] INFO [fly api proxy] listening at /.fly/api
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]2026/05/31 03:04:38 INFO SSH listening listen_address=[fdaa:78:e7f7:a7b:526:e305:c472:2]:22
2026-05-31T03:04:38Z runner[8e40d3b769e2d8] dfw [info]Machine started in 1.493s
2026-05-31T03:04:38Z proxy[8e40d3b769e2d8] dfw [info]machine started in 1.638434481s
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]⚠️  JWT_SECRET no definido. Generando clave temporal...
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]⚠️  Configúralo con: flyctl secrets set JWT_SECRET=<clave>
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]📦 DATABASE_URL no definido — usando store JSON local (dev)
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]🚀 Servidor corriendo en http://0.0.0.0:3000
2026-05-31T03:04:38Z app[8e40d3b769e2d8] dfw [info]📋 Health check: http://localhost:3000/api/health
2026-05-31T03:04:39Z proxy[8e40d3b769e2d8] dfw [info]machine became reachable in 654.917395ms
2026-05-31T03:04:39Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:04:39Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 47ms
2026-05-31T03:05:56Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:05:56Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 3ms
2026-05-31T03:06:04Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:06:04Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 3ms
2026-05-31T03:06:14Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:06:14Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 3ms
2026-05-31T03:06:24Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:06:24Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 3ms
2026-05-31T03:07:27Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:07:27Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 2ms
2026-05-31T03:08:36Z app[8e40d3b769e2d8] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:08:36Z app[8e40d3b769e2d8] dfw [info]⚠️ GET 503 /health - 1ms
2026-05-31T03:10:44Z proxy[8e40d3b769e2d8] dfw [info]App sigmapro-ml has excess capacity, autostopping machine 8e40d3b769e2d8. 0 out of 1 machines left running (region=dfw, process group=app)
2026-05-31T03:10:44Z app[8e40d3b769e2d8] dfw [info] INFO Sending signal SIGINT to main child process w/ PID 637
2026-05-31T03:10:44Z app[8e40d3b769e2d8] dfw [info]🛑 SIGINT recibido, cerrando servidor...
2026-05-31T03:10:44Z app[8e40d3b769e2d8] dfw [info]✅ Servidor cerrado correctamente
2026-05-31T03:10:45Z app[8e40d3b769e2d8] dfw [info] INFO Main child exited normally with code: 0
2026-05-31T03:10:45Z app[8e40d3b769e2d8] dfw [info] INFO Starting clean up.
2026-05-31T03:10:45Z app[8e40d3b769e2d8] dfw [info][  368.350727] reboot: Restarting system
error.message="machine was recently stopped and is unavailable to service request" 2026-05-31T03:12:36Z proxy[8e40d3b769e2d8] dfw [error]
2026-05-31T03:12:36Z proxy[2869115ae45958] dfw [info]Starting machine
2026-05-31T03:12:36Z app[2869115ae45958] dfw [info]2026-05-31T03:12:36.891223301 [01KSXYCP32MXQYT4E3SVV100EG:main] Running Firecracker v1.14.4
2026-05-31T03:12:36Z app[2869115ae45958] dfw [info]2026-05-31T03:12:36.891346152 [01KSXYCP32MXQYT4E3SVV100EG:main] Listening on API socket ("/fc.sock").
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info] INFO Starting init (commit: ea887ee)...
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info] INFO Preparing to run: `docker-entrypoint.sh node backend/server.js` as root
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info] INFO [fly api proxy] listening at /.fly/api
2026-05-31T03:12:37Z runner[2869115ae45958] dfw [info]Machine started in 864ms
2026-05-31T03:12:37Z proxy[2869115ae45958] dfw [info]machine started in 995.344449ms
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info]2026/05/31 03:12:37 INFO SSH listening listen_address=[fdaa:78:e7f7:a7b:7df:4c09:4c66:2]:22
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info]⚠️  JWT_SECRET no definido. Generando clave temporal...
2026-05-31T03:12:37Z app[2869115ae45958] dfw [info]⚠️  Configúralo con: flyctl secrets set JWT_SECRET=<clave>
2026-05-31T03:12:38Z app[2869115ae45958] dfw [info]📦 DATABASE_URL no definido — usando store JSON local (dev)
2026-05-31T03:12:38Z app[2869115ae45958] dfw [info]🚀 Servidor corriendo en http://0.0.0.0:3000
2026-05-31T03:12:38Z app[2869115ae45958] dfw [info]📋 Health check: http://localhost:3000/api/health
2026-05-31T03:12:38Z proxy[2869115ae45958] dfw [info]machine became reachable in 679.673085ms
2026-05-31T03:12:38Z app[2869115ae45958] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:12:38Z app[2869115ae45958] dfw [info]⚠️ GET 503 /health - 21ms
2026-05-31T03:16:36Z app[2869115ae45958] dfw [info]ML proxy error: connect ECONNREFUSED 127.0.0.1:8000
2026-05-31T03:16:36Z app[2869115ae45958] dfw [info]⚠️ GET 503 /health - 3ms
2026-05-31T03:18:23Z runner[2869115ae45958] dfw [info]Pulling container image registry.fly.io/sigmapro-ml@sha256:5c0ec2490989d6deb4c86a3f16791cf2977624ad4225e3da1ed6285649128ee0
2026-05-31T03:18:24Z runner[8e40d3b769e2d8] dfw [info]Pulling container image registry.fly.io/sigmapro-ml@sha256:5c0ec2490989d6deb4c86a3f16791cf2977624ad4225e3da1ed6285649128ee0
2026-05-31T03:18:25Z runner[2869115ae45958] dfw [info]Successfully prepared image registry.fly.io/sigmapro-ml@sha256:5c0ec2490989d6deb4c86a3f16791cf2977624ad4225e3da1ed6285649128ee0 (1.324548834s)
2026-05-31T03:18:25Z runner[2869115ae45958] dfw [info]Configuring firecracker
2026-05-31T03:18:25Z app[2869115ae45958] dfw [info] INFO Sending signal SIGINT to main child process w/ PID 637
2026-05-31T03:18:25Z app[2869115ae45958] dfw [info]🛑 SIGINT recibido, cerrando servidor...
2026-05-31T03:18:25Z app[2869115ae45958] dfw [info]✅ Servidor cerrado correctamente
2026-05-31T03:18:26Z app[2869115ae45958] dfw [info] INFO Main child exited normally with code: 0
2026-05-31T03:18:26Z app[2869115ae45958] dfw [info] INFO Starting clean up.
2026-05-31T03:18:26Z app[2869115ae45958] dfw [info][  349.092399] reboot: Restarting system
2026-05-31T03:18:26Z app[2869115ae45958] dfw [info]2026-05-31T03:18:26.612437577 [01KSY0MCP1970DJBEA4EQ56W3A:main] Running Firecracker v1.14.4
2026-05-31T03:18:26Z app[2869115ae45958] dfw [info]2026-05-31T03:18:26.612606207 [01KSY0MCP1970DJBEA4EQ56W3A:main] Listening on API socket ("/fc.sock").
2026-05-31T03:18:27Z runner[8e40d3b769e2d8] dfw [info]Successfully prepared image registry.fly.io/sigmapro-ml@sha256:5c0ec2490989d6deb4c86a3f16791cf2977624ad4225e3da1ed6285649128ee0 (2.788390586s)
2026-05-31T03:18:27Z app[2869115ae45958] dfw [info] INFO Starting init (commit: ea887ee)...
2026-05-31T03:18:27Z app[2869115ae45958] dfw [info] INFO Preparing to run: `uvicorn ml_service.main:app --host 0.0.0.0 --port 8080` as root
2026-05-31T03:18:27Z app[2869115ae45958] dfw [info] INFO [fly api proxy] listening at /.fly/api
2026-05-31T03:18:27Z runner[2869115ae45958] dfw [info]Machine created and started in 3.643s
2026-05-31T03:18:27Z app[2869115ae45958] dfw [info]2026/05/31 03:18:27 INFO SSH listening listen_address=[fdaa:78:e7f7:a7b:7df:4c09:4c66:2]:22
2026-05-31T03:18:28Z runner[8e40d3b769e2d8] dfw [info]Configuring firecracker
2026-05-31T03:18:39Z app[2869115ae45958] dfw [info]INFO:     Started server process [638]
2026-05-31T03:18:39Z app[2869115ae45958] dfw [info]INFO:     Waiting for application startup.
2026-05-31T03:18:39Z app[2869115ae45958] dfw [info]INFO:     Application startup complete.
2026-05-31T03:18:39Z app[2869115ae45958] dfw [info]INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)
2026-05-31T03:20:37Z app[2869115ae45958] dfw [info]⚠️  Advertencia: imbalanced-learn no instalado. SMOTE no disponible.
2026-05-31T03:20:37Z app[2869115ae45958] dfw [info]⚠️  Advertencia: SHAP no instalado. Instala con: pip install shap
2026-05-31T03:20:37Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:50938 - "GET /api/ml/health HTTP/1.1" 200 OK
2026-05-31T03:21:39Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:44410 - "GET /api/ml/health HTTP/1.1" 200 OK
2026-05-31T03:21:39Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:44424 - "OPTIONS /api/ml/datasets HTTP/1.1" 200 OK
2026-05-31T03:21:39Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:44438 - "OPTIONS /api/ml/models HTTP/1.1" 200 OK
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entren_temo_c_f.csv  (291 filas, 2 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entrenamiento_financiero.csv  (50 filas, 10 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entrenamiento_mpg.csv  (200 filas, 2 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entrenamiento_patron_alternativo.csv  (1,200 filas, 7 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entrenamiento_temporal.csv  (1,200 filas, 7 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/entrenamiento_texto.csv  (180 filas, 8 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/mi_nuevo_dataset.csv  (50 filas, 4 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]  ✔ CSV cargado: /app/Red_Neuronal/datos/training_temp.csv  (1,038 filas, 4 cols)
2026-05-31T03:21:40Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:44444 - "GET /api/ml/datasets HTTP/1.1" 200 OK
2026-05-31T03:21:41Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:44446 - "GET /api/ml/models HTTP/1.1" 200 OK
2026-05-31T03:22:02Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:40946 - "OPTIONS /api/ml/train HTTP/1.1" 200 OK
2026-05-31T03:22:02Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:40954 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:03Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:40956 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:05Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:40972 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:06Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:63924 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:06Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:63938 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:08Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:63946 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:10Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:63962 - "POST /api/ml/train HTTP/1.1" 404 Not Found
2026-05-31T03:22:11Z app[2869115ae45958] dfw [info]INFO:     172.16.4.122:63970 - "POST /api/ml/train HTTP/1.1" 404 Not Found