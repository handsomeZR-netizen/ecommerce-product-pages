import Mock from 'mockjs';
import type { Product } from '@/types';

// 商品分类
const categories = ['电子产品', '服装', '食品', '图书', '家居'];

// 更真实的商品名称模板
const productNameTemplates = {
  电子产品: [
    '无线蓝牙耳机',
    '智能手表',
    '便携式充电宝',
    '机械键盘',
    '游戏鼠标',
    '4K显示器',
    '笔记本电脑',
    '平板电脑',
    '智能音箱',
    '无线路由器',
  ],
  服装: [
    '纯棉T恤',
    '牛仔裤',
    '运动鞋',
    '休闲外套',
    '连衣裙',
    '羽绒服',
    '卫衣',
    '衬衫',
    '运动裤',
    '帆布鞋',
  ],
  食品: [
    '有机燕麦片',
    '坚果礼盒',
    '进口咖啡豆',
    '手工巧克力',
    '蜂蜜柚子茶',
    '橄榄油',
    '红酒',
    '茶叶礼盒',
    '零食大礼包',
    '进口饼干',
  ],
  图书: [
    '编程入门指南',
    '设计思维',
    '商业分析',
    '心理学导论',
    '历史故事集',
    '科幻小说',
    '艺术鉴赏',
    '经济学原理',
    '哲学思考',
    '文学经典',
  ],
  家居: [
    '北欧风台灯',
    '记忆棉枕头',
    '收纳箱',
    '懒人沙发',
    '香薰蜡烛',
    '装饰画',
    '地毯',
    '窗帘',
    '床上四件套',
    '置物架',
  ],
};

// 更真实的商品描述模板
const descriptionTemplates = {
  电子产品: [
    '采用最新技术，性能卓越，为您带来极致体验。',
    '精心设计，注重细节，满足您的日常使用需求。',
    '高品质材料，经久耐用，是您的理想选择。',
  ],
  服装: [
    '精选优质面料，舒适透气，穿着体验极佳。',
    '时尚设计，百搭款式，适合多种场合穿着。',
    '精致做工，品质保证，展现您的独特品味。',
  ],
  食品: [
    '精选优质原料，健康美味，让您享受美好时光。',
    '传统工艺制作，口感纯正，回味无穷。',
    '营养丰富，天然健康，是您的健康之选。',
  ],
  图书: [
    '内容丰富，深入浅出，适合各个层次的读者。',
    '经典之作，值得收藏，开启您的智慧之旅。',
    '精美装帧，印刷精良，阅读体验极佳。',
  ],
  家居: [
    '简约设计，实用美观，提升您的生活品质。',
    '优质材料，环保健康，为您打造温馨家居。',
    '精致工艺，细节考究，彰显生活品味。',
  ],
};

// 品牌名称
const brands = {
  电子产品: ['Apple', 'Samsung', '华为', '小米', 'Sony', 'Dell', 'Lenovo', 'ASUS'],
  服装: ['Nike', 'Adidas', 'Uniqlo', 'ZARA', 'H&M', '优衣库', '李宁', '安踏'],
  食品: ['三只松鼠', '良品铺子', '百草味', '来伊份', '雀巢', '好丽友', '旺旺', '康师傅'],
  图书: ['人民文学出版社', '商务印书馆', '中信出版社', '机械工业出版社', '电子工业出版社'],
  家居: ['IKEA', '宜家', '无印良品', 'MUJI', '网易严选', '小米有品', '造作', '梵几'],
};

// 获取延迟时间（支持环境变量配置）
const getDelay = (defaultDelay: number): number => {
  const envDelay = import.meta.env.VITE_MOCK_DELAY;
  if (envDelay !== undefined) {
    const parsed = parseInt(envDelay, 10);
    return isNaN(parsed) ? defaultDelay : parsed;
  }
  return defaultDelay;
};

// 生成的商品数据缓存（确保每次调用返回相同的数据）
let cachedProducts: Product[] | null = null;

// 生成商品数据
const generateProducts = (count: number = 50): Product[] => {
  if (cachedProducts) {
    return cachedProducts;
  }

  cachedProducts = Array.from({ length: count }, () => {
    const category = Mock.Random.pick(categories) as keyof typeof productNameTemplates;
    const nameTemplate = Mock.Random.pick(productNameTemplates[category]);
    const brand = Mock.Random.pick(brands[category]);
    const descTemplate = Mock.Random.pick(descriptionTemplates[category]);

    // 生成合理的价格
    const price = Mock.Random.float(10, 5000, 2, 2);
    const discount = Mock.Random.float(0.1, 0.3, 2, 2);
    const originalPrice = parseFloat((price / (1 - discount)).toFixed(2));

    // 生成更真实的商品名称
    const name = `${brand} ${nameTemplate}`;

    // 生成更详细的描述
    const description = `${descTemplate} 本产品采用${Mock.Random.pick(['进口', '国产', '精选'])}材料，经过严格的质量检测，确保每一件产品都符合高标准。${Mock.Random.cparagraph(1, 2)}`;

    return {
      id: Mock.Random.guid(),
      name,
      price,
      originalPrice,
      category,
      image: Mock.Random.image('400x400', Mock.Random.color(), '#FFF', 'png', name),
      images: Array.from({ length: 4 }, (_, imgIndex) =>
        Mock.Random.image(
          '800x800',
          Mock.Random.color(),
          '#FFF',
          'png',
          `${name}-图${imgIndex + 1}`
        )
      ),
      description,
      specifications: {
        品牌: brand,
        型号: Mock.Random.string('upper', 3, 5) + '-' + Mock.Random.integer(1000, 9999),
        产地: Mock.Random.pick(['中国', '美国', '日本', '德国', '韩国']),
        重量: `${Mock.Random.float(0.1, 10, 1, 2)}kg`,
        尺寸: `${Mock.Random.integer(10, 50)}cm × ${Mock.Random.integer(10, 50)}cm × ${Mock.Random.integer(5, 30)}cm`,
      },
      stock: Mock.Random.integer(0, 500),
      rating: Mock.Random.float(3.5, 5, 1, 1),
      reviews: Mock.Random.integer(10, 1000),
    };
  });

  return cachedProducts;
};

// Mock API
export const mockApi = {
  /**
   * 获取所有商品列表
   * 默认模拟 500ms 网络延迟（可通过 VITE_MOCK_DELAY 环境变量配置）
   */
  getProducts: async (): Promise<Product[]> => {
    const delay = getDelay(500);
    await new Promise(resolve => setTimeout(resolve, delay));
    return generateProducts(50);
  },

  /**
   * 根据 ID 获取单个商品
   * 默认模拟 300ms 网络延迟（可通过 VITE_MOCK_DELAY 环境变量配置）
   */
  getProductById: async (id: string): Promise<Product | null> => {
    const delay = getDelay(300);
    await new Promise(resolve => setTimeout(resolve, delay));
    const products = generateProducts(50);
    return products.find(p => p.id === id) || null;
  },

  /**
   * 清除缓存的商品数据（用于测试）
   */
  clearCache: (): void => {
    cachedProducts = null;
  },
};
