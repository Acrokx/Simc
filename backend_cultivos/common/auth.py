from django.contrib.auth.hashers import check_password
from usuarios.models import Usuario


def is_administrador(request):
    """Verificar si el usuario que hace la petición es administrador"""
    correo = request.headers.get('X-Usuario')
    password = request.headers.get('X-Password')
    
    if not correo or not password:
        return False
    
    try:
        usuario = Usuario.objects.get(correo__iexact=correo)
        if usuario.rol.lower() != 'administrador':
            return False
        if not check_password(password, usuario.contraseña):
            return False
        return True
    except Exception:
        return False