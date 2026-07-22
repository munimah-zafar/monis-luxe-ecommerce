from sqlalchemy import Column, Integer, String, DECIMAL ,Text
from app.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50))
    price = Column(Integer, nullable=False)
    image = Column(String(255))
    rating = Column(DECIMAL(2,1))
    gender = Column(String(10))
    from sqlalchemy import Column, Integer, String, DECIMAL, Text

class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String(100), nullable=False)

    email = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    address = Column(Text, nullable=False)

    total = Column(DECIMAL(10,2), nullable=False)

    status = Column(String, default="Pending")