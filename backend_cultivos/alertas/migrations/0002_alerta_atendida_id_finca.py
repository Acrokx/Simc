# Generated migration for alertas app

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('alertas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='alerta',
            name='atendida',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='alerta',
            name='id_finca',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='alertas', to='cultivos.Finca'),
        ),
    ]