from rest_framework import serializers


class AirlineSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=10)
    country = serializers.CharField(max_length=100)
    is_active = serializers.BooleanField(default=True)


class FlightEventSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField()  # ID del vuelo en PostgreSQL
    event_type = serializers.ChoiceField(
        choices=[
            "CREATED",
            "BOARDING_STARTED",
            "DEPARTED",
            "DELAYED",
            "CANCELLED",
        ],
    )
    source = serializers.ChoiceField(
        choices=["WEB", "MOBILE", "SYSTEM"],
        default="SYSTEM",
    )
    note = serializers.CharField(required=False, allow_blank=True)