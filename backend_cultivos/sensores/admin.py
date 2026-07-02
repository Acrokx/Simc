from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
import csv
from .models import Sensor

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('tipo_sensor', 'ubicacion', 'estado', 'id_cultivo')
    list_filter = ('estado',)
    search_fields = ('ubicacion',)
    actions = ['export_as_csv', 'ver_mediciones_recientes', 'configurar_alerta']

    def export_as_csv(self, request, queryset):
        """Export selected sensors as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} sensores exportados exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"

    def ver_mediciones_recientes(self, request, queryset):
        """View recent measurements for selected sensors."""
        if queryset.count() == 1:
            sensor = queryset.first()
            from mediciones.models import Medicion
            recientes = Medicion.objects.filter(id_sensor=sensor).order_by('-fecha_medicion')[:10]
            
            html = f"""
            <h2>Mediciones recientes para {sensor}</h2>
            <table border="1">
                <tr><th>Fecha</th><th>Valor Humedad (%)</th></tr>
            """
            for medicion in recientes:
                html += f"<tr><td>{medicion.fecha_medicion}</td><td>{medicion.valor_humedad}</td></tr>"
            html += "</table>"
            
            return HttpResponse(html)
        else:
            messages.warning(request, "Por favor seleccione solo un sensor para ver sus mediciones.")
            return None

    ver_mediciones_recientes.short_description = "Ver mediciones recientes"

    def configurar_alerta(self, request, queryset):
        """Configure alerts for selected sensors (redirect to alert configuration)."""
        if queryset.count() == 1:
            sensor = queryset.first()
            # Redirect to alert configuration page for this sensor
            from django.http import HttpResponseRedirect
            from django.urls import reverse
            url = reverse('admin:alertas_alerta_changelist') + f'?id_sensor__exact={sensor.id_sensor}'
            return HttpResponseRedirect(url)
        else:
            messages.warning(request, "Por favor seleccione solo un sensor para configurar alertas.")
            return None

    configurar_alerta.short_description = "Configurar alertas para este sensor"
