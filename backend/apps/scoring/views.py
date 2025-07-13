from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.users.models import UserProfile
import re
import json

@api_view(['GET'])
def score_detail(request, rut):
    """
    Retrieve a score
    """
    responses = [
        {
            "id": 1,
            "rut": "12345678-1",
            "score": 73,
            "fecha": "2025-07-11T14:35:00Z",
        },
        {
            "id": 2,
            "rut": "12345678-2",
            "score": 73,
            "fecha": "2025-07-11T14:35:00Z",
        },
    ]

    print(str(rut))
    pattern = re.compile(r"^\d{8}-\d$")
    print(pattern)
    print(pattern.match(rut))

    if pattern.match(rut):
        if request.user.is_staff:
            response = filter(lambda r: r["rut"] == rut, responses)
            return Response(response)
        
        # Check if the requested rut is their rut
        user_rut = UserProfile.objects.get(user=request.user).rut
        if rut == user_rut:
            response = filter(lambda r: r["rut"] == rut, responses)
            return Response(response)
        
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)
