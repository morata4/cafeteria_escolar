from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RolViewSet,
    UsuarioViewSet,
    CafeteriaViewSet,
    CategoriaViewSet,
    ProductoViewSet,
    PedidoViewSet,
    DetallePedidoViewSet,
    PagoViewSet
)

router = DefaultRouter()

router.register(r'roles', RolViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'cafeterias', CafeteriaViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'detalles-pedido', DetallePedidoViewSet)
router.register(r'pagos', PagoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]