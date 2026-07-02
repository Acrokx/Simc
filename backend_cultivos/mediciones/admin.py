from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponse
import csv
from .models import Medicion

@admin.register(Medicion)
class MedicionAdmin(admin.ModelAdmin):
    list_display = ('valor_humedad', 'fecha_medicion', 'id_sensor')
    list_filter = ('fecha_medicion',)
    search_fields = ('id_sensor__tipo_sensor',)
    actions = ['export_as_csv']

    def export_as_csv(self, request, queryset):
        """Export selected mediciones as CSV."""
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename={meta}.csv'
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        messages.success(request, f'{queryset.count()} mediciones exportadas exitosamente.')
        return response

    export_as_csv.short_description = "Exportar seleccionados como CSV"
