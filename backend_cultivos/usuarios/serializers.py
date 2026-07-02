from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_usuario', read_only=True)
    num_fincas = serializers.IntegerField(read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'id_usuario', 'nombre', 'apellido', 'correo', 'telefono', 'contraseña', 'rol', 'fecha_registro', 'num_fincas']
        extra_kwargs = {
            'contraseña': {'write_only': True},
            'fecha_registro': {'read_only': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'id' in data:
            data['id_usuario'] = data['id']
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