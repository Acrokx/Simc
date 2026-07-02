from django.db import models


class ConfiguracionInteligente(models.Model):
    TIPO_CHOICES = [
        ('humedad_suelo', 'Humedad del suelo'),
        ('temperatura', 'Temperatura ambiente'),
        ('ph_suelo', 'pH del suelo'),
        ('luz', 'Luz solar'),
        ('co2', 'CO2'),
    ]

    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES, unique=True)
    valor_minimo = models.FloatField()
    valor_maximo = models.FloatField()
    activa = models.BooleanField(default=True)
    mensaje_alerta = models.CharField(max_length=255)
    prioridad = models.CharField(max_length=20, default='media')

    class Meta:
        db_table = 'configuracion_inteligente'

    def __str__(self):
        return f"{self.get_tipo_display()} -> {self.valor_minimo} - {self.valor_maximo}"


class ConfiguracionSistema(models.Model):
    clave = models.CharField(max_length=100, unique=True)
    valor = models.TextField()
    descripcion = models.CharField(max_length=255, blank=True, default='')
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'configuracion_sistema'

    def __str__(self):
        return self.clave
