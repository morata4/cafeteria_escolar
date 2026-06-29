from django.db import models


class Cafeteria(models.Model):
    id_cafeteria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    horario = models.CharField(max_length=100, blank=True, null=True)
    ubicacion = models.CharField(max_length=150, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    logo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cafeteria'


class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categoria'


class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)
    id_rol = models.ForeignKey(Rol, models.DO_NOTHING, db_column='id_rol')
    fecha_registro = models.DateTimeField(blank=True, null=True)
    activo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'


# 🔥 MODELO PRODUCTO CORREGIDO
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.IntegerField(blank=True, null=True)

    # ✅ CORREGIDO: ahora acepta URLs reales
    imagen = models.URLField(blank=True, null=True)

    id_categoria = models.ForeignKey(
        Categoria,
        models.DO_NOTHING,
        db_column='id_categoria'
    )

    activo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'producto'


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(
        Usuario,
        models.DO_NOTHING,
        db_column='id_usuario'
    )
    fecha = models.DateTimeField(blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50, blank=True, null=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedido'


class DetallePedido(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        Pedido,
        models.DO_NOTHING,
        db_column='id_pedido'
    )
    id_producto = models.ForeignKey(
        Producto,
        models.DO_NOTHING,
        db_column='id_producto'
    )
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=8, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'detalle_pedido'


class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)
    id_pedido = models.OneToOneField(
        Pedido,
        models.DO_NOTHING,
        db_column='id_pedido'
    )
    metodo_pago = models.CharField(max_length=50)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateTimeField(blank=True, null=True)
    referencia = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pago'