# GitHub Actions Workflow Setup

## 🔧 إعداد المتغيرات المطلوبة

### المتغيرات الإلزامية

قبل أن يعمل الـ Workflow بشكل صحيح، يجب إضافة المتغيرات التالية:

#### 1. VITE_API_URL (إلزامي)
عنوان API الخاص بالخادم

**الإعداد:**
1. اذهب إلى `Settings` → `Secrets and variables` → `Actions` → `Variables`
2. اضغط `New repository variable`
3. **Name:** `VITE_API_URL`
4. **Value:** مثلاً `https://your-api-domain.com`

**أمثلة:**
- `https://api.yourdomain.com`
- `http://your-server-ip:3000`
- `https://username.github.io/repo-name` (إذا نشرت السيرفر على GitHub Pages)

---

## 📱 المتغيرات الاختيارية (للتوقيع الرقمي)

### لـ iOS (للنشر على App Store)

إذا أردت توقيع التطبيق ونشره على App Store، أضف:

1. **IOS_CERTIFICATE** - شهادة التوقيع (P12 file base64)
2. **IOS_PROVISION_PROFILE** - ملف Provisioning Profile (base64)
3. **CERTIFICATE_PASSWORD** - كلمة سر الشهادة

**كيفية التحويل إلى base64:**
```bash
base64 -i certificate.p12 -o certificate.txt
base64 -i profile.mobileprovision -o profile.txt
```

### لـ Android (للنشر على Play Store)

إذا أردت توقيع APK ونشره على Play Store، أضف:

1. **ANDROID_KEYSTORE** - ملف Keystore (base64)
2. **KEYSTORE_PASSWORD** - كلمة سر Keystore
3. **KEY_ALIAS** - اسم المفتاح
4. **KEY_PASSWORD** - كلمة سر المفتاح

**كيفية التحويل إلى base64:**
```bash
base64 -i keystore.jks -o keystore.txt
```

---

## 🚀 كيف يعمل الـ Workflow

عند عمل Push للفرع `main`، سيتم تلقائياً:

1. **deploy-server** → نسخ مجلد server إلى فرع `server`
2. **deploy-web** → بناء نسخة الويب ونشرها في فرع `web` و GitHub Pages
3. **deploy-ios** → بناء نسخة iOS ونشرها في فرع `ios`
4. **deploy-android** → بناء نسخة Android ونشرها في فرع `android`

---

## ✅ GitHub Pages Setup

لتفعيل GitHub Pages:

1. اذهب إلى `Settings` → `Pages`
2. **Source:** اختر `GitHub Actions`
3. احفظ التغييرات

سيكون الموقع متاحاً على:
```
https://[username].github.io/[repo-name]/
```

---

## 📝 ملاحظات مهمة

### للتطوير المحلي:
أنشئ ملف `.env` في مجلد `app`:
```env
VITE_API_URL=http://localhost:3000
```

### الحد الأدنى للعمل:
- ✅ يجب إضافة `VITE_API_URL` فقط
- ⚠️ التوقيع الرقمي اختياري (للتطبيقات المبنية فقط)

### Build Outputs:
- **Web:** يُبنى في `app/dist/`
- **iOS:** مشروع Xcode في `app/ios/`
- **Android:** APK في `app/android/app/build/outputs/apk/`

---

## 🔍 استكشاف الأخطاء

### إذا فشل البناء:
1. تحقق من أن `VITE_API_URL` مُضاف في Variables
2. تحقق من أن `npm run build` يعمل محلياً
3. راجع سجلات (logs) الـ Actions في GitHub

### إذا لم يظهر الموقع على Pages:
1. تأكد من تفعيل GitHub Pages في Settings
2. تأكد من أن الـ workflow اكتمل بنجاح
3. انتظر 1-2 دقيقة لنشر التغييرات

---

## 🆘 للمساعدة

راجع سجلات الـ Actions في:
```
Repository → Actions → Deploy All Platforms
```
