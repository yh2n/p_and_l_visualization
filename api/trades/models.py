from django.db import models

# Create your models here.

class Fills(models.Model):
    class Meta:
        db_table = "fills"

    order_id = models.BigIntegerField()
    fill_price = models.BigIntegerField()
    fill_quantity = models.FloatField()
    side = models.TextField()
    exchange = models.TextField()
    symbol = models.TextField()
    fees = models.FloatField()
    timestamp = models.BigIntegerField()