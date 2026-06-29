from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import (
    Rol, Usuario, Cafeteria, Categoria,
    Producto, Pedido, DetallePedido, Pago
)

from .serializers import (
    RolesSerializer,
    UsuariosSerializer,
    CafeteriaSerializer,
    CategoriaSerializer,
    ProductoSerializer,
    PedidoSerializer,
    DetallePedidoSerializer,
    PagoSerializer
)


# =========================
# ROLES
# =========================
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolesSerializer


# =========================
# USUARIOS + LOGIN
# =========================
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuariosSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            usuario = Usuario.objects.get(email=email, password=password)

            return Response({
                "mensaje": "Login exitoso",
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "id_rol": usuario.id_rol_id
            })

        except Usuario.DoesNotExist:
            return Response(
                {"error": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED
            )


# =========================
# CAFETERIA
# =========================
class CafeteriaViewSet(viewsets.ModelViewSet):
    queryset = Cafeteria.objects.all()
    serializer_class = CafeteriaSerializer


# =========================
# CATEGORIAS
# =========================
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# =========================
# PRODUCTOS
# =========================
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


# =========================
# PEDIDOS + COMPRA
# =========================
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    @action(detail=False, methods=['post'])
    def comprar(self, request):
        productos = request.data.get("productos", [])
        id_usuario = request.data.get("id_usuario")

        if not productos:
            return Response(
                {"error": "Carrito vacío"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not id_usuario:
            return Response(
                {"error": "Usuario no identificado"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            usuario = Usuario.objects.get(id_usuario=id_usuario)
        except Usuario.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )

        total = 0
        items = []

        for item in productos:
            try:
                producto = Producto.objects.get(id_producto=item["id_producto"])
            except Producto.DoesNotExist:
                return Response(
                    {"error": "Producto no encontrado"},
                    status=status.HTTP_404_NOT_FOUND
                )

            if producto.stock < item["cantidad"]:
                return Response(
                    {"error": f"Sin stock para {producto.nombre}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            subtotal = producto.precio * item["cantidad"]
            total += subtotal

            items.append({
                "producto": producto,
                "cantidad": item["cantidad"],
                "precio_unitario": producto.precio,
                "subtotal": subtotal
            })

        pedido = Pedido.objects.create(
            id_usuario=usuario,
            fecha=timezone.now(),
            total=total,
            estado="pendiente"
        )

        for i in items:
            DetallePedido.objects.create(
                id_pedido=pedido,
                id_producto=i["producto"],
                cantidad=i["cantidad"],
                precio_unitario=i["precio_unitario"],
                subtotal=i["subtotal"]
            )

            i["producto"].stock -= i["cantidad"]
            i["producto"].save()

        return Response({
            "mensaje": "Compra realizada con éxito",
            "pedido_id": pedido.id_pedido,
            "total": float(total)
        }, status=status.HTTP_201_CREATED)


# =========================
# DETALLES PEDIDO
# =========================
class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer


# =========================
# PAGOS
# =========================
class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer