#!/usr/bin/env python
"""Script para iniciar el servidor Django en todas las interfaces"""

import os
import sys
import subprocess

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'])