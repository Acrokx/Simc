from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_usuario_bloqueado'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='foto_perfil',
            field=models.TextField(blank=True, null=True),
        ),
    ]
