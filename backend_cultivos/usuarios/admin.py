from django.contrib import admin
from django.contrib import messages
from django.utils.html import escape
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'correo', 'rol', 'fecha_registro')
    list_filter = ('rol', 'fecha_registro')
    search_fields = ('nombre', 'correo')

    def delete_model(self, request, obj):
        """Override to add a success message after deletion."""
        obj_name = escape(obj.nombre)
        super().delete_model(request, obj)
        messages.success(request, f'El usuario "{obj_name}" ha sido eliminado exitosamente.')

    def delete_queryset(self, request, queryset):
        """Override to add a success message after bulk deletion."""
        count = queryset.count()
        count_str = str(count)
        super().delete_queryset(request, queryset)
        messages.success(request, f'{count_str} usuarios han sido eliminados exitosamente.')

    def change_view(self, request, object_id, form_url='', extra_context=None):
        # Only add _popup for edit actions (when object_id exists)
        if object_id and '_popup' not in request.GET:
            # Make a mutable copy of GET parameters
            request.GET = request.GET.copy()
            request.GET['_popup'] = '1'
        return super().change_view(request, object_id, form_url, extra_context=extra_context)