from django.db import models


class Gate(models.Model):
    code = models.CharField(max_length=10, unique=True)
    terminal = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "gates"

    def __str__(self):
        return f"{self.code} (Terminal {self.terminal})"


class Flight(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        BOARDING = "BOARDING", "Boarding"
        DEPARTED = "DEPARTED", "Departed"
        DELAYED = "DELAYED", "Delayed"
        CANCELLED = "CANCELLED", "Cancelled"

    gate = models.ForeignKey(Gate, on_delete=models.PROTECT, related_name="flights")
    flight_number = models.CharField(max_length=20)
    destination = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )
    departure_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "flights"

    def __str__(self):
        return f"{self.flight_number} -> {self.destination} ({self.status})"
