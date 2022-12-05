from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from trades.models import Fills
from trades.serializers import FillSerializer
# Create your views here.

@csrf_exempt
def fillApi(request):
    if request.method == "GET":
        fills = Fills.objects.all()
        fills_serializer = FillSerializer(fills, many=True)
        return JsonResponse(fills_serializer.data, safe=False)