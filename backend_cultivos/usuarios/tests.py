import json

from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from usuarios.models import Usuario


class UsuarioAdminCrudTest(TestCase):
    def setUp(self):
        self.admin = Usuario.objects.create(
            nombre='Admin',
            correo='admin@test.com',
            contraseña=make_password('adminpwd'),
            rol='Administrador'
        )
        self.agricultor = Usuario.objects.create(
            nombre='Agri',
            correo='agri@test.com',
            contraseña=make_password('agripwd'),
            rol='Agricultor'
        )
        self.client = Client()
        self.headers = {
            'HTTP_X_USUARIO': 'admin@test.com',
            'HTTP_X_PASSWORD': 'adminpwd'
        }

    def test_admin_crea_agricultor(self):
        response = self.client.post(
            '/api/usuarios/',
            {
                'nombre': 'Nuevo Agri',
                'correo': 'nuevo@test.com',
                'contraseña': 'nuevopwd',
                'rol': 'Agricultor'
            },
            **self.headers
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['rol'], 'Agricultor')
        self.assertEqual(data['nombre'], 'Nuevo Agri')

    def test_admin_edita_usuario_role_y_bloqueo(self):
        payload = {
            'rol': 'Administrador',
            'bloqueado': True
        }
        response = self.client.patch(
            f'/api/usuarios/{self.agricultor.pk}/',
            json.dumps(payload),
            content_type='application/json',
            **self.headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['rol'], 'Administrador')
        self.assertTrue(data['bloqueado'])

    def test_admin_elimina_usuario(self):
        response = self.client.delete(f'/api/usuarios/{self.agricultor.pk}/', **self.headers)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Usuario.objects.filter(pk=self.agricultor.pk).exists())
