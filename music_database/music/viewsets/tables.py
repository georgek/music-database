from rest_framework import viewsets

from ..models import Track

from ..serializers import TrackTableSerializer


class TrackTableViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Track.objects.select_related(
        "album",
        "media_type",
        "genre",
    )
    serializer_class = TrackTableSerializer
