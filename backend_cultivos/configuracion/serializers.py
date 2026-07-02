from rest_framework import serializers
from .models import ConfiguracionInteligente, ConfiguracionSistema


class ConfiguracionInteligenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionInteligente
        fields = '__all__'


class ConfiguracionSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionSistema
        fields = '__all__'
