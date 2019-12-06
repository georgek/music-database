from rest_framework import viewsets
from rest_framework import filters

from ..models import Track

from ..serializers import TrackTableSerializer


class TrackTableViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Track.objects.select_related(
        "album",
        "album__artist",
        "media_type",
        "genre",
    )
    serializer_class = TrackTableSerializer
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    ordering_fields = [
        "id",
        "name",
        "album__title",
        "album__artist__name",
        "milliseconds",
    ]
    search_fields = [
        "name",
    ]
