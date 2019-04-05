
from .serializers import WorkSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from works.models import Work

class WorkListAPIView(generics.ListAPIView):
    lookup_field = 'pk'
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    permission_classes = (IsAdminUser,)
