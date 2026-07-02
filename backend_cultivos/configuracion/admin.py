from django.contrib import admin
from .models import ConfiguracionInteligente, ConfiguracionSistema


@admin.register(ConfiguracionInteligente)
class ConfiguracionInteligenteAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'valor_minimo', 'valor_maximo', 'activa', 'prioridad')
    list_filter = ('tipo', 'activa', 'prioridad')


@admin.register(ConfiguracionSistema)
class ConfiguracionSistemaAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion', 'actualizado_en')
    search_fields = ('clave', 'descripcion')
