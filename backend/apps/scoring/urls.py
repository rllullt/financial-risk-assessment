from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('<str:rut>', views.score_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)
