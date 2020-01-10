import django_filters
from rest_framework import filters, viewsets

from ..models import Track
from ..serializers import TrackTableSerializer
from .filters import TrackTableFilter


class TrackTableViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Track.objects.select_related(
        "album", "album__artist", "media_type", "genre"
    )
    serializer_class = TrackTableSerializer
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        django_filters.rest_framework.DjangoFilterBackend,
    ]
    ordering_fields = [
        "id",
        "name",
        "album__title",
        "album__artist__name",
        "milliseconds",
    ]
    search_fields = ["name", "album__title", "album__artist__name"]
    filterset_class = TrackTableFilter
