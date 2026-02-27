# Response Interceptor — توضیح به زبان ساده (فارسی)

این فایل برای توسعه‌دهندگان تازه‌کار است تا بفهمند **اینترسپتور پاسخ** چیست و چطور کار می‌کند.

---

## مشکل قبلی چه بود؟

قبلاً در هر متد کنترلر مجبور بودیم همین کد تکراری را بنویسیم:

```ts
return res.status(HttpStatus.OK).json({
  statusCode: HttpStatus.CREATED,
  data: ticket,
  message: 'user created',
})
```

- در هر endpoint این سه خط تکرار می‌شد.
- اگر یک روز شکل پاسخ را عوض کنیم، باید همهٔ کنترلرها را دستی عوض کنیم.

---

## راه‌حل: Interceptor (اینترسپتور)

**اینترسپتور** در NestJS یعنی یک قطعه کد که **بین درخواست کاربر و خروجی کنترلر** قرار می‌گیرد و خروجی را قبل از فرستادن به کاربر **یکدست** می‌کند.

```
[کاربر درخواست می‌فرستد] → [کنترلر فقط data برمی‌گرداند] → [Interceptor شکل پاسخ را می‌سازد] → [پاسخ نهایی به کاربر]
```

یعنی:
- کنترلر فقط **داده** (و در صورت نیاز پیام و کد وضعیت) برمی‌گرداند.
- اینترسپتور همیشه پاسخ را به شکل `{ statusCode, data, message }` درمی‌آورد و به کلاینت می‌فرستد.

---

## فایل‌ها چطور کار می‌کنند؟

### ۱) `interfaces/response.interface.ts`

- **Interface** یعنی «قالب» نوع داده. اینجا می‌گوییم هر پاسخ API باید سه تا فیلد داشته باشد: `statusCode`, `data`, `message`.
- **کلاس `ApiResponse`** یک کلاس کمکی است. به جایش که خودت `res.status().json(...)` بنویسی، فقط می‌نویسی:
  - `new ApiResponse(داده, 'پیام', کد_وضعیت)`
  مثال: `new ApiResponse(ticket, 'Ticket found', HttpStatus.OK)`

### ۲) `interceptors/response.interceptor.ts`

- **`intercept`**: متدی که Nest برای هر درخواست صدا می‌زند.
- **`next.handle()`**: کار کنترلر را انجام می‌دهد و خروجی کنترلر را برمی‌گرداند (مثلاً یک `ApiResponse` یا فقط یک شیء).
- **`map(...)`**: خروجی کنترلر را می‌گیرد و با تابع `format` به شکل استاندارد `{ statusCode, data, message }` درمی‌آورد.
- **`tap(...)`**: روی همان شیء نهایی کار می‌کند و **کد وضعیت HTTP** را روی `res` ست می‌کند (`res.status(body.statusCode)`).
- در نهایت همان شیء استاندارد به عنوان بدنهٔ پاسخ به کاربر فرستاده می‌شود.

یعنی:
- اگر کنترلر `new ApiResponse(ticket, 'Ticket found', 200)` برگرداند → اینترسپتور همان را به صورت `{ statusCode: 200, data: ticket, message: 'Ticket found' }` می‌فرستد و `res.status(200)` را ست می‌کند.
- اگر کنترلر فقط یک مقدار ساده برگرداند (مثلاً `return someData`) → اینترسپتور آن را به صورت `{ statusCode: 200, data: someData, message: 'Success' }` درمی‌آورد.

### ۳) ثبت سراسری در `app.module.ts`

- با `APP_INTERCEPTOR` و `useClass: ResponseInterceptor` به Nest می‌گوییم: **برای همهٔ درخواست‌ها** قبل از فرستادن پاسخ، از این اینترسپتور استفاده کن.
- پس لازم نیست در هر کنترلر جداگانه اینترسپتور را اضافه کنی.

---

## استفاده در کنترلر (الان چطور کد می‌نویسیم؟)

**قبل (با `@Res()` و تکرار):**

```ts
async findOne(@Res() res: express.Response, @Param('id') id: string) {
  const ticket = await this.ticketsService.findOne(+id)
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.CREATED,
    data: ticket,
    message: 'user created',
  })
}
```

**بعد (با اینترسپتور):**

```ts
async findOne(@Param('id') id: string) {
  const ticket = await this.ticketsService.findOne(+id)
  return new ApiResponse(ticket, 'Ticket found', HttpStatus.OK)
}
```

- دیگر به `@Res()` و `res` نیاز نیست.
- فقط داده و پیام و در صورت نیاز کد وضعیت را به `ApiResponse` می‌دهی؛ بقیه را اینترسپتور انجام می‌دهد.

---

## استفاده در پروژهٔ دیگر

برای اینکه همین رفتار را در یک پروژهٔ Nest دیگر داشته باشی:

1. پوشهٔ `common` (همان که شامل `interfaces` و `interceptors` و در صورت وجود `index.ts` است) را کپی کن در آن پروژه (مثلاً داخل `src/common`).
2. در `app.module.ts` آن پروژه:
   - `ResponseInterceptor` را import کن.
   - در آرایهٔ `providers` همین را اضافه کن:
     ```ts
     { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }
     ```
3. در کنترلرها به جای `res.status().json(...)` از `new ApiResponse(data, message, statusCode)` استفاده کن و `@Res()` را حذف کن.

اگر بخواهی خیلی تمیز باشد، می‌توانی همین پوشهٔ `common` را به یک **پکیج npm جدا** یا یک **ماژول مشترک** (مثلاً با Git submodule یا یک پکیج داخلی) تبدیل کنی و در چند پروژه import کنی.

---

## خلاصه

| قبل | بعد |
|-----|-----|
| در هر متد `res.status().json({...})` | فقط `return new ApiResponse(data, message, statusCode)` |
| وابستگی به `@Res()` و `express.Response` | کنترلر ساده‌تر و فقط با داده و سرویس |
| تغییر فرمت پاسخ = تغییر در همهٔ کنترلرها | تغییر در یک جا (همین اینترسپتور) |

اگر سوالی داشتی می‌توانی روی همین فایل یا روی کد `ResponseInterceptor` و `ApiResponse` کامنت بگذاری و دوباره بخوانی.
