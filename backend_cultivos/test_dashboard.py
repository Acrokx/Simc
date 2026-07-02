#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

django.setup()

from django.core.management import call_command
from io import StringIO

# Test database connection
print("Testing database connection...")
try:
    from usuarios.models import Usuario
    from cultivos.models import Finca, Cultivo
    from sensores.models import Sensor
    from mediciones.models import Medicion
    from alertas.models import Alerta
    
    print(f"Usuarios: {Usuario.objects.count()}")
    print(f"Fincas: {Finca.objects.count()}")
    print(f"Cultivos: {Cultivo.objects.count()}")
    print(f"Sensores: {Sensor.objects.count()}")
    print(f"Mediciones: {Medicion.objects.count()}")
    print(f"Alertas: {Alerta.objects.count()}")
    print("Database OK!")
except Exception as e:
    print(f"Database error: {e}")
    import traceback
    traceback.print_exc()