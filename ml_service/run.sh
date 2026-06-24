#!/bin/bash
export MPLBACKEND=Agg
export PYTHONPATH="${PYTHONPATH}:/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/Red_Neuronal"
exec python3 -u "/mnt/g/My Drive/SigmaProWeb/proyecto_sigmaProXVL/ml_service/main.py"
