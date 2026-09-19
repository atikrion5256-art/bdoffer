/* ============================================================
   CONTENT + CONFIG — single source of truth for the page.
   Edit here; run `npm run build`.
   ============================================================ */

module.exports = {
  site: {
    lang: 'bn',
    domain: 'bdoffer.online',
    year: 2026,
    title: 'ইন্টারনেট ও মিনিট অফার — সব অপারেটর এক জায়গায় | bdoffer.online',
    description:
      'গ্রামীণফোন, বাংলালিংক, রবি ও এয়ারটেলের ইন্টারনেট ও মিনিট অফার এক জায়গায় দেখুন এবং আপনার পছন্দেরটি বেছে নিন।',
    /* Real campaign deadline (ISO 8601, with offset). If empty, the timer
       counts down to the end of the visitor's current day. */
    offerEndsAt: '',
    /* Target for every "offer details" CTA until real URLs exist. */
    defaultHref: '#offers',
  },

  hero: {
    kicker: 'একটি অফার — বেশি সুবিধা',
    urgency: { accent: 'সীমিত', rest: 'সময়ের জন্য!' },
    title: ['ইন্টারনেট ও', 'মিনিট অফার'],
    lead: 'আপনার প্রিয় অপারেটরের অফার থেকে আপনার পছন্দেরটি নির্বাচন করুন',
    features: [
      { icon: 'bolt', label: 'দ্রুত রিচার্জ' },
      { icon: 'shield', label: 'নিরাপদ সার্ভিস' },
      { icon: 'users', label: 'সব অপারেটর এক জায়গায়' },
    ],
    cta: { label: 'এখনই অফার দেখুন', href: '#offers' },
    trust: ['সহজ নির্বাচন', 'দ্রুত অ্যাক্টিভেশন', 'বিশ্বস্ত ও নির্ভরযোগ্য'],
    railTitle: 'সবচেয়ে ভালো অফার এখন এক জায়গায়!',
    pledge: ['আপনার সংযোগ,', 'আমাদের অঙ্গীকার'],
    phone: {
      title: 'ইন্টারনেট ও মিনিট অফার',
      sub: 'আপনার প্রিয় অপারেটরের অফার এক ক্লিকে',
      tabs: ['DATA', 'VOICE'],
      tile: 'অফার দেখুন',
      nav: [
        { icon: 'home', label: 'হোম' },
        { icon: 'tag', label: 'অফার' },
        { icon: 'wallet', label: 'রিচার্জ' },
        { icon: 'info', label: 'সহায়তা' },
      ],
    },
  },

  /* Card order. Theme values drive every operator-coloured surface. */
  operators: [
    {
      id: 'banglalink', name: 'বাংলালিংক',
      theme: { main: '#ff6a00', end: '#ffa21f', rgb: '255 106 0', tint: '#ffefe0', tint2: '#fffaf4',
               ink: '#7a3200', amountA: '#f25200', amountB: '#ff9414', glow: 'rgb(255 122 30 / .42)' },
      quick: { from: '#ffa12a', to: '#f2580a', text: '#ffffff', tone: 'dark' },
    },
    {
      id: 'gp', name: 'গ্রামীণফোন',
      theme: { main: '#0a84ff', end: '#4fb7ff', rgb: '10 132 255', tint: '#e2f3ff', tint2: '#f7fbff',
               ink: '#0a3a85', amountA: '#0a52d6', amountB: '#1e98ff', glow: 'rgb(20 140 255 / .42)' },
      quick: { from: '#2d9cff', to: '#0a5ee0', text: '#ffffff', tone: 'light' },
    },
    {
      id: 'robi', name: 'রবি',
      theme: { main: '#e3132f', end: '#ff4d66', rgb: '227 19 47', tint: '#ffe4ea', tint2: '#fff7f9',
               ink: '#84091f', amountA: '#d20e2b', amountB: '#f2334f', glow: 'rgb(240 40 70 / .38)' },
      quick: { from: '#ff3b55', to: '#c80a24', text: '#ffffff', tone: 'light' },
    },
    {
      id: 'airtel', name: 'এয়ারটেল',
      theme: { main: '#ee1f7c', end: '#ff5aa3', rgb: '238 31 124', tint: '#ffe5f2', tint2: '#fff7fb',
               ink: '#80104a', amountA: '#e0112f', amountB: '#c4197f', glow: 'rgb(238 40 130 / .38)' },
      quick: { from: '#ffffff', to: '#f3f6fb', text: '#c5102c', tone: 'color' },
    },
  ],
  /* Order of the hero quick-buttons rail */
  railOrder: ['gp', 'banglalink', 'robi', 'airtel'],

  offers: {
    badge: 'আপনার জন্য সেরা অফার',
    title: [
      { t: 'ইন্টারনেট', c: 'blue' }, { t: 'ও', c: 'ink' },
      { t: 'মিনিট', c: 'orange' }, { t: 'অফার', c: 'ink' },
    ],
    sub: 'আপনার প্রয়োজন অনুযায়ী পছন্দের অফারটি বেছে নিন',
    detailsLabel: 'বিস্তারিত দেখুন',
    categories: [
      {
        id: 'data', theme: 'data',
        title: 'বিশেষ ইন্টারনেট অফার', accent: 'ইন্টারনেট',
        sub: '২৫ জিবি ফ্রি ইন্টারনেট অফার',
        cta: 'এখনই দেখুন', icon: 'antenna',
        script: { top: 'Stay Connected', bottom: 'Faster • Smarter • Together' },
        badge: { label: 'DATA', icon: 'wifi' },
        offer: { value: '২৫ জিবি', tag: 'ফ্রি', label: 'ইন্টারনেট' },
      },
      {
        id: 'voice', theme: 'voice',
        title: 'সকল মিনিট অফার', accent: 'মিনিট',
        sub: 'আপনার পছন্দের অপারেটর থেকে নিন',
        cta: 'এখনই দেখুন', icon: 'phone',
        script: { top: 'Keep in Touch', bottom: 'Clearer • Closer • Always' },
        badge: { label: 'VOICE', icon: 'phone' },
        offer: { value: '১০০ মিনিট', tag: 'ফ্রি', label: '' },
      },
    ],
  },

  quickNav: [
    { icon: 'grid', label: 'সব অফার দেখুন', href: '#offers' },
    { icon: 'help', label: 'কিভাবে রিচার্জ করবেন?', href: '#how-to-recharge' },
    { icon: 'chat', label: 'সাধারণ প্রশ্ন (FAQ)', href: '#faq' },
    { icon: 'headset', label: 'আমাদের সাথে যোগাযোগ', href: '#contact' },
  ],

  countdown: {
    title: 'সময় শেষ হওয়ার আগে আপনার অফারটি বেছে নিন',
    sub: 'সেরা অফার সবসময় সবার জন্য নয়, তাই দেরি না করে এখনই দেখে নিন!',
    label: 'অবশিষ্ট সময়',
    units: ['ঘণ্টা', 'মিনিট', 'সেকেন্ড'],
  },

  footer: {
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms & Conditions', href: '#terms' },
      { label: 'Refund Policy', href: '#refund' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
};
