from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password, check_password
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import Usuario
from .serializers import UsuarioSerializer
from common.mixins import AdminRequiredMixin
from common.auth import is_administrador
from cultivos.models import Cultivo, Finca
from sensores.models import Sensor
from mediciones.models import Medicion
from alertas.models import Alerta


@method_decorator(csrf_exempt, name='dispatch')
class UsuarioViewSet(AdminRequiredMixin, viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('-fecha_registro')
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        rol = self.request.query_params.get('rol')
        if rol:
            queryset = queryset.filter(rol__iexact=rol)
        return queryset

    @action(detail=True, methods=['post'])
    def bloquear(self, request, pk=None):
        usuario = self.get_object()
        usuario.bloqueado = not usuario.bloqueado
        usuario.save()
        return Response({'success': True, 'bloqueado': usuario.bloqueado})


@api_view(['GET', 'POST'])
def crear_usuario_admin(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo admins'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        usuarios = Usuario.objects.all().order_by('-fecha_registro')
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

    serializer = UsuarioSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH', 'DELETE'])
def usuario_detail(request, pk):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo admins'}, status=status.HTTP_403_FORBIDDEN)

    try:
        usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    usuario.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_usuario(request):
    correo = request.data.get('correo') or request.data.get('email') or request.data.get('username')
    contraseña = request.data.get('contraseña') or request.data.get('password') or request.data.get('pwd')

    if not correo or not contraseña:
        return Response({'error': 'Correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        usuario = Usuario.objects.get(correo__iexact=correo)
    except Usuario.DoesNotExist:
        return Response({'success': False, 'message': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(contraseña, usuario.contraseña):
        usuario_data = UsuarioSerializer(usuario).data
        return Response({
            'success': True,
            'usuario': usuario_data
        }, status=status.HTTP_200_OK)

    return Response({'success': False, 'message': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def registro_usuario(request):
    if not is_administrador(request):
        return Response({'error': 'Acceso denegado: solo administradores pueden crear usuarios'}, status=status.HTTP_403_FORBIDDEN)
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido', '')
    correo = request.data.get('correo')
    contraseña = request.data.get('contraseña') or request.data.get('password')
    telefono = request.data.get('telefono', '')
    rol = request.data.get('rol', 'Agricultor')

    if not nombre or not correo or not contraseña:
        return Response({'error': 'nombre, correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if Usuario.objects.filter(correo__iexact=correo).exists():
        return Response({'error': 'El correo ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

    usuario = Usuario.objects.create(
        nombre=nombre,
        apellido=apellido,
        correo=correo,
        contraseña=make_password(contraseña),
        telefono=telefono,
        rol=rol
    )

    return Response({'success': True, 'usuario': UsuarioSerializer(usuario).data}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def crear_usuario_publico(request):
    """Registro público para crear usuarios sin autenticación previa"""
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido', '')
    correo = request.data.get('correo')
    contraseña = request.data.get('contraseña') or request.data.get('password')
    telefono = request.data.get('telefono', '')
    rol = 'Agricultor'

    if not nombre or not correo or not contraseña:
        return Response({'error': 'nombre, correo y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if Usuario.objects.filter(correo__iexact=correo).exists():
        return Response({'error': 'El correo ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

    usuario = Usuario.objects.create(
        nombre=nombre,
        apellido=apellido,
        correo=correo,
        contraseña=make_password(contraseña),
        telefono=telefono,
        rol=rol
    )

    return Response({'success': True, 'usuario': UsuarioSerializer(usuario).data}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def agricultores_view(request):
    agricultores = Usuario.objects.filter(rol__iexact='Agricultor')
    data = UsuarioSerializer(agricultores, many=True).data
    # Agregar número de fincas por agricultor
    from cultivos.models import Finca
    for item in data:
        fincas_count = Finca.objects.filter(id_usuario=item['id_usuario']).count()
        item['num_fincas'] = fincas_count
    return Response(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_usuario(request):
    return Response({'success': True, 'message': 'Logout successful'})


@api_view(['DELETE'])
@permission_classes([AllowAny])
def eliminar_agricultor(request, pk):
    """Eliminar un agricultor por ID"""
    correo = request.headers.get('X-Usuario')
    password = request.headers.get('X-Password')
    if not correo or not password:
        return Response({'error': 'Acceso denegado: se requieren credenciales'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        administrador = Usuario.objects.get(correo__iexact=correo, rol__iexact='Administrador')
        if not check_password(password, administrador.contraseña):
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario administrador no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    try:
        fincas = Finca.objects.filter(id_usuario=usuario)
        cultivos = Cultivo.objects.filter(id_finca__in=fincas)
        sensors = Sensor.objects.filter(id_cultivo__in=cultivos)
        try:
            Medicion.objects.filter(id_sensor__in=sensors).delete()
        except Exception:
            pass
        try:
            Alerta.objects.filter(id_sensor__in=sensors).delete()
        except Exception:
            pass
        try:
            sensors.delete()
        except Exception:
            pass
        try:
            cultivos.delete()
        except Exception:
            pass
        try:
            fincas.delete()
        except Exception:
            pass
        try:
            usuario.delete()
        except Exception as e2:
            import logging
            logging.getLogger(__name__).error('Error borrando usuario %s: %s', pk, e2, exc_info=True)
            return Response({'error': f'Error borrando usuario: {str(e2)}'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': True, 'message': 'Usuario eliminado'})
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import logging, traceback
        logging.getLogger(__name__).error('Error eliminando usuario %s: %s', pk, e, exc_info=True)
        tb = traceback.format_exc(limit=3)
        details = str(e)
        if 'no such table' in details.lower() or 'protected' in details.lower() or 'foreign key' in details.lower() or 'referential integrity' in details.lower():
            details = (
                'No se puede eliminar este usuario por problemas de integridad o base de datos incompleta. '
                'Verifica las migraciones ejecutando: python manage.py migrate'
            )
        return Response({
            'error': 'Error eliminando usuario',
            'details': details,
            'traceback': tb,
        }, status=status.HTTP_400_BAD_REQUEST)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import logging, traceback
        logging.getLogger(__name__).error('Error eliminando usuario %s: %s', pk, e, exc_info=True)
        tb = traceback.format_exc(limit=3)
        details = str(e)
        if 'protected' in details.lower() or 'foreign key' in details.lower() or 'referential integrity' in details.lower():
            details = (
                'No se puede eliminar este usuario porque tiene registros relacionados, '
                'por ejemplo: fincas, cultivos, sensores, mediciones o alertas asociadas.'
            )
        return Response({
            'error': 'Error eliminando usuario',
            'details': details,
            'traceback': tb,
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def editar_agricultor(request, pk):
    """Editar un agricultor por ID (solo admin)"""
    # Verificar que el usuario haciendo la petición es administrador
    correo = request.headers.get('X-Usuario')
    password = request.headers.get('X-Password')
    if not correo or not password:
        return Response({'error': 'Acceso denegado: se requieren credenciales'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        administrador = Usuario.objects.get(correo__iexact=correo, rol__iexact='Administrador')
        if not check_password(password, administrador.contraseña):
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario administrador no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
  
    nombre_val = request.data.get('nombre')
    apellido_val = request.data.get('apellido')
    telefono_val = request.data.get('telefono')
    contraseña_val = request.data.get('contraseña') or request.data.get('password')
    rol_val = request.data.get('rol')
    bloqueado_val = request.data.get('bloqueado')
   
    if nombre_val is not None:
        usuario.nombre = nombre_val
    if apellido_val is not None:
        usuario.apellido = apellido_val
    if telefono_val is not None:
        usuario.telefono = telefono_val
    if contraseña_val:
        usuario.contraseña = make_password(contraseña_val)
    if rol_val is not None:
        usuario.rol = rol_val
    if bloqueado_val is not None:
        usuario.bloqueado = bool(bloqueado_val)
   
    usuario.save()
    return Response({'success': True, 'usuario': UsuarioSerializer(usuario).data})


@api_view(['PUT', 'PATCH'])
@permission_classes([AllowAny])
def editar_perfil(request):
    """Editar el perfil del usuario actual"""
    correo = request.data.get('correo')
    if not correo:
        return Response({'error': 'Correo requerido'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        usuario = Usuario.objects.get(correo=correo)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    nombre = request.data.get('nombre')
    apellido = request.data.get('apellido')
    telefono = request.data.get('telefono')
    nueva_contraseña = request.data.get('password')
    
    if nombre:
        usuario.nombre = nombre
    if apellido is not None:
        usuario.apellido = apellido
    if telefono is not None:
        usuario.telefono = telefono
    if nueva_contraseña:
        usuario.contraseña = make_password(nueva_contraseña)
    
    usuario.save()
    return Response({'success': True, 'usuario': UsuarioSerializer(usuario).data})


@api_view(['GET'])
@permission_classes([AllowAny])
def administrador_check(request, pk):
    """Verificar si un usuario es administrador"""
    try:
        usuario = Usuario.objects.get(pk=pk)
        return Response({'is_admin': usuario.rol == 'Administrador'})
    except Usuario.DoesNotExist:
        return Response({'is_admin': False})