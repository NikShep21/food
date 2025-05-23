import json
import os

from django.core.management.base import BaseCommand

from recipes.models import Ingredient


class Command(BaseCommand):
    help = 'Загружает ингредиенты из JSON файла в базу данных'
    DEFAULT_FILE_PATH = '/app/data/ingredients.json'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default=self.DEFAULT_FILE_PATH,
            help='Путь к JSON файлу с ингредиентами'
        )

    def handle(self, *args, **options):
        file_path = options['file']

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'Файл не найден: {file_path}'))
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                ingredients_data = json.load(f)
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR(f'Ошибка декодирования '
                                               f'в файле: {file_path}'))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Не удалось прочитать файл '
                                               f'{file_path}: {e}'))
            return

        created_count = 0
        skipped_count = 0

        for item in ingredients_data:
            name = item.get('name')
            measurement_unit = item.get('measurement_unit')

            if not name or not measurement_unit:
                self.stdout.write(
                    self.style.WARNING(f'Пропуск записи из-за '
                                       f'отсутствия данных: {item}'))
                skipped_count += 1
                continue

            try:
                ingredient, created = Ingredient.objects.get_or_create(
                    name=name,
                    measurement_unit=measurement_unit
                )
                if created:
                    created_count += 1
                else:
                    skipped_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Ошибка при создании '
                                     f'ингредиента "{name}": {e}'))
                skipped_count += 1
        self.stdout.write(self.style.SUCCESS(
            f'Загрузка завершена. '
            f'Создано: {created_count}, Пропущено '
            f'(уже существуют или ошибка): {skipped_count}'
        ))
