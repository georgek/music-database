from django.db import models


class Artist(models.Model):
    id = models.IntegerField(db_column="ArtistId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        managed = False
        db_table = "Artist"

    def __str__(self):
        return self.name


class Album(models.Model):
    id = models.IntegerField(db_column="AlbumId", primary_key=True)
    title = models.CharField(db_column="Title", max_length=160)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, db_column="ArtistId")

    class Meta:
        managed = False
        db_table = "Album"

    def __str__(self):
        return self.title


class Mediatype(models.Model):
    id = models.IntegerField(db_column="MediaTypeId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        managed = False
        db_table = "MediaType"

    def __str__(self):
        return self.name


class Genre(models.Model):
    id = models.IntegerField(db_column="GenreId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        managed = False
        db_table = "Genre"

    def __str__(self):
        return self.name


class Track(models.Model):
    id = models.IntegerField(db_column="TrackId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=200)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, db_column="AlbumId")
    media_type = models.ForeignKey(
        Mediatype, on_delete=models.CASCADE, db_column="MediaTypeId"
    )
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, db_column="GenreId")
    composer = models.CharField(db_column="Composer", max_length=220, blank=True)
    milliseconds = models.IntegerField(db_column="Milliseconds")
    bytes = models.IntegerField(db_column="Bytes", blank=True, null=True)
    unitprice = models.DecimalField(
        db_column="UnitPrice", max_digits=10, decimal_places=2
    )

    class Meta:
        managed = False
        db_table = "Track"

    def __str__(self):
        return self.name


# class Customer(models.Model):
#     id = models.IntegerField(
#         db_column="CustomerId", primary_key=True
#     )
#     first_name = models.CharField(
#         db_column="FirstName", max_length=40
#     )
#     last_name = models.CharField(
#         db_column="LastName", max_length=20
#     )
#     company = models.CharField(
#         db_column="Company", max_length=80, blank=True, null=True
#     )  # Field name made lowercase.
#     address = models.CharField(
#         db_column="Address", max_length=70, blank=True, null=True
#     )  # Field name made lowercase.
#     city = models.CharField(
#         db_column="City", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     state = models.CharField(
#         db_column="State", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     country = models.CharField(
#         db_column="Country", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     postalcode = models.CharField(
#         db_column="PostalCode", max_length=10, blank=True, null=True
#     )  # Field name made lowercase.
#     phone = models.CharField(
#         db_column="Phone", max_length=24, blank=True, null=True
#     )  # Field name made lowercase.
#     fax = models.CharField(
#         db_column="Fax", max_length=24, blank=True, null=True
#     )  # Field name made lowercase.
#     email = models.CharField(
#         db_column="Email", max_length=60
#     )  # Field name made lowercase.
#     supportrepid = models.ForeignKey(
#         "Employee", models.DO_NOTHING, db_column="SupportRepId", blank=True, null=True
#     )  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "Customer"


# class Employee(models.Model):
#     employeeid = models.IntegerField(
#         db_column="EmployeeId", primary_key=True
#     )  # Field name made lowercase.
#     lastname = models.CharField(
#         db_column="LastName", max_length=20
#     )  # Field name made lowercase.
#     firstname = models.CharField(
#         db_column="FirstName", max_length=20
#     )  # Field name made lowercase.
#     title = models.CharField(
#         db_column="Title", max_length=30, blank=True, null=True
#     )  # Field name made lowercase.
#     reportsto = models.ForeignKey(
#         "self", models.DO_NOTHING, db_column="ReportsTo", blank=True, null=True
#     )  # Field name made lowercase.
#     birthdate = models.DateTimeField(
#         db_column="BirthDate", blank=True, null=True
#     )  # Field name made lowercase.
#     hiredate = models.DateTimeField(
#         db_column="HireDate", blank=True, null=True
#     )  # Field name made lowercase.
#     address = models.CharField(
#         db_column="Address", max_length=70, blank=True, null=True
#     )  # Field name made lowercase.
#     city = models.CharField(
#         db_column="City", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     state = models.CharField(
#         db_column="State", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     country = models.CharField(
#         db_column="Country", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     postalcode = models.CharField(
#         db_column="PostalCode", max_length=10, blank=True, null=True
#     )  # Field name made lowercase.
#     phone = models.CharField(
#         db_column="Phone", max_length=24, blank=True, null=True
#     )  # Field name made lowercase.
#     fax = models.CharField(
#         db_column="Fax", max_length=24, blank=True, null=True
#     )  # Field name made lowercase.
#     email = models.CharField(
#         db_column="Email", max_length=60, blank=True, null=True
#     )  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "Employee"


# class Invoice(models.Model):
#     invoiceid = models.IntegerField(
#         db_column="InvoiceId", primary_key=True
#     )  # Field name made lowercase.
#     customerid = models.ForeignKey(
#         Customer, models.DO_NOTHING, db_column="CustomerId"
#     )  # Field name made lowercase.
#     invoicedate = models.DateTimeField(
#         db_column="InvoiceDate"
#     )  # Field name made lowercase.
#     billingaddress = models.CharField(
#         db_column="BillingAddress", max_length=70, blank=True, null=True
#     )  # Field name made lowercase.
#     billingcity = models.CharField(
#         db_column="BillingCity", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     billingstate = models.CharField(
#         db_column="BillingState", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     billingcountry = models.CharField(
#         db_column="BillingCountry", max_length=40, blank=True, null=True
#     )  # Field name made lowercase.
#     billingpostalcode = models.CharField(
#         db_column="BillingPostalCode", max_length=10, blank=True, null=True
#     )  # Field name made lowercase.
#     total = models.DecimalField(
#         db_column="Total", max_digits=10, decimal_places=2
#     )  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "Invoice"


# class Invoiceline(models.Model):
#     invoicelineid = models.IntegerField(
#         db_column="InvoiceLineId", primary_key=True
#     )  # Field name made lowercase.
#     invoiceid = models.ForeignKey(
#         Invoice, models.DO_NOTHING, db_column="InvoiceId"
#     )  # Field name made lowercase.
#     trackid = models.ForeignKey(
#         "Track", models.DO_NOTHING, db_column="TrackId"
#     )  # Field name made lowercase.
#     unitprice = models.DecimalField(
#         db_column="UnitPrice", max_digits=10, decimal_places=2
#     )  # Field name made lowercase.
#     quantity = models.IntegerField(db_column="Quantity")  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "InvoiceLine"


# class Playlist(models.Model):
#     playlistid = models.IntegerField(
#         db_column="PlaylistId", primary_key=True
#     )  # Field name made lowercase.
#     name = models.CharField(
#         db_column="Name", max_length=120, blank=True, null=True
#     )  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "Playlist"


# class Playlisttrack(models.Model):
#     playlistid = models.ForeignKey(
#         Playlist, models.DO_NOTHING, db_column="PlaylistId", primary_key=True
#     )  # Field name made lowercase.
#     trackid = models.ForeignKey(
#         "Track", models.DO_NOTHING, db_column="TrackId"
#     )  # Field name made lowercase.

#     class Meta:
#         managed = False
#         db_table = "PlaylistTrack"
#         unique_together = (("playlistid", "trackid"),)
