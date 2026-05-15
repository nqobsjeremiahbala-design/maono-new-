export const TELEGRAM_CHANNEL_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || 'https://t.me/MaonoForexTrading1'

export const TELEGRAM_BOT_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/maonoforexbot'

export const SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/maonoforex',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/maonoforex',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@maonoforex',
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com/@maonoforex',
  x: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/maonoforex',
}

export const BROKER_OF_CHOICE = {
  name: 'Maono Global Markets',
  url: process.env.NEXT_PUBLIC_BROKER_URL || 'https://maonoglobalmarkets.com',
  blurb:
    'Our recommended broker. Tight spreads, fast execution, and South-Africa-friendly funding options.',
}
