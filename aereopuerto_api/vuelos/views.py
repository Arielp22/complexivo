from datetime import datetime
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Gate, Flight
from .serializers import GateSerializer, FlightSerializer
from .permissions import IsAdminOrReadOnly
from .mongo import db


def registrar_evento_vuelo(flight_id, event_type, source="SYSTEM", note=""):
    """Integración: al crear/actualizar flight en SQL, genera evento en Mongo."""
    col = db["flight_events"]
    col.insert_one({
        "flight_id": flight_id,
        "event_type": event_type,
        "source": source,
        "note": note,
        "created_at": datetime.utcnow(),
    })


class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all().order_by("id")
    serializer_class = GateSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["code", "terminal"]
    ordering_fields = ["id", "code", "terminal"]


class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.select_related("gate").all().order_by("-id")
    serializer_class = FlightSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "gate"]
    search_fields = ["flight_number", "destination", "gate__code", "status"]
    ordering_fields = ["id", "departure_time", "status", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_permissions(self):
        # Público: SOLO listar vuelos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        flight = serializer.save()
        # Integración: al crear flight en SQL, generar evento CREATED en Mongo
        registrar_evento_vuelo(
            flight_id=flight.id,
            event_type="CREATED",
            source="SYSTEM",
            note=f"Vuelo {flight.flight_number} creado",
        )

    def perform_update(self, serializer):
        flight = serializer.save()
        # Integración: al actualizar estado del vuelo, generar evento en Mongo
        registrar_evento_vuelo(
            flight_id=flight.id,
            event_type=flight.status,
            source="SYSTEM",
            note=f"Vuelo {flight.flight_number} actualizado a {flight.status}",
        )