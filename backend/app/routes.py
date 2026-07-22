from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product, Order

from app.schemas import (
    ProductResponse,
    ProductCreate,
    OrderResponse,
    OrderCreate
)
print("🔥 ROUTES.PY LOADED 🔥")


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products


@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    new_product = Product(

        name=product.name,
        category=product.category,
        price=product.price,
        image=product.image,
        rating=product.rating,
        gender=product.gender

    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    db_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db_product.name = product.name
    db_product.category = product.category
    db_product.price = product.price
    db_product.image = product.image
    db_product.rating = product.rating
    db_product.gender = product.gender

    db.commit()
    db.refresh(db_product)

    return db_product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    db_product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(db_product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

@router.post("/orders", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    new_order = Order(

        customer_name=order.customer_name,
        email=order.email,
        phone=order.phone,
        address=order.address,
        total=order.total

    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

@router.get("/orders")
def get_orders(db: Session = Depends(get_db)):

    orders = db.query(Order).all()

    print("Orders from DB:", orders)
    print("Count:", len(orders))

    return orders

@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {

        "message": "Order deleted successfully"

    }

@router.put("/orders/{order_id}")
def update_order_status(
    order_id: int,
    status_data: dict,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = status_data["status"]

    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully",
        "status": order.status
    }


@router.get("/{gender}", response_model=list[ProductResponse])
def get_products_by_gender(
    gender: str,
    db: Session = Depends(get_db)
):

    products = (
        db.query(Product)
       .filter(Product.gender.ilike(gender))
        .all()
    )

    return products