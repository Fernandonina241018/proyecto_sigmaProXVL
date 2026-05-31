Waiting for depot builder...
Waiting for depot builder...
==> Building image with Depot
--> build:  (​)
[+] Building 1.5s (11/11) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                                                                                    0.3s
 => => transferring dockerfile: 530B                                                                                                                                                                                                    0.3s
 => [internal] load metadata for docker.io/library/python:3.11-slim                                                                                                                                                                     0.3s
 => [internal] load .dockerignore                                                                                                                                                                                                       0.4s
 => => transferring context: 66B                                                                                                                                                                                                        0.4s
 => [1/7] FROM docker.io/library/python:3.11-slim@sha256:a3ab0b966bc4e91546a033e22093cb840908979487a9fc0e6e38295747e49ac0                                                                                                               0.0s
 => => resolve docker.io/library/python:3.11-slim@sha256:a3ab0b966bc4e91546a033e22093cb840908979487a9fc0e6e38295747e49ac0                                                                                                               0.0s
 => [internal] load build context                                                                                                                                                                                                       0.4s
 => => transferring context: 2B                                                                                                                                                                                                         0.3s
 => CACHED [2/7] WORKDIR /app                                                                                                                                                                                                           0.0s
 => CACHED [3/7] RUN apt-get update && apt-get install -y --no-install-recommends     libgomp1     build-essential     && rm -rf /var/lib/apt/lists/*                                                                                   0.0s
 => ERROR [4/7] COPY ml_service/requirements.txt .                                                                                                                                                                                      0.0s
 => CACHED [5/7] RUN pip install --no-cache-dir -r requirements.txt                                                                                                                                                                     0.0s
 => ERROR [6/7] COPY ml_service/ ./ml_service/                                                                                                                                                                                          0.0s
 => ERROR [7/7] COPY Red_Neuronal/ ./Red_Neuronal/                                                                                                                                                                                      0.0s
------
 > [4/7] COPY ml_service/requirements.txt .:
------
------
 > [6/7] COPY ml_service/ ./ml_service/:
------
------
 > [7/7] COPY Red_Neuronal/ ./Red_Neuronal/:
------
==> Building image
Waiting for depot builder...
Waiting for depot builder...
Waiting for depot builder...
Waiting for depot builder...
==> Building image with Depot
--> build:  (​)
[+] Building 1.6s (11/11) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                                                                                    0.5s
 => => transferring dockerfile: 530B                                                                                                                                                                                                    0.5s
 => [internal] load metadata for docker.io/library/python:3.11-slim                                                                                                                                                                     0.2s
 => [internal] load .dockerignore                                                                                                                                                                                                       0.4s
 => => transferring context: 66B                                                                                                                                                                                                        0.4s
 => [internal] load build context                                                                                                                                                                                                       0.4s
 => => transferring context: 2B                                                                                                                                                                                                         0.4s
 => [1/7] FROM docker.io/library/python:3.11-slim@sha256:a3ab0b966bc4e91546a033e22093cb840908979487a9fc0e6e38295747e49ac0                                                                                                               0.0s
 => => resolve docker.io/library/python:3.11-slim@sha256:a3ab0b966bc4e91546a033e22093cb840908979487a9fc0e6e38295747e49ac0                                                                                                               0.0s
 => CACHED [2/7] WORKDIR /app                                                                                                                                                                                                           0.0s
 => CACHED [3/7] RUN apt-get update && apt-get install -y --no-install-recommends     libgomp1     build-essential     && rm -rf /var/lib/apt/lists/*                                                                                   0.0s
 => ERROR [4/7] COPY ml_service/requirements.txt .                                                                                                                                                                                      0.0s
 => CACHED [5/7] RUN pip install --no-cache-dir -r requirements.txt                                                                                                                                                                     0.0s
 => ERROR [6/7] COPY ml_service/ ./ml_service/                                                                                                                                                                                          0.0s
 => ERROR [7/7] COPY Red_Neuronal/ ./Red_Neuronal/                                                                                                                                                                                      0.0s
------
 > [4/7] COPY ml_service/requirements.txt .:
------
------
 > [6/7] COPY ml_service/ ./ml_service/:
------
------
 > [7/7] COPY Red_Neuronal/ ./Red_Neuronal/:
------
Error: failed to fetch an image or build from source: error building: failed to solve: failed to compute cache key: failed to calculate checksum of ref evngnix511c6769qobf8t1kue::qolrbm0xml6f1oalgk3cqmu44: "/Red_Neuronal": not found