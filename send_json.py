import pika
import json

connection = pika.BlockingConnection(pika.ConnectionParameters(host='127.0.0.1'))
channel = connection.channel()
# channel.basic_publish(exchange='mirror', routing_key'refresh', body='{ "json": "goes here"} ')
