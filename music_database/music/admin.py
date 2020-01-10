from django.contrib import admin

from .models import Album, Artist, Genre, Mediatype, Track


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "artist"]


@admin.register(Mediatype)
class MediatypeAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "album", "media_type", "genre", "milliseconds"]
