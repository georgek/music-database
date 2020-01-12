from rest_framework import viewsets

from music_database.music.models import Album, Artist, Genre, Mediatype, Track
from music_database.music.serializers import (
    AlbumSerializer,
    ArtistSerializer,
    GenreSerializer,
    MediatypeSerializer,
    TrackSerializer,
)


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class MediatypeViewSet(viewsets.ModelViewSet):
    queryset = Mediatype.objects.all()
    serializer_class = MediatypeSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
