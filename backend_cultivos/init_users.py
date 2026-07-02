#!/usr/bin/env python
"""
Script para crear usuarios iniciales en SIMC
Ejecutar: python init_users.py
"""

import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from usuarios.models import Usuario

def create_initial_users():
    users = [
        {
            'nombre': 'Administrador',
            'apellido': 'Sistema',
            'correo': 'admin@simc.com',
            'contraseña': 'admin123',
            'telefono': '3000000000',
            'rol': 'Administrador'
        },
        {
            'nombre': 'Juan',
            'apellido': 'Pérez',
            'correo': 'juan@simc.com',
            'contraseña': 'juan123456',
            'telefono': '3001111111',
            'rol': 'Agricultor'
        },
        {
            'nombre': 'María',
            'apellido': 'González',
            'correo': 'maria@simc.com',
            'contraseña': 'maria123456',
            'telefono': '3002222222',
            'rol': 'Agricultor'
        },
    ]

    for user_data in users:
        correo = user_data['correo']
        if Usuario.objects.filter(correo=correo).exists():
            print(f"Usuario {correo} ya existe - actualizando...")
            user = Usuario.objects.get(correo=correo)
            user.nombre = user_data['nombre']
            user.apellido = user_data['apellido']
            user.contraseña = make_password(user_data['contraseña'])
            user.telefono = user_data['telefono']
            user.rol = user_data['rol']
            user.save()
        else:
            Usuario.objects.create(
                nombre=user_data['nombre'],
                apellido=user_data['apellido'],
                correo=user_data['correo'],
                contraseña=make_password(user_data['contraseña']),
                telefono=user_data['telefono'],
                rol=user_data['rol']
            )
        print(f"Creado/actualizado usuario: {correo}")

    print("\nUsuarios creados exitosamente!")
    print("\nCredenciales para login:")
    for u in users:
        print(f"  Email: {u['correo']} | Contraseña: {u['contraseña']}")

if __name__ == '__main__':
    create_initial_users()