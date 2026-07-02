from rest_framework import viewsets, status
from rest_framework.response import Response
from .auth import is_administrador
from usuarios.models import Usuario


class AdminRequiredMixin:
    """Mixin that restricts create/update/destroy to administrators."""

    def create(self, request, *args, **kwargs):
        if not is_administrador(request):
            return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not is_administrador(request):
            return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_administrador(request):
            return Response({'error': 'Acceso denegado: solo administradores'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class AdminOrOwnerRequiredMixin:
    """Mixin that restricts create/update/destroy to administrators or resource owners."""

    def _get_authenticated_user(self, request):
        try:
            correo = request.headers.get('X-Usuario')
            if not correo:
                return None
            return Usuario.objects.get(correo__iexact=correo)
        except Usuario.DoesNotExist:
            return None

    def _is_admin_or_owner(self, request, instance):
        user = self._get_authenticated_user(request)
        if user and user.rol.lower() == 'administrador':
            return True
        if instance is None:
            return False
        owner = getattr(getattr(instance, 'id_usuario', None), 'id_usuario', None)
        if owner is None and hasattr(instance, 'id_finca'):
            owner = getattr(instance.id_finca, 'id_usuario_id', None)
        if owner is None and hasattr(instance, 'id_cultivo'):
            owner = getattr(getattr(instance, 'id_cultivo', None), 'id_finca_id', None)
            if owner is not None:
                from cultivos.models import Finca
                try:
                    owner = Finca.objects.get(pk=owner).id_usuario_id
                except Finca.DoesNotExist:
                    owner = None
        if owner is None and hasattr(instance, 'id_sensor'):
            owner = getattr(getattr(getattr(instance, 'id_sensor', None), 'id_cultivo', None), 'id_finca_id', None)
            if owner is not None:
                from cultivos.models import Finca
                try:
                    owner = Finca.objects.get(pk=owner).id_usuario_id
                except Finca.DoesNotExist:
                    owner = None
        return user is not None and owner is not None and user.id_usuario == owner

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        if not self._is_admin_or_owner(request, instance):
            instance.delete()
            return Response({'error': 'Acceso denegado: no eres propietario'}, status=status.HTTP_403_FORBIDDEN)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if not self._is_admin_or_owner(request, instance):
            return Response({'error': 'Acceso denegado: no eres propietario'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not self._is_admin_or_owner(request, instance):
            return Response({'error': 'Acceso denegado: no eres propietario'}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)