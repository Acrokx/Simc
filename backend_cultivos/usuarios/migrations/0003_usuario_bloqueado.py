from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_usuario_apellido_usuario_telefono'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='bloqueado',
            field=models.BooleanField(default=False),
        ),
    ]
