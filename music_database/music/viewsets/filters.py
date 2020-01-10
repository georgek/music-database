from django_filters import rest_framework as filters

from .models import Genre, Track


class TrackTableFilter(filters.FilterSet):
    class Meta:
        model = Track
        fields = ["name", "album", "artist", "genre"]

    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    album = filters.CharFilter(field_name="album__title", lookup_expr="icontains")
    artist = filters.CharFilter(
        field_name="album__artist__name", lookup_expr="icontains"
    )
    genre = filters.ModelChoiceFilter(field_name="genre", queryset=Genre.objects.all())
