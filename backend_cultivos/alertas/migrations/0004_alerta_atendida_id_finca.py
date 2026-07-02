# Generated migration to merge the alertas branches.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alertas', '0002_alerta_atendida_id_finca'),
        ('alertas', '0003_alerta_id_sensor'),
        ('cultivos', '__first__'),
    ]

    operations = []