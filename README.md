# دربنا (Darbna) — منصة كورسات أونلاين

منصة تعليمية تشبه Udemy/يانفع: كورسات فيديو، اختبارات، شهادات إتمام، اشتراكات، وحجز حصص مباشرة أونلاين. مبنية بـ **Laravel + Inertia.js + React + Tailwind CSS**.

## الأدوار (Roles)

- **Admin**: يدير المستخدمين، يراجع ويوافق/يرفض كورسات المحاضرين، يشوف إحصائيات المنصة.
- **Instructor (محاضر)**: ينشئ كورسات (أقسام + دروس)، يبعتها للمراجعة، يديرها بعد النشر.
- **Student (طالب)**: يتصفح الكورسات المنشورة، يشترك (مجانًا أو عبر اشتراك فعّال)، يتابع تقدمه.

التسجيل في `/register` بيسمح للمستخدم يختار نوع الحساب (طالب أو محاضر). حسابات الأدمن بتتعمل يدويًا عن طريق الـ seeder أو الداتابيز مباشرة.

## الحالة الحالية للمشروع (v1 — الأساس التقني)

تم بناء الأساس الكامل: قاعدة البيانات، الصلاحيات، ولوحات التحكم الثلاث مع workflow المراجعة الكامل للكورسات. **لسه محتاجين نضيف** (المرحلة القادمة):

- [ ] رفع وتشغيل الفيديوهات الفعلي (التكامل مع Bunny.net Stream أو مشابه)
- [ ] الاشتراكات المدفوعة الفعلية (بوابة دفع Paymob/Kashier) — حاليًا فيه جدول `subscriptions` و `payments` جاهزين بس مفيش تكامل دفع فعلي
- [ ] الاختبارات (quizzes) — الجداول والعلاقات جاهزة، محتاجين واجهة إنشاء الأسئلة للمحاضر وواجهة حل الاختبار للطالب
- [ ] توليد شهادات PDF مع QR للتحقق
- [ ] حجز الحصص المباشرة + تكامل Zoom API
- [ ] رفع صور الكورسات/الأفاتار (حاليًا فيه أعمدة `thumbnail_path`/`avatar_path` بس بدون واجهة رفع)

## الستاك التقني

| الطبقة | التقنية |
|---|---|
| Backend | Laravel 12 (PHP 8.4) |
| Frontend | Inertia.js + React 18 + Tailwind CSS |
| قاعدة البيانات | SQLite (تطوير) / MySQL (إنتاج - متوافق مع Hostinger) |
| الصلاحيات | spatie/laravel-permission |

## التشغيل محليًا

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed   # ينشئ الأدوار + 3 حسابات تجريبية + خطط اشتراك تجريبية

npm run build   # أو npm run dev للتطوير
php artisan serve
```

### حسابات تجريبية (بعد `migrate --seed`)

| الدور | الإيميل | الباسورد |
|---|---|---|
| Admin | admin@darbna.test | password |
| Instructor | instructor@darbna.test | password |
| Student | student@darbna.test | password |

## بنية قاعدة البيانات (أهم الجداول)

- `courses` → `course_sections` → `lessons` (هيكل الكورس)
- `courses.status`: `draft → pending_review → published/rejected` (workflow المراجعة)
- `enrollments`: تسجيل الطالب في كورس (مجاني / عبر اشتراك)
- `subscription_plans` + `subscriptions`: خطط الاشتراك الشهري/السنوي
- `quizzes` + `quiz_questions` + `quiz_options` + `quiz_attempts`: الاختبارات
- `certificates`: شهادات الإتمام
- `live_sessions` + `live_session_bookings`: الحصص المباشرة والحجز
- `payments`: سجل المدفوعات (polymorphic، يغطي الاشتراكات وشراء الكورسات)

## الاختبارات (Tests)

```bash
php artisan test
```

فيه اختبارات تغطي: إنشاء كورس وإرساله للمراجعة، قبول/رفض الأدمن، تسجيل الطالب في كورس مجاني، منع التسجيل في كورس مدفوع بدون اشتراك، ومنع محاضر من تعديل كورس محاضر تاني.

## النشر على Hostinger

استضافة Hostinger (خطة Business) هي Shared Hosting مبنية على cPanel — مناسبة تمامًا لتشغيل تطبيق Laravel، لكن **مش مناسبة لاستضافة الفيديوهات مباشرة**. الخطوات:

1. **قاعدة البيانات**: أنشئ قاعدة بيانات MySQL من لوحة cPanel، وحدّث `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_DATABASE=اسم_القاعدة
   DB_USERNAME=...
   DB_PASSWORD=...
   ```

2. **رفع الكود**: استخدم Git deployment من cPanel (لو متاح) أو ارفع الملفات عبر File Manager/FTP، باستثناء `node_modules` (مش محتاجينه في الإنتاج، بس محتاجين `public/build` بعد التشغيل المحلي لـ `npm run build`).

3. **مسار الجذر (Document Root)**: وجّه الدومين لمجلد `public/` مش لجذر المشروع (مهم جدًا لأمان التطبيق).

4. **بعد الرفع**:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan migrate --seed --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

5. **الفيديوهات**: لازم تتخزن في خدمة خارجية زي [Bunny.net Stream](https://bunny.net/stream/) أو Cloudflare Stream — مش على استضافة Hostinger نفسها. ده هيدّيك:
   - حماية الفيديو من التحميل المباشر (token-based streaming).
   - جودة متغيرة حسب سرعة الإنترنت.
   - عدم استهلاك مساحة/باندويدث الاستضافة المشتركة.

6. **المهام المجدولة (Queues/Cron)**: Hostinger Shared مش بيسمح بتشغيل Queue Worker دائم. استخدم Laravel's `schedule:run` عن طريق Cron Job من cPanel كل دقيقة:
   ```
   * * * * * php /home/USER/يوصل_لمجلد_المشروع/artisan schedule:run >> /dev/null 2>&1
   ```

## خطة التطوير المرحلية المقترحة

1. **المرحلة 1 (الحالية)**: هيكل المستخدمين والأدوار + إنشاء ومراجعة الكورسات ✅
2. **المرحلة 2**: تكامل رفع/تشغيل الفيديو (Bunny.net) + تكامل الدفع (Paymob/Kashier) للاشتراكات وشراء الكورسات
3. **المرحلة 3**: واجهات الاختبارات (إنشاء أسئلة للمحاضر، حل الاختبار للطالب، احتساب النتيجة) + توليد شهادات PDF
4. **المرحلة 4**: حجز الحصص المباشرة + تكامل Zoom API (Server-to-Server OAuth)
5. **المرحلة 5**: تحسينات لوحة التحكم (تقارير، رفع صور/شعارات، تقييمات الكورسات)
