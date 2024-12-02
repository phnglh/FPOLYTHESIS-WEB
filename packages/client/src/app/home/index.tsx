import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1 description.",
    price: 29.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2 description.",
    price: 49.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3 description.",
    price: 99.99,
    image: "https://via.placeholder.com/150",
  },
];

export function Home() {
  const [cart, setCart] = useState<number[]>([]);

  console.log(cart);
  const handleAddToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    toast.success(`Sản phẩm ${id} đã được thêm vào giỏ hàng!`);
  };

  return (
    <Container>
      <Typography variant="h4" className="text-center mb-6">
        Products
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="shadow-md">
            <CardMedia
              component="img"
              height="200"
              width={"150"}
              image={product.image}
              alt={product.name}
              className="object-cover"
            />
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {product.name}
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-2">
                {product.description}
              </Typography>
              <Typography
                variant="subtitle1"
                className="text-green-600 font-semibold"
              >
                ${product.price}
              </Typography>
            </CardContent>
            <Button
              variant="contained"
              color="primary"
              className="m-4"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
}
