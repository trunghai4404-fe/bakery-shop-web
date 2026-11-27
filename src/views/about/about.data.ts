import { ROUTES } from '@/constants/routes-path'

export type AboutLocale = 'vi' | 'en'

export interface CakeOptionGroup {
  id: string
  tag: string
  title: string
  preview: string
  description: string
  highlights: string[]
  imageKey: 'flavor' | 'decoration' | 'message'
  imageAlt: string
  flipHint: string
  ctaLabel: string
}

export interface GallerySample {
  id: string
  caption: string
  category: string
  imageKey: 'birthdayRose' | 'weddingCream' | 'passionfruitMousse' | 'saltedEgg'
  alt: string
}

export const BAKERY_INFO = {
  name: 'Bánh kem Ánh Dương',
  nameEn: 'Anh Duong Bakery',
  address: {
    vi: 'Ngã ba Cửu Lợi, Cam Lâm, Khánh Hòa, Việt Nam',
    en: 'Cuu Loi Junction, Cam Lam, Khanh Hoa, Vietnam',
  },
  products: {
    vi: [
      'Bánh kem sinh nhật',
      'Bánh cưới',
      'Bánh bông lan trứng muối',
      'Bánh mousse chanh dây',
      'Sữa chua nếp cẩm',
      'Bánh rau câu',
    ],
    en: [
      'Custom birthday cakes',
      'Wedding cakes',
      'Salted egg sponge cakes',
      'Passionfruit mousse cakes',
      'Black sticky rice yogurt',
      'Artisan jelly cakes',
    ],
  },
} as const

