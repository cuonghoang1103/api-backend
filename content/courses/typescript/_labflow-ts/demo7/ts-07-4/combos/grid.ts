type Section = 'hero' | 'footer';
type Lang = 'en' | 'vi';

// Two unions in one template → every combination: 2 x 2 = 4 keys.
type MessageKey = `${Section}.${Lang}`; // 'hero.en' | 'hero.vi' | 'footer.en' | 'footer.vi'

const messages: Record<MessageKey, string> = {
  'hero.en': 'Welcome', 'hero.vi': 'Chào mừng',
  'footer.en': 'Bye', 'footer.vi': 'Tạm biệt',
};
console.log(messages['hero.vi']);
