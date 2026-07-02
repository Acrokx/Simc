from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    request = context.get('request')
    path = request.path if request else ''
    method = request.method if request else ''

    if response is not None:
        status_code = response.status_code
        data = response.data

        if status_code >= 500:
            logger.error(
                'Unhandled server error %s %s: %s',
                method,
                path,
                exc,
                exc_info=True,
            )
            return Response(
                {
                    'error': 'Error interno del servidor',
                    'details': 'Ocurrió un error procesando la solicitud.',
                },
                status=status_code,
            )

        if status_code == 404:
            return Response({'error': 'Recurso no encontrado'}, status=404)

        if status_code == 400:
            if isinstance(data, dict):
                error_map = {}
                for key, value in data.items():
                    if isinstance(value, list):
                        error_map[key] = value[0] if value else 'Valor inválido'
                    else:
                        error_map[key] = str(value)
                return Response({'error': 'Solicitud inválida', 'details': error_map}, status=400)
            return Response({'error': str(data)}, status=400)

        if status_code == 401:
            return Response({'error': 'No autenticado'}, status=401)

        if status_code == 403:
            return Response({'error': 'No autorizado'}, status=403)

        return response

    logger.error(
        'Unhandled exception %s %s: %s',
        method,
        path,
        exc,
        exc_info=True,
    )
    return Response(
        {
            'error': 'Error interno del servidor',
            'details': 'Ocurrió un error procesando la solicitud.',
        },
        status=500,
    )
