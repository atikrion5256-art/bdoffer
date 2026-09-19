# Namecheap Shared Hosting-এ bdoffer PHP + MySQL Admin Setup

এই সংস্করণে Node.js সম্পূর্ণ বাদ দেওয়া হয়েছে। এখন সাইটের admin page এবং API চালানোর জন্য শুধু **PHP, MySQL, Apache এবং HTTPS** লাগবে। Namecheap shared hosting-এর cPanel-এ এই সুবিধাগুলো সাধারণত থাকে।

## ১. কী কী ফাইল ব্যবহার হচ্ছে

| ফাইল | কাজ |
| --- | --- |
| `api.php` | Login, session, affiliate link, inquiry এবং health API |
| `admin.html` | Admin login এবং dashboard |
| `admin.js` | Dashboard-এর browser logic |
| `database.sql` | MySQL table এবং default operator link |
| `config.sample.php` | Database ও admin configuration-এর template |
| `.htaccess` | `/api/...` URL-কে `api.php`-তে পাঠায় এবং secret file block করে |
| `assets/` | Logo, hero image, favicon |

`server.js` আর ব্যবহার করা হয় না।

## ২. cPanel-এ MySQL database তৈরি করুন

1. Namecheap account খুলে **Hosting List → Go to cPanel** নির্বাচন করুন।
2. **Databases → MySQL Databases** খুলুন।
3. একটি database তৈরি করুন, যেমন `bdoffer`। cPanel সাধারণত নামের আগে আপনার account prefix যোগ করবে, যেমন `cpuser_bdoffer`।
4. একটি database user তৈরি করুন।
5. user-কে database-এর সঙ্গে যুক্ত করুন এবং **ALL PRIVILEGES** নির্বাচন করুন।
6. Database name, username এবং password লিখে রাখুন।

Database host সাধারণত `localhost` হয়। Namecheap account-এ আলাদা নির্দেশনা থাকলে সেটি ব্যবহার করুন।

## ৩. MySQL table import করুন

1. cPanel-এ **Databases → phpMyAdmin** খুলুন।
2. বাম পাশ থেকে নতুন database নির্বাচন করুন।
3. **Import** চাপুন।
4. repository-এর `database.sql` upload করুন।
5. Import শেষ হলে `admin_sessions`, `affiliate_links` এবং `inquiries` table দেখতে পাবেন।

`database.sql` default Banglalink, Grameenphone, Robi এবং Airtel link তৈরি করে। পরে admin dashboard থেকে এগুলো update করা যাবে।

## ৪. Admin password hash তৈরি করুন

Plain password কখনো `config.php`, JavaScript বা GitHub-এ লিখবেন না। নিজের কম্পিউটারে চালান:

```bash
php -r "echo password_hash('YOUR_LONG_UNIQUE_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
```

যদি কম্পিউটারে PHP না থাকে, Namecheap cPanel Terminal-এ PHP available থাকলে একই command চালাতে পারেন। না হলে trusted PHP password-hash generator ব্যবহার না করে local PHP install করা ভালো।

Output-এর সম্পূর্ণ hash কপি করুন।

## ৫. `config.php` তৈরি করুন

Repository-তে:

```text
config.sample.php
```

ফাইলটি copy করে নাম দিন:

```text
config.php
```

তারপর placeholder বদলে দিন:

```php
<?php
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'cpuser_bdoffer',
        'user' => 'cpuser_bdoffer',
        'pass' => 'YOUR_DATABASE_PASSWORD',
        'charset' => 'utf8mb4',
    ],
    'admin' => [
        'username' => 'your_admin_username',
        'password_hash' => '$2y$10$PASTE_THE_FULL_HASH_HERE',
    ],
];
```

`config.php` Git-এ commit করবেন না। `.gitignore`-এ এটি ইতিমধ্যে যুক্ত আছে।

## ৬. Namecheap-এ files upload করুন

1. **cPanel → Files → File Manager** খুলুন।
2. আপনার primary domain হলে `public_html` খুলুন। Addon domain হলে **cPanel → Domains** থেকে সঠিক **Document Root** দেখুন।
3. পুরোনো site থাকলে আগে backup নিন।
4. Repository-র ZIP upload করুন।
5. ZIP file select করে **Extract** চাপুন।
6. নিশ্চিত করুন `index.html` document root-এর সরাসরি ভিতরে আছে।

সঠিক structure এমন হবে:

```text
public_html/
├── .htaccess
├── api.php
├── config.php
├── database.sql
├── admin.html
├── admin.js
├── index.html
├── contact.html
├── faq.html
├── assets/
└── ...other public pages
```

`config.php` document root-এর বাইরে রাখতে পারলে আরও ভালো। যদি document root-এর ভিতরে রাখেন, repository-র `.htaccess` direct browser access block করবে।

## ৭. HTTPS চালু করুন

Admin password এবং bearer token অবশ্যই HTTPS দিয়ে পাঠাতে হবে। cPanel-এ **Namecheap SSL** অথবা **Security → SSL/TLS Certificates** থেকে certificate সক্রিয় করুন। তারপর পরীক্ষা করুন:

```text
https://yourdomain.com/
https://yourdomain.com/admin.html
```

HTTP দিয়ে admin login করবেন না।

## ৮. API পরীক্ষা করুন

Browser-এ খুলুন:

```text
https://yourdomain.com/api/health
```

সফল হলে এমন response পাবেন:

```json
{"ok":true,"service":"bdoffer-php-mysql"}
```

যদি `server_not_configured` আসে, `config.php` নেই বা incomplete।

