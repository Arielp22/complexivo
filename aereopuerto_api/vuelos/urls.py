from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GateViewSet, FlightViewSet
from .airlines_views import airlines_list_create, airlines_detail
from .flight_events_views import flight_events_list_create, flight_events_detail

router = DefaultRouter()
router.register(r"gates", GateViewSet, basename="gates")
router.register(r"flights", FlightViewSet, basename="flights")

urlpatterns = [
    # Mongo - airlines
    path("airlines/", airlines_list_create),
    path("airlines/<str:id>/", airlines_detail),
    # Mongo - flight events
    path("flight-events/", flight_events_list_create),
    path("flight-events/<str:id>/", flight_events_detail),
]

urlpatterns += router.urls