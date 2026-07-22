from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    category: str
    price: int
    image: str
    rating: float
    gender: str


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):

    customer_name: str

    email: str

    phone: str

    address: str

    total: float
    
    status: str = "Pending"

class OrderCreate(OrderBase):
    pass


class OrderResponse(OrderBase):

    id: int

    class Config:
        from_attributes = True