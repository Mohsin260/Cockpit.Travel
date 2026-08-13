/**
 * Upsert 3 additional travel-intelligence articles per locale (ar + es) so
 * each locale has 7 published travel-intelligence articles (HomeTemplate's
 * VideoNews section needs 1 featured + 3 left + 3 right cards).
 *
 * Run: node scripts/add-intel-articles.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

let MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set");
  process.exit(1);
}
if (!MONGO_URI.includes("/cockpittravel-db")) {
  const base = MONGO_URI.split("?")[0].replace(/\/+$/, "");
  const params = MONGO_URI.includes("?") ? "?" + MONGO_URI.split("?")[1] : "";
  MONGO_URI = `${base}/cockpittravel-db${params}`;
}

const CAT_LABELS = {
  ar: "ذكاء السفر",
  es: "Inteligencia de Viaje",
};

const ARTICLES = [
  // ── Arabic (ar) ────────────────────────────────────────────────
  {
    slug: "ar-digital-visa-guide",
    locale: "ar",
    title: "التأشيرات الرقمية: كيف تنجز سفرك دون خطوة واحدة إلى السفارة؟",
    excerpt: "دليل عملي للتأشيرات الإلكترونية وإلغاء التأشيرات: الوجهات التي أخذت المبادرة، وخطوات التقديم، وما تحتاجه قبل أن تدخل الطائرة.",
    author: "yara-almuhammad",
    authorName: "يارة المحمد",
    date: "2025-07-14",
    readTime: 7,
    tags: ["تأشيرات رقمية", "السفر بدون ورق", "إجراءات السفر"],
    views: 18450,
    image: "https://images.unsplash.com/photo-1462899006636-339e08d1844e?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>كانت التأشيرة يوماً محطة مرعبة في أي خطة سفر: طوابير، أوراق لا تنتهي، وأسابيع من الانتظار. اليوم تحول عدد متزايد من الوجهات إلى التأشيرة الإلكترونية وحتى الإلغاء الكامل لمتطلبات الدخول لعشرات الجنسيات، فتحولت من عائق إلى بند بسيط في الميزانية.</p><p>التأشيرة الإلكترونية تقتصر في معظم الأنظمة على ملء نموذج يبسط قائمة بياناتك الشخصية ورحلة السفر وتاريخ العودة، ثم موافقة خلال 48 إلى 72 ساعة بمعظمها. بعض الدول بالفعل تشغّل أنظمة تمنح القرار الفوري قبل أن تدفع رسوم الإقامة.</p><p>الأهم في 2026 هو نمو السفر دون تأشيرة بين الأسواق الناشئة: اتفاقات إقليمية متبادلة كشفت مسارات طيران جديدة بلا أي ورقة، وفتحت أبوابها لمسافرين كانوا يحتاجون سابقاً أسابيع من التحضير.</p><p>قبل أن تحجز حجزك التالي تحقق دائماً من صلاحية جوازك لبضعة أشهر تتجاوز تاريخ العودة، ومن محدودية العمل لدى بعض التأشيرات الإلكترونية التي قد لا تسمح بالعمل أو الدراسة، وابحث عن الرسوم المخفية مثل التأمين الإجباري.</p><p>الخلاصة: التأشيرة لم تعد عائقاً في أغلب الحالات، لكنها لا تزال بحاجة إلى قراءة دقيقة للشروط. نصف خطأ في البيانات قادر على إعادة جدول رحلة استغرقت أسبوعاً كاملاً من التخطيط.</p>",
    keyTakeawaysContent:
      "<ul><li>التأشيرات الإلكترونية تنجز خلال 48–72 ساعة في معظم الأنظمة الحديثة</li><li>الأعلى مبادرة تمنح موافقات فورية قبل دفع الرسوم</li><li>اتفاقيات الإعفاء الإقليمية فتحت مسارات جديدة بلا أوراق</li><li>راجع صلاحية الجواز قبل العودة بشهور للخريف</li><li>لا تهمل الرسوم المخفية مثل التأمين الإجباري</li></ul>",
  },
  {
    slug: "ar-flight-delay-passenger-rights",
    locale: "ar",
    title: "تأخرت رحلتك؟ حقوقك التي لا تعرفها في المطارات الجديدة",
    excerpt: "ماذا يستحق المسافر عند التأخير أو الإلغاء: الرعاية، الإقامة، التعويض، وسياسات شركات الطيران القصيرة في 2026.",
    author: "omar-alharbi",
    authorName: "عمر الحربي",
    date: "2025-06-22",
    readTime: 6,
    tags: ["حقوق المسافر", "تأخر الرحلات", "تعويضات الطيران"],
    views: 22310,
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>أكثر ما يفسد رحلة مخططة بعناية هو ساعة تأخير تسبق اصطفافاً ثانياً على بوابة لم يعلق عليها أحد. لكن قواعد الطيران المدني الجديدة وسياسات شركات الطيران الكبرى أصبحت أكثر ذكاءً في 2026، وأقل تعاطفاً مع من لا يعرف حقوقه.</p><p>التأخير فوق عتبة معينة – تبدأ غالباً من ثلاث ساعات – يفتح حقك في الرعاية الأساسية: وجبات، مشروبات، ووجبة اتصال إن استدعت الحاجة، ومع التأخير الليلي يضاف توفير إقامة فندقية ونقل من وإلى المطار من غير كلفة إضافية.</p><p>التحويل القسري إلى رحلة أخرى لم يعد سوى أحد الخيارات؛ لك الحق البديل الأقرب زمناً، أو استرداد كامل ثمن التذكرة والكلف المرافقة له، وهي نقطة يغفلها كثير في المزاحمة على العدادات.</p><p>أما التعويض المالي فيتوقف على أسباب التأخير: حين يكون خطأ شركة النقل، قواعد كثير من الأسواق تحدد مبالغ ثابتة تطول مدتها مع طول المسار. السبب الاستثنائي مثل الطقس أو الإضرابات العامة يبقي الحق في الرعاية دون التعويض.</p><p>أفضل غالباً تصوير كل إشعار مطبوع تحصل عليه من الموظفين والاحتفاظ بالتذاكر، ثم التقديم عبر موقع الشركة أو تطبيقات الاسترداد قبل شهر. معظم المطالبات الناجحة تأتي ممن وثقوا لا ممن تركوا الأمر للذكرى.</p>",
    keyTakeawaysContent:
      "<ul><li>تأخير +3 ساعات يفتح حق الرعاية والوجبات والاتصال</li><li>التأخير الليلي يجبر الشركة على الإقامة والنقل عادة</li><li>لك خيار استرداد التذكرة بالكامل عند التحويل القسري</li><li>التعويض المالي يلزم عند الخطأ الملحوظ للشركة</li><li>وثّق إشعارات التأخير وتقدم بالمطالبة إلكترونياً مبكراً</li></ul>",
  },
  {
    slug: "ar-hotel-booking-cost-blunders",
    locale: "ar",
    title: "أخطاء حجز الفنادق التي تجعلك تدفع أضعاف الثمن",
    excerpt: "لماذا يدفع الكثيرون ضعف السعر الفعلي؟ تحليل حي لأساليب التسعير، ومتى تحجز مباشرة، ومتى تقرأ الرسوم الصغيرة.",
    author: "hussam-almaliki",
    authorName: "حسام المالكي",
    date: "2025-05-03",
    readTime: 8,
    tags: ["حجز فنادق", "أسعار الإقامة", "نصائح التوفير"],
    views: 15780,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>السعر الذي تراه في نتائج البحث نادراً ما يكون السعر الذي تدفعه. بين الضرائب ورسوم المنتجع والتأمين خيارات الأسعار الليلية، يتضخم الفاتورة النهائية أحياناً بنسبة 30 في المئة فوق ما ظننت أنه الإجمالي.</p><p>أبرز الأخطاء حجز الأوّل في القائمة ظناً منك أنه الأقل سعراً، بينما الترتيب في كثير من المنصات يجري بالأمانة وليس بالتكلفة الفعلية. المرور على النتيجة الثانية والثالثة ومقارنة السياسة الكاملة – لا السعر فقط – يغيّر النتيجة.</p><p>السر الآخر في وكلاء السفر والمباشرة: الحجز على موقع الفندق نفسه أحياناً يمنحك أفضل الغرف، ومجموعات ولاء تتراكم دون وسيط، وميزة إلغاء أسهل. المقارنة عبر الأسواق تشمل وسطاء تطرح أسعاراً أدنى للتجارب الموسمية وتتطلب إيجاد الفجوة بنفسك.</p><p>اقرأ دائماً سطر الرسوم الصغير: سياسة الإلغاء، وقيمة الحجز المسبق على الموقع، وتقارير الجيران عن ضريبة «المنتجع» التي تؤخذ ليلاً لدى بعض الوجهات الساحلية، بجانب خيار عدم التنظيف اليومي الذي يوفّر عشرات الدولارات.</p><p>القاعدة الذهبية: احجز مبكراً لمسافة موسمية، تأكد من سياسة الإلغاء والغرامات، ثم احجز مباشرة إن تساوت الأسعار. التوفير ليس مهارة، بل روتين من ثلاث دقائق قبل كل حجز.</p>",
    keyTakeawaysContent:
      "<ul><li>الفواتير النهائية تزيد عن المعروض بـ30% عبر الرسوم المتراكبة</li><li>الترتيب في المنصات ليس دالاً على أفضل سعر</li><li>الحجز المباشر يمنح مزايا ولاء وسياسة إلغاء مرنة</li><li>افحص ضريبة المنتجع وسياسة التنظيف في السطر الصغير</li><li>الحجز المبكر قبل الموسم يخفض التكلفة بشكل ملموس</li></ul>",
  },

  // ── Spanish (es) ───────────────────────────────────────────────
  {
    slug: "es-visas-digitales-guia",
    locale: "es",
    title: "Visas digitales: cómo viajar sin pisar una embajada",
    excerpt: "Guía práctica de la visa electrónica y los destinos sin visa: cuáles dieron el paso, cómo solicitar y qué revisar antes de subir al avión.",
    author: "camila-ruiz",
    authorName: "Camila Ruiz",
    date: "2025-07-14",
    readTime: 7,
    tags: ["visas digitales", "viajar sin papeles", "trámites de viaje"],
    views: 16880,
    image: "https://images.unsplash.com/photo-1462899006636-339e08d1844e?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>La visa fue durante años el escalón más temido de cualquier viaje: filas, papeles y semanas de espera. Hoy un número creciente de destinos adoptó la visa electrónica e incluso la eliminación total de requisitos para decenas de nacionalidades, y el trámite pasó de ser un obstáculo a una línea en el presupuesto.</p><p>La visa electrónica se reduce en la mayoría de los sistemas a llenar un formulario con tus datos, el viaje y la fecha de salida, con respuesta en 48 a 72 horas casi siempre. Algunos países ya operan sistemas de aprobación inmediata and incluso cobran la tasa después de decidir.</p><p>Lo más relevante en 2026 es el crecimiento de los viajes sin visa entre mercados emergentes: acuerdos regionales recíprocos abrieron rutas aéreas nuevas sin un solo documento y dieron acceso a viajeros que antes necesitaban semanas de preparación.</p><p>Antes de reservar tu próximo viaje verifica siempre que tu pasaporte tenga varios meses de vigencia más allá de la fecha de regreso, revisa las limitaciones laborales de algunas visas electrónicas y busca cargos ocultos como el seguro obligatorio.</p><p>Conclusión: la visa dejó de ser un freno en la mayoría de los casos, pero sigue exigiendo una lectura fina de las condiciones. Medio error en los datos puede reprogramar un itinerario que costó una semana entera de planificación.</p>",
    keyTakeawaysContent:
      "<ul><li>Las visas electrónicas se resuelven en 48–72 horas en los sistemas modernos</li><li>Los sistemas avanzados aprueban de forma inmediata</li><li>Los acuerdos regionales abrieron rutas sin documentación</li><li>Verifica la vigencia del pasaporte con meses de margen</li><li>No ignores los cargos ocultos como el seguro obligatorio</li></ul>",
  },
  {
    slug: "es-derechos-pasajeros-retrasos",
    locale: "es",
    title: "Mi vuelo se retrasó: los derechos que la mayoría desconoce",
    excerpt: "Qué te corresponde ante demoras y cancelaciones: asistencia, alojamiento, compensación y las políticas cortas de las aerolíneas en 2026.",
    author: "andres-gutierrez",
    authorName: "Andrés Gutiérrez",
    date: "2025-06-22",
    readTime: 6,
    tags: ["derechos del pasajero", "retrasos de vuelo", "compensaciones"],
    views: 20740,
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>Nada arruina un viaje bien planeado como una hora de demora que antecede a otra fila en una puerta donde nadie explica nada. Pero las regulaciones de aviación civil y las políticas de las grandes aerolíneas se volvieron más precisas en 2026 y menos comprensivas con quien no conoce sus derechos.</p><p>La demora por encima de un umbral — que suele empezar en tres horas — abre tu derecho a la asistencia básica: comidas, bebidas y comunicación, y con una demora nocturna se suma alojamiento y traslado sin costo adicional.</p><p>El redireccionamiento forzoso ya no es tu única opción; tienes derecho al siguiente vuelo disponible, o al reembolso íntegro del billete y gastos asociados, un punto que muchos pierden en la pelea en el mostrador.</p><p>La compensación económica depende de las causas: cuando es culpa de la aerolínea, varias legislaciones fijan montos escalonados por distancia. La causa excepcional como el clima o la huelga general mantiene la asistencia pero excluye la compensación.</p><p>Lo ideal es fotografiar cada aviso impreso que recibas del personal, conservar los billetes y reclamar por la web o las apps de reembolso dentro del primer mes. La mayoría de los reclamos exitosos proviene de quien documentó y no de quien confió en la memoria.</p>",
    keyTakeawaysContent:
      "<ul><li>Una demora de +3 horas activa el derecho a asistencia y comunicación</li><li>La demora nocturna suele obligar a alojamiento y traslado</li><li>Puedes elegir el reembolso total ante el redireccionamiento forzoso</li><li>La compensación aplica cuando la culpa es de la aerolínea</li><li>Documenta los avisos y presenta tu reclamo en línea cuanto antes</li></ul>",
  },
  {
    slug: "es-apps-ia-planificar-2026",
    locale: "es",
    title: "Las apps con IA que planifican tu viaje mejor que un agente",
    excerpt: "Repaso práctico de las nuevas herramientas: itinerarios personalizados, alertas de precio y cómo usarlas sin perder el control.",
    author: "valeria-soto",
    authorName: "Valeria Soto",
    date: "2025-05-03",
    readTime: 8,
    tags: ["inteligencia artificial", "planificación de viajes", "apps de viaje"],
    views: 14390,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=650&fit=crop",
    bodyContent:
      "<p>La inteligencia artificial dejó de ser una promesa de laboratorio y entró a las apps que ya usamos para volar, dormir y movernos. La pregunta ya no es si conviene, sino cómo usarla sin que el viaje se convierta en un catálogo de opciones medias.</p><p>Los planificadores automáticos hoy generan un itinerario detallado en segundos: días, horarios, reservas sugeridas y tiempos de traslado, todo según tu presupuesto y estilo. Probé uno para una semana en Ciudad de México y salió un plan que incluía mercados, museos y un día de aire abierto, equilibrado y realista.</p><p>Las alertas de precio son otra categoría ganadora: los motores comparan miles de tarifas y notifican en el momento del descenso, además de predecir cuándo conviene esperar y cuándo reservar ya. Con los hoteles pasa algo similar con los «mejores momentos» de las tasas dinámicas.</p><p>El límite está en el conocimiento local: el modelo no camina por tu colonia ni conoce el puesto de tacos de la esquina. Úsalo para el esqueleto, pero reserva siempre la improvisación para los detalles que solo se descubren en la calle.</p><p>Mi consejo: escribe tus limitaciones reales — presupuesto, movilidad, acompañantes — antes de pedirle el plan, y revisa cada reserva sugerida contra la opinión humana. El equilibrio entre máquina y asombro es la forma más rentable de viajar hoy.</p>",
    keyTakeawaysContent:
      "<ul><li>Los planificadores con IA generan itinerarios detallados al instante</li><li>Las alertas de precio anticipan cuándo reservar y cuándo esperar</li><li>La predicción de tarifas reduce el miedo a comprar anticipado</li><li>El conocimiento local sigue siendo dominio humano</li><li>Define tus límites reales antes de pedir el plan</li></ul>",
  },
];

async function main() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection;
  console.log(`connected: ${db.name}`);

  let created = 0;
  for (const a of ARTICLES) {
    const doc = {
      ...a,
      category: "travel-intelligence",
      categoryLabel: CAT_LABELS[a.locale],
      status: "published",
      content_type: "article",
      featured: false,
      articleMedia: { heroCoverMedia: { url: a.image } },
      updatedAt: new Date(),
    };
    delete doc.image;
    const exists = await db.collection("articles").findOne({ slug: a.slug, locale: a.locale });
    if (exists) {
      await db.collection("articles").updateOne({ slug: a.slug, locale: a.locale }, { $set: doc });
      console.log(`  [${a.locale}] Updated: ${a.slug}`);
    } else {
      await db.collection("articles").insertOne({ ...doc, image: a.image, createdAt: new Date() });
      console.log(`  [${a.locale}] Created: ${a.slug}`);
      created++;
    }
  }
  console.log(`✓ articles processed (${created} newly created)`);

  for (const locale of ["ar", "es"]) {
    const counts = await db.collection("articles").aggregate([
      { $match: { locale, status: { $ne: "draft" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]).toArray();
    for (const c of counts) {
      await db.collection("categories").updateOne(
        { slug: c._id, locale },
        { $set: { count: c.count } }
      );
    }
    console.log(`  [${locale}] category counts: ${JSON.stringify(counts)}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});