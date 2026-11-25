/**
 * 4.7 — Kiểm tra Chương 4 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c4/o):
 * câu 1 41 (/iface ⇒ 201 nhận hết), câu 2 41 (/import-type ⇒ 201), câu 3 41-thutu (@IsInt() @Min(1) + "1" ⇒ "must not be less than 1"),
 * câu 4 42 (/whitelist {name} ⇒ mất email), câu 5 42 (/tf-expose vẫn mất email), câu 6 42 (/dat-khong-type ⇒ 201 thietBi [{}]),
 * câu 7 42 (/tim-ngam conTrong=false ⇒ true), câu 8 43 (/users/entity-thuong lộ passwordHash), câu 9 44-khong-plugin (properties {}),
 * câu 10 45-pha2 (test chỉ kiểm mã xanh vì lý do sai). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '4.7 — Chapter 4 quiz|||4.7 — Kiểm tra Chương 4',
  slug: 'nst-4-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 4: DTO là interface hay import type, thứ tự decorator với stopAtFirstError, PATCH làm mất dữ liệu và vì sao exposeUnsetFields không cứu khi transform, object lồng thiếu @Type, chuyển ngầm "false" thành true, @Exclude với object thường, plugin OpenAPI, và test xanh vì lý do sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter. Most ask "what does the client get?" or "what does the handler receive?" — the questions behind real data-loss and data-leak bugs.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a DTO must be a class imported as a value.</li>
<li>I know what <code>whitelist</code>, <code>forbidNonWhitelisted</code> and <code>transform</code> each change, and why PATCH can erase data.</li>
<li>I know when nested objects, <code>null</code> and query booleans slip through.</li>
<li>I can return an allow-list response DTO and explain why <code>@Exclude</code> on entities is not enough.</li>
<li>I can generate OpenAPI that contains real schemas.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương. Phần lớn hỏi "client nhận gì?" hoặc "handler nhận gì?" — đúng những câu đứng sau các lỗi mất dữ liệu và lộ dữ liệu ngoài đời.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao DTO phải là class nhập như giá trị.</li>
<li>Tôi biết <code>whitelist</code>, <code>forbidNonWhitelisted</code> và <code>transform</code> mỗi cái đổi gì, và vì sao PATCH có thể xoá dữ liệu.</li>
<li>Tôi biết khi nào object lồng, <code>null</code> và boolean trên query lọt qua.</li>
<li>Tôi trả được DTO phản hồi theo danh sách cho phép và giải thích vì sao <code>@Exclude</code> trên entity chưa đủ.</li>
<li>Tôi sinh được OpenAPI có schema thật.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A handler is create(@Body(new ValidationPipe()) dto: CreateBookingInterface), where CreateBookingInterface is a TypeScript interface. The client sends {"roomId":"gì cũng được","hack":true}. What happens?|||Handler là create(@Body(new ValidationPipe()) dto: CreateBookingInterface), trong đó CreateBookingInterface là interface TypeScript. Client gửi {"roomId":"gì cũng được","hack":true}. Chuyện gì xảy ra?',
        options: [
          '201 — the body is accepted unchanged; nothing was validated|||201 — thân được nhận nguyên vẹn; không có gì được kiểm',
          '400 — roomId must be a number|||400 — roomId phải là số',
          '400 — property hack should not exist|||400 — property hack should not exist',
          'The build fails: interfaces cannot be used with @Body()|||Build lỗi: không dùng interface với @Body() được',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.1, /iface returned 201 with the body as sent. An interface is erased; design:paramtypes records Object, which ValidationPipe skips. TypeScript compiles it happily.|||VI: Bài 4.1, /iface trả 201 với thân y như đã gửi. Interface bị xoá; design:paramtypes ghi Object, thứ ValidationPipe bỏ qua. TypeScript vẫn biên dịch vui vẻ.',
      },
      {
        question: 'The same valid DTO class is used, but a lint autofix changed the import to: import type { CreateBookingDto } from \'./booking.dto.js\'. A bad body is sent. What happens?|||Vẫn class DTO đúng đó, nhưng một lần tự sửa của lint đã đổi import thành: import type { CreateBookingDto } from \'./booking.dto.js\'. Gửi một thân xấu. Chuyện gì xảy ra?',
        options: [
          '400 as before — import type only affects the editor|||400 như cũ — import type chỉ ảnh hưởng trình soạn thảo',
          'The app refuses to start with "Nest can\'t resolve dependencies"|||Ứng dụng từ chối khởi động với "Nest can\'t resolve dependencies"',
          '201 — validation is silently skipped|||201 — việc kiểm bị bỏ qua im lặng',
          '500 — ValidationPipe crashes on a missing class|||500 — ValidationPipe sập vì thiếu class',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.1, /import-type returned 201 for the bad body; the compiled file had design:paramtypes [Function] instead of [CreateBookingDto]. A type-only import has no runtime value. DTOs must be imported as values.|||VI: Bài 4.1, /import-type trả 201 cho thân xấu; tệp biên dịch ghi design:paramtypes [Function] thay vì [CreateBookingDto]. Nhập chỉ-kiểu không có giá trị lúc chạy. DTO phải nhập như giá trị.',
      },
      {
        question: 'class A { @IsInt() @Min(1) roomId } validated with stopAtFirstError: true and roomId = "1" (a string). Which single message is returned?|||class A { @IsInt() @Min(1) roomId } được kiểm với stopAtFirstError: true và roomId = "1" (chuỗi). Thông báo duy nhất trả về là gì?',
        options: [
          'roomId must be an integer number|||roomId must be an integer number',
          'roomId must not be less than 1|||roomId must not be less than 1',
          'Both messages — stopAtFirstError stops between fields, not within one|||Cả hai câu — stopAtFirstError dừng giữa các trường, không dừng trong một trường',
          'No message — "1" is converted to 1 automatically|||Không có câu nào — "1" được tự đổi thành 1',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.1, thutu.ts: class A gave {"min":…}, class B (@Min(1) @IsInt()) gave {"isInt":…}. Decorators apply bottom-up, so the one closest to the property name runs first. Put the type check next to the name.|||VI: Bài 4.1, thutu.ts: class A cho {"min":…}, class B (@Min(1) @IsInt()) cho {"isInt":…}. Decorator áp từ dưới lên, cái sát tên thuộc tính chạy trước. Đặt kiểm kiểu sát tên.',
      },
      {
        question: 'PATCH /me with ValidationPipe({ whitelist: true, transform: true }); UpdateMeDto has optional name and email; the handler does Object.assign(user, dto). The client sends {"name":"Bình"}. Target ES2023. What happens to the stored user?|||PATCH /me với ValidationPipe({ whitelist: true, transform: true }); UpdateMeDto có name và email không bắt buộc; handler làm Object.assign(user, dto). Client gửi {"name":"Bình"}. Target ES2023. Người dùng đã lưu bị gì?',
        options: [
          'Only the name changes|||Chỉ tên đổi',
          'The request fails with 400: email is missing|||Request trượt với 400: thiếu email',
          'The name changes and the role is reset to its default|||Tên đổi và role về mặc định',
          'The name changes and the email becomes undefined (erased)|||Tên đổi và email thành undefined (bị xoá)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 4.2, /transform: keys ["name","email"] and the user lost the email. With ES2022+ class field semantics the DTO instance owns email: undefined, and Object.assign copies it. Copy only fields that were sent.|||VI: Bài 4.2, /transform: keys ["name","email"] và người dùng mất email. Với cách ES2022+ khai trường class, instance DTO có sẵn email: undefined, và Object.assign chép nó sang. Chỉ chép trường đã gửi.',
      },
      {
        question: 'To fix the previous bug a teammate adds transformOptions: { exposeUnsetFields: false } but keeps transform: true. Does the email survive?|||Để sửa lỗi câu trước, một đồng đội thêm transformOptions: { exposeUnsetFields: false } nhưng vẫn giữ transform: true. Email còn không?',
        options: [
          'Yes — that option removes unset fields in every mode|||Còn — tuỳ chọn đó gỡ trường chưa đặt ở mọi chế độ',
          'No — with transform the handler gets the instance itself, which still has email: undefined|||Không — có transform thì handler nhận chính instance, vẫn còn email: undefined',
          'Yes, but only for nested objects|||Còn, nhưng chỉ với object lồng',
          'The pipe throws an error: the two options conflict|||Pipe ném lỗi: hai tuỳ chọn xung đột',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.2: /wl-expose (no transform) kept the email, /tf-expose (with transform) still erased it. exposeUnsetFields affects classToPlain, which the pipe uses only when transform is off. The reliable fix is explicit copying (/map).|||VI: Bài 4.2: /wl-expose (không transform) giữ được email, /tf-expose (có transform) vẫn xoá. exposeUnsetFields tác động lên classToPlain, thứ pipe chỉ dùng khi tắt transform. Cách sửa chắc chắn là chép tường minh (/map).',
      },
      {
        question: 'A DTO has @ValidateNested({ each: true }) thietBi: ThietBiDto[] but no @Type(). Pipe: ValidationPipe({ whitelist: true }). Body: {"roomId":1,"thietBi":[{"ten":"","soLuong":999,"admin":true}]}. Response?|||Một DTO có @ValidateNested({ each: true }) thietBi: ThietBiDto[] nhưng thiếu @Type(). Pipe: ValidationPipe({ whitelist: true }). Thân: {"roomId":1,"thietBi":[{"ten":"","soLuong":999,"admin":true}]}. Phản hồi?',
        options: [
          '400 — thietBi.0.soLuong must not be greater than 5|||400 — thietBi.0.soLuong must not be greater than 5',
          '400 — property admin should not exist|||400 — property admin should not exist',
          '201 with thietBi: [{}] — nothing checked, everything stripped|||201 với thietBi: [{}] — không kiểm gì, bị lột sạch',
          '201 with the body unchanged|||201 với thân nguyên vẹn',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.2, /dat-khong-type returned 201 {"roomId":1,"thietBi":[{}]}. Without @Type the inner objects stay plain: no rules run, and whitelist strips all their properties. forbidUnknownValues: true would make this fail loudly.|||VI: Bài 4.2, /dat-khong-type trả 201 {"roomId":1,"thietBi":[{}]}. Thiếu @Type thì object bên trong vẫn là object thường: không luật nào chạy, và whitelist lột hết thuộc tính. forbidUnknownValues: true sẽ làm nó trượt ồn ào.',
      },
      {
        question: 'Query DTO with @IsOptional() @IsBoolean() conTrong?: boolean, pipe with transform: true and enableImplicitConversion: true. Request ?conTrong=false. What does the handler get?|||Query DTO có @IsOptional() @IsBoolean() conTrong?: boolean, pipe có transform: true và enableImplicitConversion: true. Request ?conTrong=false. Handler nhận gì?',
        options: [
          'conTrong: true|||conTrong: true',
          'conTrong: false|||conTrong: false',
          'conTrong: "false" (still a string)|||conTrong: "false" (vẫn là chuỗi)',
          'Nothing — the request fails with 400|||Không gì cả — request trượt với 400',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 4.2, /tim-ngam?conTrong=false returned "conTrong":true. Implicit conversion calls Boolean("false"), and any non-empty string is true. Convert explicitly with @Transform (or ParseBoolPipe), as q.ts does.|||VI: Bài 4.2, /tim-ngam?conTrong=false trả "conTrong":true. Chuyển ngầm gọi Boolean("false"), mà chuỗi không rỗng nào cũng là true. Chuyển tường minh bằng @Transform (hoặc ParseBoolPipe), như q.ts.',
      },
      {
        question: 'UserEntity has @Exclude() passwordHash, the controller uses ClassSerializerInterceptor, and the handler returns prismaRow as UserEntity (a plain object from Prisma). Is passwordHash in the response?|||UserEntity có @Exclude() passwordHash, controller dùng ClassSerializerInterceptor, và handler trả prismaRow as UserEntity (object thường từ Prisma). passwordHash có trong phản hồi không?',
        options: [
          'No — the cast makes the interceptor apply UserEntity\'s decorators|||Không — ép kiểu khiến interceptor áp decorator của UserEntity',
          'No — Prisma never returns passwordHash|||Không — Prisma không bao giờ trả passwordHash',
          'Yes — decorators apply only to class instances; a cast changes nothing at runtime|||Có — decorator chỉ áp lên instance của class; ép kiểu không đổi gì lúc chạy',
          'The interceptor throws because the object is not an instance|||Interceptor ném lỗi vì object không phải instance',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 4.3, /users/entity-thuong leaked passwordHash and resetToken exactly like returning the row. Use an allow-list response DTO with @SerializeOptions({ type }) or plainToInstance.|||VI: Bài 4.3, /users/entity-thuong lộ passwordHash và resetToken y như trả thẳng bản ghi. Dùng DTO trả về theo danh sách cho phép với @SerializeOptions({ type }) hoặc plainToInstance.',
      },
      {
        question: 'You add @nestjs/swagger, DocumentBuilder and SwaggerModule.setup(\'docs\', …), but nest-cli.json has no plugins. DTOs use only class-validator decorators. What is components.schemas.CreateBookingDto?|||Bạn thêm @nestjs/swagger, DocumentBuilder và SwaggerModule.setup(\'docs\', …), nhưng nest-cli.json không có plugins. DTO chỉ dùng decorator class-validator. components.schemas.CreateBookingDto là gì?',
        options: [
          'A full schema — swagger reads class-validator at runtime|||Schema đầy đủ — swagger đọc class-validator lúc chạy',
          '{"type":"object","properties":{}} — empty|||{"type":"object","properties":{}} — rỗng',
          'Missing — /docs returns 500|||Không có — /docs trả 500',
          'Only the required fields, without types|||Chỉ các trường bắt buộc, không có kiểu',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 4.4, without the plugin the schema was {"type":"object","properties":{}}. The CLI plugin (during nest build) writes types, required, rules and JSDoc descriptions; without it you need @ApiProperty on every field.|||VI: Bài 4.4, không có plugin thì schema là {"type":"object","properties":{}}. Plugin CLI (trong nest build) ghi kiểu, required, luật và mô tả JSDoc; thiếu nó thì trường nào cũng cần @ApiProperty.',
      },
      {
        question: 'Lab 4.5: you remove forbidNonWhitelisted AND @Type(() => ThietBiDto). The negative test only checks expect(r.status).toBe(400). The "status: APPROVED" case (its body also contains thietBi) — what happens?|||Lab 4.5: bạn gỡ forbidNonWhitelisted VÀ @Type(() => ThietBiDto). Test phủ định chỉ kiểm expect(r.status).toBe(400). Ca "status: APPROVED" (thân của nó cũng có thietBi) — chuyện gì xảy ra?',
        options: [
          'It fails, because status is now stripped and the request returns 201|||Nó đỏ, vì status giờ bị gỡ và request trả 201',
          'It fails with 413|||Nó đỏ với 413',
          'The whole test file crashes at import|||Cả tệp test sập lúc import',
          'It stays green — the request is still 400, but because of the nested thietBi, not status|||Nó vẫn xanh — request vẫn 400, nhưng vì thietBi lồng, không vì status',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 4.5, "break it": the status-only version had 1 failed / 13 passed; the status case passed for the wrong reason (forbidUnknownValues rejected the nested plain objects). With reason patterns, 3 tests failed — every real regression showed.|||VI: Bài 4.5, "thử phá": bản chỉ kiểm mã có 1 đỏ / 13 xanh; ca status xanh vì lý do sai (forbidUnknownValues từ chối các object lồng thường). Có mẫu lý do thì 3 test đỏ — mọi chỗ thoái lui thật đều hiện ra.',
      },
    ],
  },
};
