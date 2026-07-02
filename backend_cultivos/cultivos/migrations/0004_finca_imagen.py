from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cultivos', '0003_cultivo_nombre_cultivo_cultivo_tamaño_area_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='finca',
            name='imagen',
            field=models.TextField(blank=True, null=True),
        ),
    ]
