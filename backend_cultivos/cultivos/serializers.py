from rest_framework import serializers
from .models import Finca, Cultivo, HistorialRiego


class FincaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_finca', read_only=True)
    nombre_usuario = serializers.CharField(source='id_usuario.nombre', read_only=True)
    cultivos = serializers.SerializerMethodField()

    class Meta:
        model = Finca
        fields = ['id', 'id_finca', 'nombre_finca', 'ubicacion', 'tamaño_hectareas', 'tipo_cultivo', 'estado', 'descripcion', 'imagen', 'id_usuario', 'nombre_usuario', 'cultivos']

    def get_cultivos(self, obj):
        from .models import Cultivo
        cultivos = Cultivo.objects.filter(id_finca=obj.id_finca)
        return [{'id_cultivo': c.id_cultivo, 'nombre_cultivo': c.nombre_cultivo, 'tipo_cultivo': c.tipo_cultivo, 'estado': c.estado} for c in cultivos]


class CultivoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_cultivo', read_only=True)

    class Meta:
        model = Cultivo
        fields = ['id', 'id_cultivo', 'nombre_cultivo', 'tipo_cultivo', 'ubicacion', 'tamaño_area', 'fecha_siembra', 'estado', 'imagen', 'id_finca']


class HistorialRiegoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id_riego', read_only=True)

    class Meta:
        model = HistorialRiego
        fields = ['id', 'id_riego', 'fecha_riego', 'cantidad_agua', 'id_cultivo']