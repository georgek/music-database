# Generated by Django 2.2.7 on 2019-11-22 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.IntegerField(db_column='AlbumId', primary_key=True, serialize=False)),
                ('title', models.CharField(db_column='Title', max_length=160)),
            ],
            options={
                'db_table': 'Album',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.IntegerField(db_column='ArtistId', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='Name', max_length=120)),
            ],
            options={
                'db_table': 'Artist',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.IntegerField(db_column='GenreId', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='Name', max_length=120)),
            ],
            options={
                'db_table': 'Genre',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Mediatype',
            fields=[
                ('id', models.IntegerField(db_column='MediaTypeId', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='Name', max_length=120)),
            ],
            options={
                'db_table': 'MediaType',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Track',
            fields=[
                ('id', models.IntegerField(db_column='TrackId', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='Name', max_length=200)),
                ('composer', models.CharField(blank=True, db_column='Composer', max_length=220, null=True)),
                ('milliseconds', models.IntegerField(db_column='Milliseconds')),
                ('bytes', models.IntegerField(blank=True, db_column='Bytes', null=True)),
                ('unitprice', models.DecimalField(db_column='UnitPrice', decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'Track',
                'managed': False,
            },
        ),
    ]