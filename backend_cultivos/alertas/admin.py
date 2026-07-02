from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
import csv
from datetime import datetime
from .models import Alerta

@admin.register(Alerta)
class AlertaAdmin(admin.ModelAdmin):
    list_display = ('tipo_alerta', 'descripcion', 'fecha_alerta', 'prioridad', 'leida', 'id_sensor')
    list_filter = ('tipo_alerta', 'fecha_alerta', 'prioridad', 'leida')
    search_fields = ('descripcion',)
    actions = ['export_as_csv', 'marcar_como_leida', 'generar_reporte_alertas']

    def export_as_csv(self, request, queryset):
        """Export selected alertas as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} alertas exportadas exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"

    def marcar_como_leida(self, request, queryset):
        """Mark selected alertas as read."""
        updated = queryset.update(leida=True)
        messages.success(request, f'{updated} alertas marcadas como leídas.')
    
    marcar_como_leida.short_description = "Marcar seleccionadas como leídas"

    def generar_reporte_alertas(self, request, queryset):
        """Generate report for selected alertas."""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="reporte_alertas_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        writer = csv.writer(response)
        
        # Write header
        writer.writerow(['Tipo Alerta', 'Descripción', 'Fecha Alerta', 'Prioridad', 'Leída', 'Sensor Asociado'])
        
        for alerta in queryset:
            sensor_info = f"{alerta.id_sensor}" if alerta.id_sensor else "N/A"
            writer.writerow([
                alerta.tipo_alerta,
                alerta.descripcion,
                alerta.fecha_alerta,
                alerta.prioridad,
                "Sí" if alerta.leida else "No",
                sensor_info
            ])
        
        messages.success(request, f'Reporte de alertas generado para {queryset.count()} alertas.')
        return response

    generar_reporte_alertas.short_description = "Generar reporte de alertas"
