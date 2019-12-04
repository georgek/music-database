from rest_framework import viewsets

from ..models import (
    Artist,
    Album,
    Mediatype,
    Genre,
    Track,
)
from ..serializers import (
    ArtistSerializer,
    AlbumSerializer,
    MediatypeSerializer,
    GenreSerializer,
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
