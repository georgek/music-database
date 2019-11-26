from rest_framework import serializers

from .models import (
    Artist,
    Album,
    Mediatype,
    Genre,
    Track,
)


class ArtistSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"


class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = "__all__"


class MediatypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Mediatype
        fields = "__all__"


class GenreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"


class TrackSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Track
        fields = "__all__"
