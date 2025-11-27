import Mock from 'mockjs';

// 基础商品数据
const baseProducts = [
  { name: "极简建筑指南", category: "图书", subCategory: "设计", imageColor: "bg-[#EAE4DD]", imageText: "ARCH" },
  { name: "羊绒混纺大衣", category: "服饰", subCategory: "秋冬", imageColor: "bg-[#D6D2C4]", imageText: "COAT" },
  { name: "丹麦中古台灯", category: "家居", subCategory: "照明", imageColor: "bg-[#C4CDC1]", imageText: "LAMP" },
  { name: "无印风收纳盒", category: "家居", subCategory: "整理", imageColor: "bg-[#F2F2F2]", imageText: "BOX" },
  { name: "索尼降噪耳机", category: "电子产品", subCategory: "音频", imageColor: "bg-[#CFD8DC]", imageText: "SONY" },
  { name: "纯棉水洗衬衫", category: "服饰", subCategory: "上装", imageColor: "bg-[#E0E7FF]", imageText: "SHIRT" },
  { name: "人体工学椅", category: "家居", subCategory: "办公", imageColor: "bg-[#374151]", imageText: "CHAIR", dark: true },
  { name: "机械键盘 Pro", category: "电子产品", subCategory: "外设", imageColor: "bg-[#E8D5C4]", imageText: "KEY" },
  { name: "有机咖啡豆", category: "食品", subCategory: "饮品", imageColor: "bg-[#8B7355]", imageText: "COFFEE", dark: true },
  { name: "北欧风挂画", category: "家居", subCategory: "装饰", imageColor: "bg-[#E8E4D9]", imageText: "ART" },
  { name: "智能手表", category: "电子产品", subCategory: "穿戴", imageColor: "bg-[#1F2937]", imageText: "WATCH", dark: true },
  { name: "羊毛围巾", category: "服饰", subCategory: "配饰", imageColor: "bg-[#FEE2E2]", imageText: "SCARF" },
];

// 使用 Mock.js 生成商品数据
export const generateProducts = () => {
  return baseProducts.map((product, index) => ({
    id: index + 1,
    name: product.name,
    category: `${product.category} / ${product.subCategory}`,
    mainCategory: product.category,
    price: Mock.Random.integer(99, 5000),
    imageColor: product.imageColor,
    imageText: product.imageText,
    dark: product.dark || false,
    rating: Mock.Random.float(4.0, 5.0, 1, 1),
    sales: Mock.Random.integer(10, 9999),
    stock: Mock.Random.integer(5, 200),
    description: Mock.Random.cparagraph(1, 3),
  }));
};

export const CATEGORIES = ["全部", "电子产品", "服饰", "食品", "图书", "家居"];

export const MOCK_PRODUCTS = generateProducts();
