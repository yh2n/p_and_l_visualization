from rest_framework import serializers
from trades.models import Fills

class FillSerializer(serializers.ModelSerializer):
    # timestamp = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Fills
        fields = ("order_id","fill_price", "fill_quantity", "side", "exchange", "symbol", "fees", "timestamp")