যদি `database_unavailable` আসে, database name, username, password, host এবং user privileges পরীক্ষা করুন।

## ৯. Admin page চালান

Browser-এ খুলুন:

```text
https://yourdomain.com/admin.html
```

`config.php`-তে দেওয়া admin username এবং যে password দিয়ে hash তৈরি করেছেন সেটি ব্যবহার করে login করুন।

Login-এর পরে:

- নতুন affiliate link যোগ করতে পারবেন।
- URL পরিবর্তন করতে পারবেন।
- Link activate/deactivate করতে পারবেন।
- Placement ঠিক করতে পারবেন।
- Link delete করতে পারবেন।

Supported placement:

- Hero CTA
- Operator buttons
- Offer cards
- Section CTAs
- Countdown CTA

## ১০. Affiliate link যোগ করার নিয়ম

Admin page-এর **নতুন affiliate link** form-এ:

1. `Link key`-তে শুধু lowercase letter, number, `_` অথবা `-` ব্যবহার করুন। উদাহরণ: `new_partner`।
2. Label দিন।
3. HTTPS affiliate URL দিন।
4. Sort order দিন। ছোট সংখ্যা আগে আসে।
5. অন্তত একটি placement নির্বাচন করুন।
6. **Add link** চাপুন।

সাইটের public page refresh করলে active link-এর নতুন URL ব্যবহার হবে।

## ১১. Contact inquiry কোথায় থাকবে

Contact form-এর submission MySQL-এর `inquiries` table-এ যাবে। API endpoint:

```text
POST /api/inquiries
```

Authenticated inquiry endpoint:

```text
GET /api/admin/inquiries
```

বর্তমান supplied dashboard-এ affiliate links-এর UI আছে; inquiry table API-তে সংরক্ষিত হলেও inquiry-list UI আলাদা feature হিসেবে যোগ করা যাবে। phpMyAdmin থেকে `inquiries` table দেখেও inquiry পড়া যাবে।

## ১২. `.htaccess` কী করছে

`.htaccess` এই URL-গুলোকে PHP router-এ পাঠায়:

```text
/api/health       → api.php
/api/public-links → api.php
/api/admin/login  → api.php
/api/admin/links  → api.php
/api/inquiries    → api.php
```

এটি `config.php`, `database.sql`, `.git`, `data` এবং পুরোনো `server.js` direct access থেকেও block করে। Apache-তে `mod_rewrite` না চললে cPanel support-এ যোগাযোগ করুন; Namecheap Apache hosting-এ সাধারণত এটি enabled থাকে।

## ১৩. Troubleshooting

### `404 Not Found` on `/api/health`

`.htaccess` upload হয়েছে কি না দেখুন। File Manager-এ hidden files দেখানোর option চালু করুন। `api.php` document root-এ আছে কি না পরীক্ষা করুন।

### `server_not_configured`

`config.sample.php` copy করে `config.php` বানানো হয়েছে কি না পরীক্ষা করুন। Placeholder value রয়ে গেছে কি না দেখুন।

### `database_unavailable`

এই চারটি value পরীক্ষা করুন:

```text
host
name
user
pass
```

cPanel prefix-সহ সম্পূর্ণ database name এবং username ব্যবহার করুন। User-কে database-এ **ALL PRIVILEGES** দেওয়া আছে কি না দেখুন।

### Admin login failed

- Username exact match কি না দেখুন।
- Password hash সম্পূর্ণ কপি হয়েছে কি না দেখুন।
- Password hash-এর quote নষ্ট হয়েছে কি না দেখুন।
- Login-এর পরে `config.php` বদলালে browser session clear করে আবার login করুন।

### Link save করলে `server_error`

cPanel error log দেখুন। সাধারণত SQL table import অসম্পূর্ণ, MySQL user permission নেই, অথবা `placements` column তৈরি হয়নি। `database.sql` আবার পরীক্ষা করুন।

### Public link update হচ্ছে না

`/api/public-links` খুলে response দেখুন। Database-এ link `is_active = 1` কি না এবং placement সঠিক কি না পরীক্ষা করুন। Browser cache bypass করে refresh করুন।

## ১৪. Backup এবং security checklist

- `config.php` GitHub-এ push করবেন না।
- Admin password অন্য কোথাও reuse করবেন না।
- HTTPS ছাড়া admin চালাবেন না।
- নিয়মিত cPanel backup এবং phpMyAdmin database export রাখুন।
- `database.sql`-এ production password রাখবেন না।
- cPanel File Manager-এ `.htaccess` এবং config protection বজায় রাখুন।
- Admin password পরিবর্তন করতে নতুন hash তৈরি করে `config.php` update করুন।
- `admin_sessions` table পুরোনো session পরিষ্কার করতে মাঝে মাঝে চালাতে পারেন:

```sql
DELETE FROM admin_sessions WHERE expires_at < UTC_TIMESTAMP();
```

## ১৫. Production checklist

```text
[ ] MySQL database এবং user তৈরি হয়েছে
[ ] User database-এ ALL PRIVILEGES পেয়েছে
[ ] database.sql import হয়েছে
[ ] config.php তৈরি হয়েছে
[ ] password_hash বসানো হয়েছে
[ ] .htaccess upload হয়েছে
[ ] api.php document root-এ আছে
[ ] HTTPS active
[ ] /api/health success response দেয়
[ ] /admin.html login কাজ করে
[ ] একটি test affiliate link যোগ, edit, deactivate এবং delete করা হয়েছে
[ ] Contact form test করা হয়েছে
[ ] inquiries table-এ record এসেছে
[ ] Database backup নেওয়া হয়েছে
```
