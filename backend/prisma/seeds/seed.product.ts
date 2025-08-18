import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      description: 'Điện thoại thông minh cao cấp với chip A17 Pro, camera 48MP và màn hình Super Retina XDR',
      price: 29990000, 
      icon: "📱"
    },
    {
      name: 'MacBook Pro M3',
      description: 'Laptop chuyên nghiệp với chip M3, màn hình Liquid Retina XDR và hiệu năng vượt trội',
      price: 52990000,
      icon: "💻"},
    {
      name: 'AirPods Pro (Gen 2)',
      description: 'Tai nghe không dây với công nghệ chống ồn chủ động và âm thanh Spatial Audio, chống mồ hôi và nước',
      price: 6490000 ,
      icon: "🎧"},
    {
      name: 'Apple Watch Ultra 2',
      description: 'Đồng hồ thông minh cao cấp với GPS, cellular và khả năng chống nước đến 100m',
      price: 20990000 ,
      icon: "⌚"},
    { 
      name: 'iPad Pro 12.9 inch',
      description: 'Máy tính bảng chuyên nghiệp với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil',
      price: 31990000,
      icon: "📱"},
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Seed dữ liệu sản phẩm thành công!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