const ABOUT_CONTENT_VI = {
  seo: {
    title: 'Về chúng tôi — Bánh kem Ánh Dương',
    description:
      'Bánh kem Ánh Dương tại ngã ba Cửu Lợi, Cam Lâm, Khánh Hòa — gần 4 năm làm bánh kem sinh nhật, bánh cưới, mousse chanh dây, bông lan trứng muối, sữa chua nếp cẩm, setup thôi nôi và mâm quả ngày cưới.',
    keywords: [
      'Bánh kem Ánh Dương',
      'tiệm bánh kem Cam Lâm',
      'bánh kem sinh nhật Khánh Hòa',
      'bánh cưới Cam Lâm',
      'bông lan trứng muối',
      'bánh mousse chanh dây',
      'setup tiệc thôi nôi',
      'mâm quả ngày cưới',
    ],
  },
  hero: {
    eyebrow: 'Bánh kem Ánh Dương • Cam Lâm, Khánh Hòa',
    title: 'Một chiếc bánh cho ngày bạn muốn nhớ',
    description:
      'Tại Bánh kem Ánh Dương, chúng mình tỉ mỉ làm từng chiếc bánh thủ công cho sinh nhật, lễ cưới và những dịp sum vầy. Từ bánh kem tươi, bánh cưới đến mousse chanh dây hay bông lan trứng muối, mỗi chiếc bánh đều được làm mới mỗi ngày theo đúng ý bạn.',
    primaryCta: 'Xem mẫu bánh',
    primaryHref: ROUTES.PRODUCT_LIST,
    secondaryCta: 'Đặt bánh theo yêu cầu',
    secondaryHref: '#dat-banh',
    badgeTitle: '~4 năm thủ công',
    badgeSubtitle: 'Làm mới mỗi sáng tại Cam Lâm',
    imageAlt:
      'Bánh kem sinh nhật hai tầng phủ kem bơ trắng kem kết hợp hoa kem bắt tay tông hồng phấn tại Bánh kem Ánh Dương',
  },
  story: {
    eyebrow: 'Câu chuyện của tiệm',
    title: 'Từ góc bếp nhỏ đến gần 4 năm giữ trọn vị bánh thủ công',
    paragraphs: [
      'Với hơn 3 năm kinh nghiệm làm bánh — đến nay đã gần 4 năm đồng hành cùng khách hàng tại ngã ba Cửu Lợi, Cam Lâm — Bánh kem Ánh Dương ra đời từ niềm vui giản dị khi được tự tay nướng từng mẻ cốt bánh thơm mềm mỗi sáng.',
      'Điều khiến chúng mình yêu công việc này nhất là khoảnh khắc nắn nót từng cánh hoa kem, gia giảm độ ngọt thanh vừa miệng để chiếc bánh trở thành điểm nhấn ấm áp trong ngày vui của bạn. Bên cạnh bánh kem sinh nhật và bánh cưới, tiệm còn có bánh mousse chanh dây, bông lan trứng muối, sữa chua nếp cẩm, bánh rau câu, cùng dịch vụ setup tiệc thôi nôi và mâm quả ngày cưới.',
    ],
    highlights: [
      { label: 'Kinh nghiệm', value: '~4 năm' },
      { label: 'Quy trình', value: '100% thủ công' },
      { label: 'Dịch vụ thêm', value: 'Thôi nôi & Mâm quả' },
    ],
    imageAlt:
      'Đôi tay người thợ làm bánh tại Bánh kem Ánh Dương đang tỉ mỉ bắt hoa kem hồng lên mặt bánh dưới ánh sáng tự nhiên',
  },
  options: {
    eyebrow: 'Tùy chỉnh theo ý bạn',
    title: 'Bạn có thể chọn gì cho chiếc bánh của mình?',
    subtitle:
      'Rê chuột hoặc chạm vào từng thẻ để lật xem chi tiết các lựa chọn mà chúng mình đang nhận làm mỗi ngày.',
    groups: [
      {
        id: 'flavor',
        tag: '01 • Hương vị',
        title: 'Hương vị',
        preview: 'Vani, socola ít ngọt, mousse chanh dây hay bông lan trứng muối.',
        description:
          'Bạn có thể chọn cốt bông lan vani, socola mềm ẩm ít ngọt, nhân mousse chanh dây chua thanh mát hoặc dòng bánh bông lan trứng muối sốt phô mai béo mặn hài hòa.',
        highlights: [
          'Cốt vani / socola mềm ẩm',
          'Mousse chanh dây tươi thanh mát',
          'Bông lan trứng muối sốt phô mai',
        ],
        imageKey: 'flavor',
        imageAlt: 'Các lớp hương vị bánh bông lan, kem tươi và mousse chanh dây tại Bánh kem Ánh Dương',
        flipHint: 'Lật thẻ xem chi tiết',
        ctaLabel: 'Chọn vị bánh này',
      },
      {
        id: 'decoration',
        tag: '02 • Kiểu trang trí',
        title: 'Kiểu trang trí',
        preview: 'Tối giản tông kem ấm, bắt hoa kem thủ công hoặc theo chủ đề.',
        description:
          'Từ phong cách tối giản Hàn Quốc, bắt hoa kem thủ công tông hồng – kem dịu dàng đến tạo hình theo chủ đề sinh nhật, thôi nôi và bánh cưới hai tầng thanh lịch.',
        highlights: [
          'Bắt hoa kem thủ công tinh tế',
          'Tông màu pastel ấm áp, nhẹ nhàng',
          'Thiết kế riêng cho sinh nhật & lễ cưới',
        ],
        imageKey: 'decoration',
        imageAlt: 'Cận cảnh kỹ thuật bắt hoa kem và trang trí bề mặt bánh thủ công',
        flipHint: 'Lật thẻ xem chi tiết',
        ctaLabel: 'Đặt kiểu trang trí',
      },
      {
        id: 'message',
        tag: '03 • Lời nhắn trên bánh',
        title: 'Lời nhắn trên bánh',
        preview: 'Viết tay tên, ngày kỷ niệm hoặc lời chúc ngắn gọn tinh tế.',
        description:
          'Chúng mình viết tay trực tiếp tên, ngày kỷ niệm hoặc lời chúc ngắn gọn lên mặt bánh với nét chữ gọn gàng, phối màu kem hài hòa cùng tổng thể thiết kế.',
        highlights: [
          'Viết tay trực tiếp bằng kem mịn',
          'Phối màu chữ hài hòa với mặt bánh',
          'Hỗ trợ gợi ý câu chúc ngắn gọn',
        ],
        imageKey: 'message',
        imageAlt: 'Nét chữ viết tay gọn gàng và tinh tế trên mặt bánh kem',
        flipHint: 'Lật thẻ xem chi tiết',
        ctaLabel: 'Gửi lời nhắn của bạn',
      },
    ] satisfies CakeOptionGroup[],
  },
  gallery: {
    eyebrow: 'Sản phẩm tiêu biểu',
    title: 'Một vài chiếc bánh chúng mình đã làm',
    subtitle:
      'Mỗi chiếc bánh hoàn thiện đều mang một câu chuyện riêng, được chụp lại dưới ánh sáng tự nhiên ngay tại tiệm.',
    viewMoreLabel: 'Xem thêm mẫu bánh',
    viewMoreHref: ROUTES.PRODUCT_LIST,
    items: [
      {
        id: 'birthday-rose',
        category: 'Sinh nhật',
        caption: 'Bánh sinh nhật tông hồng với hoa kem bắt tay',
        imageKey: 'birthdayRose',
        alt: 'Bánh kem sinh nhật tông hồng phấn trang trí hoa kem bắt tay tinh tế',
      },
      {
        id: 'wedding-cream',
        category: 'Cưới & Kỷ niệm',
        caption: 'Bánh cưới hai tầng tông kem trắng điểm hoa nhẹ nhàng',
        imageKey: 'weddingCream',
        alt: 'Bánh cưới và kỷ niệm hai tầng phủ kem trắng thanh lịch điểm hoa tươi',
      },
      {
        id: 'passionfruit-mousse',
        category: 'Mousse trái cây',
        caption: 'Bánh mousse chanh dây mặt gương chua ngọt thanh mát',
        imageKey: 'passionfruitMousse',
        alt: 'Bánh mousse chanh dây vàng óng tự nhiên trang trí lá bạc hà',
      },
      {
        id: 'salted-egg',
        category: 'Bánh mặn',
        caption: 'Bông lan trứng muối sốt phô mai và chà bông vàng ươm',
        imageKey: 'saltedEgg',
        alt: 'Bánh bông lan trứng muối phủ chà bông và sốt phô mai béo thơm',
      },
    ] satisfies GallerySample[],
  },
  cta: {
    eyebrow: 'Cùng lên ý tưởng cho chiếc bánh của bạn',
    title: 'Bạn đang chuẩn bị bánh cho dịp nào?',
    description:
      'Hãy nhắn cho chúng mình ngày bạn cần bánh, số người dùng dự kiến và gửi kèm ảnh mẫu nếu bạn đã có ý tưởng sẵn nhé.',
    checklist: [
      'Ngày & giờ bạn muốn nhận bánh',
      'Số người dùng hoặc kích thước bánh dự kiến',
      'Ảnh mẫu tham khảo & lời chúc muốn viết lên bánh',
    ],
    advancePolicyTitle: 'Thời gian đặt bánh trước',
    advancePolicyText:
      'Vui lòng đặt trước 1–2 ngày cho bánh sinh nhật để tiệm chuẩn bị cốt bánh tươi; với bánh cưới, tiệc thôi nôi hoặc mâm quả ngày cưới, bạn nên liên hệ trước 5–7 ngày.',
    addressCardTitle: 'Ghé tiệm Bánh kem Ánh Dương',
    addressNote:
      'Nhận làm bánh kem sinh nhật, bánh cưới, mousse chanh dây, bông lan trứng muối, sữa chua nếp cẩm, bánh rau câu, setup tiệc thôi nôi & mâm quả ngày cưới.',
    primaryCta: 'Đặt bánh theo yêu cầu',
    primaryHref: ROUTES.CONTACT,
    zaloLabel: 'Nhắn qua Zalo',
    zaloHref: 'https://zalo.me',
    messengerLabel: 'Nhắn Messenger',
    messengerHref: 'https://m.me',
  },
}

