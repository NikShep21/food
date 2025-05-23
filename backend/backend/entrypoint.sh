#!/bin/sh
set -e

mkdir -p /app/staticfiles_collected /app/media

chmod -R 777 /app/staticfiles_collected /app/media


while ! nc -z db_inform 5432; do
  sleep 0.1
done

python manage.py makemigrations --noinput
python manage.py migrate --noinput

python manage.py load_ingredients
echo "Loading ingredients finished."

python manage.py collectstatic --noinput

ADMIN_STATIC_SOURCE="/usr/local/lib/python3.9/site-packages/django/contrib/admin/static/admin"
STATIC_ROOT_ADMIN_TARGET="/app/staticfiles_collected/admin"


mkdir -p "${STATIC_ROOT_ADMIN_TARGET}"
chmod -R 777 "${STATIC_ROOT_ADMIN_TARGET}"
if [ -d "${ADMIN_STATIC_SOURCE}" ]; then
  cp -R "${ADMIN_STATIC_SOURCE}/." "${STATIC_ROOT_ADMIN_TARGET}/"
fi

exec gunicorn inform.wsgi:application --bind 0.0.0.0:8000
