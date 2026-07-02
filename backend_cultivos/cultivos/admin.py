from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
import csv
from .models import Finca, Cultivo, HistorialRiego
from datetime import datetime

@admin.register(Finca)
class FincaAdmin(admin.ModelAdmin):
    list_display = ('nombre_finca', 'ubicacion', 'tamaño_hectareas', 'id_usuario')
    list_filter = ('id_usuario',)
    search_fields = ('nombre_finca', 'ubicacion')
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        """Export selected fincas as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} fincas exportadas exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"

@admin.register(Cultivo)
class CultivoAdmin(admin.ModelAdmin):
    list_display = ('tipo_cultivo', 'fecha_siembra', 'estado', 'id_finca')
    list_filter = ('estado', 'fecha_siembra')
    search_fields = ('tipo_cultivo',)
    actions = ['export_as_csv', 'generar_reporte_riego']

    def export_as_csv(self, request, queryset):
        """Export selected cultivos as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} cultivos exportados exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"

    def generar_reporte_riego(self, request, queryset):
        """Generate irrigation report for selected cultivos."""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="reporte_riego_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        writer = csv.writer(response)
        
        # Write header
        writer.writerow(['Cultivo', 'Finca', 'Fecha Siembra', 'Estado', 'Total Riegos', 'Último Riego'])
        
        for cultivo in queryset:
            total_riegos = cultivo.historialriego_set.count()
            ultimo_riego = cultivo.historialriego_set.order_by('-fecha_riego').first()
            ultimo_fecha = ultimo_riego.fecha_riego if ultimo_riego else 'Nunca'
            
            writer.writerow([
                cultivo.tipo_cultivo,
                cultivo.id_finca.nombre_finca if cultivo.id_finca else 'Sin finca',
                cultivo.fecha_siembra,
                cultivo.estado,
                total_riegos,
                ultimo_fecha
            ])
        
        messages.success(request, f'Reporte de riego generado para {queryset.count()} cultivos.')
        return response

    generar_reporte_riego.short_description = "Generar reporte de riego"

@admin.register(HistorialRiego)
class HistorialRiegoAdmin(admin.ModelAdmin):
    list_display = ('id_cultivo', 'fecha_riego', 'cantidad_agua')
    list_filter = ('fecha_riego',)
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        """Export selected historial de riegos as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} registros de riego exportados exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"