const ABOUT_CONTENT_EN: typeof ABOUT_CONTENT_VI = {
  seo: {
    title: 'About Us — Anh Duong Bakery',
    description:
      'Anh Duong Bakery at Cuu Loi Junction, Cam Lam, Khanh Hoa — nearly 4 years crafting custom birthday cakes, wedding cakes, passionfruit mousse, salted egg sponge cakes, first-birthday party setups, and wedding trays.',
    keywords: [
      'Anh Duong Bakery',
      'Banh kem Anh Duong',
      'Cam Lam custom cakes',
      'Khanh Hoa birthday cakes',
      'wedding cakes Cam Lam',
      'salted egg sponge cake',
      'passionfruit mousse cake',
    ],
  },
  hero: {
    eyebrow: 'Anh Duong Bakery • Cam Lam, Khanh Hoa',
    title: 'A handcrafted cake for the day you want to remember',
    description:
      'At Anh Duong Bakery, we bake and decorate every cake by hand for birthdays, weddings, and meaningful gatherings. From fresh cream cakes and wedding tiers to passionfruit mousse and salted egg sponge, every order is freshly made to match your vision.',
    primaryCta: 'Browse Cake Designs',
    primaryHref: ROUTES.PRODUCT_LIST,
    secondaryCta: 'Order Custom Cake',
    secondaryHref: '#dat-banh',
    badgeTitle: '~4 Years Crafting',
    badgeSubtitle: 'Baked fresh every morning',
    imageAlt:
      'Handcrafted two-layer ivory buttercream birthday cake with dusty-rose piped flowers at Anh Duong Bakery',
  },
  story: {
    eyebrow: 'Our Story',
    title: 'From a small home kitchen to nearly 4 years of artisan baking',
    paragraphs: [
      'Starting with over 3 years of baking experience — now nearly 4 years serving families around Cuu Loi Junction, Cam Lam — Anh Duong Bakery grew from the simple joy of baking soft, fragrant sponge cakes fresh every morning.',
      'What we love most is carefully piping each buttercream petal and balancing gentle sweetness so your cake feels warm and memorable at the table. Alongside birthday and wedding cakes, we also craft passionfruit mousse, salted egg sponge, black sticky rice yogurt, artisan jelly cakes, plus first-birthday setups and traditional wedding trays.',
    ],
    highlights: [
      { label: 'Experience', value: '~4 Years' },
      { label: 'Craftsmanship', value: '100% Handmade' },
      { label: 'Full Services', value: 'Parties & Trays' },
    ],
    imageAlt:
      'Artisan baker hands piping delicate dusty-rose buttercream flowers onto a fresh cake in natural morning light',
  },
  options: {
    eyebrow: 'Personalize Your Cake',
    title: 'What can you customize for your cake?',
    subtitle:
      'Hover or tap each card to flip and explore the flavors, decorations, and personal messages we craft daily.',
    groups: [
      {
        id: 'flavor',
        tag: '01 • Flavors',
        title: 'Flavors',
        preview: 'Vanilla, light chocolate, passionfruit mousse, or salted egg sponge.',
        description:
          'Choose from soft vanilla or lightly sweetened chocolate sponge, refreshing passionfruit mousse fillings, or our signature savory-sweet salted egg sponge with cheese sauce.',
        highlights: [
          'Moist vanilla & chocolate sponge',
          'Fresh tangy passionfruit mousse',
          'Salted egg sponge with cheese sauce',
        ],
        imageKey: 'flavor',
        imageAlt: 'Close-up of soft cake sponge, fresh cream, and passionfruit mousse layers',
        flipHint: 'Flip card for details',
        ctaLabel: 'Choose this flavor',
      },
      {
        id: 'decoration',
        tag: '02 • Decoration',
        title: 'Decoration Style',
        preview: 'Warm minimalist cream, hand-piped florals, or themed designs.',
        description:
          'From Korean minimalist palettes and delicate hand-piped buttercream flowers in soft blush tones to themed birthday, first-birthday, and two-tier wedding cakes.',
        highlights: [
          'Hand-piped buttercream florals',
          'Warm, understated pastel tones',
          'Custom birthday & wedding themes',
        ],
        imageKey: 'decoration',
        imageAlt: 'Close-up of hand-piped buttercream floral border and smooth frosting texture',
        flipHint: 'Flip card for details',
        ctaLabel: 'Pick a style',
      },
      {
        id: 'message',
        tag: '03 • Cake Message',
        title: 'Custom Message',
        preview: 'Hand-piped names, milestone dates, or short heartfelt wishes.',
        description:
          'We hand-pipe names, anniversary dates, or short wishes directly onto the cake in neat, balanced lettering that harmonizes with your chosen color palette.',
        highlights: [
          'Neat hand-piped cream lettering',
          'Color-matched to cake frosting',
          'Short wording guidance included',
        ],
        imageKey: 'message',
        imageAlt: 'Clean hand-piped birthday message script on pastel buttercream cake',
        flipHint: 'Flip card for details',
        ctaLabel: 'Add your message',
      },
    ] satisfies CakeOptionGroup[],
  },
  gallery: {
    eyebrow: 'Featured Creations',
    title: 'A few cakes we have crafted recently',
    subtitle:
      'Every finished cake carries its own story, photographed in natural daylight right in our kitchen.',
    viewMoreLabel: 'See more cake designs',
    viewMoreHref: ROUTES.PRODUCT_LIST,
    items: [
      {
        id: 'birthday-rose',
        category: 'Birthday',
        caption: 'Dusty-pink birthday cake with hand-piped buttercream roses',
        imageKey: 'birthdayRose',
        alt: 'Pastel pink birthday cake with hand-piped buttercream roses',
      },
      {
        id: 'wedding-cream',
        category: 'Wedding & Anniversary',
        caption: 'Two-tier ivory cream wedding cake with delicate blush florals',
        imageKey: 'weddingCream',
        alt: 'Two-tier ivory buttercream wedding cake with blush roses and sage leaves',
      },
      {
        id: 'passionfruit-mousse',
        category: 'Fruit Mousse',
        caption: 'Refreshing golden passionfruit mousse with glossy mirror glaze',
        imageKey: 'passionfruitMousse',
        alt: 'Golden passionfruit mousse cake garnished with fresh mint leaf',
      },
      {
        id: 'salted-egg',
        category: 'Savory-Sweet',
        caption: 'Salted egg sponge cake with creamy cheese sauce and pork floss',
        imageKey: 'saltedEgg',
        alt: 'Traditional salted egg sponge cake topped with pork floss and cheese swirls',
      },
    ] satisfies GallerySample[],
  },
  cta: {
    eyebrow: "Let's plan your cake together",
    title: 'What occasion are you celebrating?',
    description:
      'Share your preferred pickup date, estimated guest count, and any reference photos you love — we will help shape the right design.',
    checklist: [
      'Your preferred pickup date & time',
      'Estimated number of guests or cake size',
      'Reference photos & custom message text',
    ],
    advancePolicyTitle: 'Advance Order Policy',
    advancePolicyText:
      'Please order 1–2 days ahead for birthday cakes so we can bake fresh sponges; for wedding cakes, first-birthday setups, or wedding trays, reach out 5–7 days in advance.',
    addressCardTitle: 'Visit Anh Duong Bakery',
    addressNote:
      'Custom birthday cakes, wedding cakes, passionfruit mousse, salted egg sponge, black sticky rice yogurt, jelly cakes, first-birthday party setups & wedding trays.',
    primaryCta: 'Order a Custom Cake',
    primaryHref: ROUTES.CONTACT,
    zaloLabel: 'Chat on Zalo',
    zaloHref: 'https://zalo.me',
    messengerLabel: 'Message on Messenger',
    messengerHref: 'https://m.me',
  },
}

export function getAboutContent(locale: string) {
  return locale === 'en' ? ABOUT_CONTENT_EN : ABOUT_CONTENT_VI
}
