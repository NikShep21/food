import base64
import mimetypes
import uuid

from django.core.files.base import ContentFile
from rest_framework import serializers


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            header, base64_data = data.split(';base64,')
            mime_type = header.split(':')[-1]
            extension = mimetypes.guess_extension(mime_type)
            if not extension:
                extension = '.' + mime_type.split('/')[-1]
            file_name = f'{uuid.uuid4()}{extension}'
            decoded_file = base64.b64decode(base64_data)
            content_file = ContentFile(decoded_file, name=file_name)
            return content_file
        elif data is None or data == '':
            return None

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get('request', None)
        if request:
            try:
                abs_url = request.build_absolute_uri(value.url)
                return abs_url
            except Exception as e:
                try:
                    return value.url
                except e:
                    return None
        else:
            try:
                return value.url
            except Exception:
                return None
