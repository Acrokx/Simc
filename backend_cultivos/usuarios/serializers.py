from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_usuario', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'id_usuario', 'nombre', 'apellido', 'correo', 'telefono', 'foto_perfil', 'contraseña', 'rol', 'bloqueado', 'fecha_registro']
        extra_kwargs = {
            'contraseña': {'write_only': True},
            'fecha_registro': {'read_only': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'id' in data:
            data['id_usuario'] = data['id']
        try:
            from cultivos.models import Finca
            data['num_fincas'] = Finca.objects.filter(id_usuario=instance.id_usuario).count()
        except Exception:
            data['num_fincas'] = 0
        return data

    def create(self, validated_data):
        contraseña = validated_data.pop('contraseña', '')
        usuario = Usuario(**validated_data)
        if contraseña:
            usuario.contraseña = make_password(contraseña)
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        contraseña = validated_data.pop('contraseña', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if contraseña:
            instance.contraseña = make_password(contraseña)
        instance.save()
        return instance