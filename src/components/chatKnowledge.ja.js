import { PROFILE, PROJECTS as PROJECTS_ID, extractEmail as extractEmailBase } from './chatKnowledge.js'
import * as en from './chatKnowledge.en.js'

export { PROFILE }

const HAS_JA_RX = /[぀-ヿ㐀-䶿一-鿿豈-﫿々〆]/
const hasJa = (text) => HAS_JA_RX.test(text || '')

const baseNorm = (rawText) =>
  String(rawText || '')
    .normalize('NFKC')
    .replace(/[‘’ʼ]/g, "'")

function approxWords(text) {
  const jaChars = (text.match(/[぀-ヿ㐀-鿿豈-﫿々]/g) || []).length
  const latinWords = text.replace(/[^\x20-\x7e]/g, ' ').split(/\s+/).filter(Boolean).length
  return latinWords + Math.ceil(jaChars / 3)
}

const SEP = '[\\s、。,.!?！？〜~ー…・]*'

function sweepRx(core, filler = '(?!)') {
  return new RegExp(`^(?:(?:${filler})${SEP})*(?:${core})(?:${SEP}(?:${core}|${filler}))*${SEP}$`, 'i')
}

export function extractEmail(rawText) {
  return extractEmailBase(baseNorm(rawText).replace(/[^\x20-\x7e]/g, ' '))
}

export const ABOUT_HTML = [
  '<p><strong>Jose Elio Parhusip, S.Bns.</strong>をご紹介します。</p>',
  '<p>バンドンにあるUniversitas Logistik dan Bisnis Internasional（ULBI）でデジタルビジネスの学士号を取得しました。現在は契約のFull Stack DeveloperとしてPT Sistem Pelayanan Kesehatan dan Data（SPKD）の開発に携わり、GoでMedCredixのバックエンドを構築しています。</p>',
  '<p>Web・モバイル・データ・AIの分野に強い関心を持っています。React.js、Vue.js、Node.js、PHP、MySQL、PostgreSQLを使ったアプリケーションを一貫して開発でき、システムモデリング（UML・ERD・フローチャート）から、MidtransやRajaOngkirと連携したECシステム、PythonとStreamlitによるデータ可視化まで手がけてきました。モバイルではFlutterとDartでアプリを開発しています。SAPの認定資格も取得しています。</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li><strong>フルスタック・モバイル：</strong>フロントエンドからバックエンド、データベースまで、WebアプリとFlutterによるモバイルアプリの両方を一貫して開発できます。</li>',
  '<li><strong>分析的で論理的：</strong>System AnalystとしてERD・UML・フローチャートを設計し、プロジェクトのスケジュールや予算の管理も経験しています。</li>',
  '<li><strong>チームワーク：</strong>学生団体での活動経験が豊富で、チームの中でさまざまな役割のメンバーと協力しながら、ユーザーのニーズに合ったプロダクトを形にしてきました。</li>',
  '</ul>',
  '<p>主な使用ツール：Flutter、Figma、Power BI、Python、React、Streamlit、Vue.js、Excel、Plotly、Google Colab、PostgreSQL、MySQL、Node.js、Go、PHP。</p>',
].join('')

export const EDUCATION_HTML = [
  '<p><strong>Jose Elio Parhusip, S.Bns.</strong>は、バンドンにあるUniversitas Logistik dan Bisnis Internasional（ULBI）のデジタルビジネス学科を卒業し、学士号を取得しました。</p>',
  '<p>在学中はシステム設計（UML・ERD・フローチャート）やWeb・モバイルアプリの開発を学び、SAPの認定資格も取得しています。</p>',
].join('')

export const CONTACT_HTML = [
  '<p>Joseに直接連絡したい場合は、<strong>{email}</strong>までメールでお問い合わせください。このままチャットを続けていただければ、メッセージをJoseにお伝えすることもできます。</p>',
].join('')

export const TOPICS_HTML = [
  '<p>はじめにお伝えしておくと、私がお答えできるのは次の内容に関するご質問です。</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li>Joseのプロフィールと人物像</li>',
  '<li>学歴</li>',
  '<li>職務経験と学生団体での活動</li>',
  '<li>これまでに手がけたプロジェクト</li>',
  '<li>Joseへの直接の連絡方法</li>',
  '</ul>',
  '<p>それ以外のご質問には、対象外であることをお伝えします。それでは、お名前を教えていただけますか？</p>',
].join('')

export const OFFTOPIC_HTML =
  '<p>申し訳ありません、そのご質問はこちらではお答えできません。私がご案内できるのは、Joseのプロフィール、学歴、職務経験、プロジェクト、連絡方法についてです。よろしければ、これらについてお気軽にお聞きください。</p>'

export const EXPERIENCES = [
  {
    period: '2026年10月〜現在',
    role: 'Full Stack Developer',
    company: 'PT Sistem Pelayanan Kesehatan dan Data（SPKD）、南ジャカルタ（契約）',
    summary:
      '病院の運営データをもとに、クレデンシャリング（医療従事者の資格認証）への準備状況を自動で評価する複数病院向けプラットフォーム「MedCredix」のバックエンドを開発しています。Go（Gin）・GORM・PostgreSQLで44本のREST APIエンドポイントを構築したほか、JWT認証とロールベースのアクセス制御、経営ダッシュボード・リスク登録簿・早期警告のための病院準備度スコアリングエンジン、医療スタッフの資格審査と書類確認のワークフロー、24種類のFHIRリソースによるSIMRS連携、保健省（Kemenkes）の登録データに基づく病院ディレクトリ、インドネシアの地域データ、BPJSの医療機関コード検証、監査ログとレポート機能を実装しました。',
    tags: ['Go', 'Gin', 'PostgreSQL'],
  },
  {
    period: '2025年8月〜2025年9月',
    role: 'Mobile Developer',
    company: 'JEC Eye Hospitals &amp; Clinics向け個人プロジェクト',
    summary:
      'JECを初めて受診する新規患者向けのAndroidアプリ（Flutter・Dart）を一人で一貫して開発しました。要件の調査から、FigmaでのUI設計、Node.jsとExpressによるバックエンド、OCR機能の実装、ユーザビリティテスト（SUSスコア79、「Acceptable/Good」評価）まで担当しました。',
    tags: ['Flutter', 'Dart', 'Figma'],
  },
  {
    period: '2024年7月〜2024年9月',
    role: 'Back End Developer',
    company: 'PT Pos Indonesia本社でのグループプロジェクト',
    summary:
      'PT Pos Indonesiaの専門職人材データを管理するWebアプリ「IHSAN POS」のバックエンド（Node.js・PostgreSQL）を開発しました。この成果は学術誌JUISI（Sinta 5）に掲載されています。',
    tags: ['バックエンド', 'REST API', 'データベース'],
  },
  {
    period: '2023年5月〜2024年4月',
    role: 'System Analyst',
    company: 'Kampus Merdeka「学生起業家育成プログラム」',
    summary:
      'コストの見積もりから支出の記録まで、プロジェクトの予算を管理しました。また、インドネシア教育文化研究技術省（Kemendikbudristek）の助成を受けた中小零細企業（UMKM）向けマーケットプレイスの基盤として、システムモデリング（フローチャート・ERD・UML）を行いました。',
    tags: ['ERD', 'UML', 'Flowchart'],
  },
  {
    period: '2022年10月〜2023年5月',
    role: 'Deputy Human Capital and Governance',
    company: 'デジタルビジネス学生会（HIMABIG）',
    summary:
      '役員の募集と選考を補佐し、組織の目標・スケジュール・予算を策定しました。また、運営委員会（Steering Committee）の一員として総会の準備にも携わりました。',
    tags: ['組織運営', '採用'],
  },
]

export function buildExperienceListHtml() {
  const items = EXPERIENCES.map((item) => {
    const tagsHtml = item.tags
      .map((tag) => `<span class="chat-widget__exp-tag">${tag}</span>`)
      .join('')

    return [
      '<li class="chat-widget__exp-item">',
      '<div class="chat-widget__exp-content">',
      `<p class="chat-widget__exp-period">${item.period}</p>`,
      `<p class="chat-widget__exp-role">${item.role}</p>`,
      `<p class="chat-widget__exp-company">${item.company}</p>`,
      `<p class="chat-widget__exp-summary">${item.summary}</p>`,
      tagsHtml ? `<div class="chat-widget__exp-tags">${tagsHtml}</div>` : '',
      '</div>',
      '</li>',
    ].join('')
  }).join('')

  return `<ol class="chat-widget__exp-list">${items}</ol>`
}

const PROJECT_TEXT = {
  MedCredix: {
    summary:
      'PT SPKDとの契約案件です。複数の病院を対象としたクレデンシャリング準備状況プラットフォームのバックエンド（Go・Gin・PostgreSQL）で、病院の準備度スコアリングエンジン、JWTとRBACによるセキュリティ、医療スタッフの資格審査ワークフロー、FHIRを介したSIMRS連携を備えています。',
  },
  'SIMRS Dashboard': {
    summary:
      'PT SPKDとの契約案件です。病院情報システムのフロントエンド（Next.js・React・TypeScript）で、受付、外来、救急、医師の入院指示（SPRI）に基づく入院手続きから、薬局、会計までをカバーしています。',
  },
  'Dashboard KOL': {
    summary:
      'TikTok ShopのGMVとキャンペーンの成果をリアルタイムで確認できる、5ページ構成のインタラクティブなBIダッシュボード（Streamlit・Plotly）です。Gemini APIによるAIインサイトの自動生成機能も備えています。',
  },
  'Mobile JEC': {
    summary:
      'JEC Eye Hospitals &amp; Clinicsの患者向けモバイルアプリです。FlutterとDart、Node.js/Expressのバックエンドで構築し、身分証（KTP）を自動で読み取るOCR機能や、Googleアカウントでのログイン機能を備えています。',
  },
  'Dashboard JEC': {
    summary:
      '患者データ、予約スケジュール、クリニックの運営を一元管理できる管理者向けダッシュボード（React JS・Node.js/Express）です。Mobile JECと同じデータベースを共有しています。',
  },
  'Secura Kost': {
    summary:
      '下宿（kost）マーケットプレイスのプロトタイプ（React・React Router）です。360°バーチャルツアー、入居者とオーナーの2種類のロールに対応した認証、動的なランディングページを備えています。',
    tags: ['React', 'React Router'],
  },
  'Toko Kelontong Online': {
    summary:
      'ECサイトのプロトタイプ（Vue.js・Pinia・Vue Router）です。動的な商品カタログ、カテゴリーフィルター、リアクティブなショッピングカート、一連の注文フローを実装しています。',
    tags: ['Vue.js', 'Pinia'],
  },
  'Kindle Coffee': {
    summary:
      'コーヒーショップ「Kindle Coffee」のフロントエンドのプロトタイプ（Vue.js・Pinia・Vue Router）です。インタラクティブな座席選択、Midtrans決済のシミュレーション、PDFでのレシート出力に対応しています。',
  },
}

export const PROJECTS = PROJECTS_ID.map((project) => ({
  ...project,
  ...PROJECT_TEXT[project.title],
}))

const JOSE_RX = /jose|ジョセ|ジョゼ|ホセ|ジョーセ/
const ABOUT_JOSE_RX = /jose|ジョセ|ジョゼ|ホセ|ジョーセ|彼(?!女)|かれ(?:は|の|が|って)|この人|このひと|オーナー|作者|管理人|サイトの持ち主|\b(?:him|his|he)\b/

const RX = {
  education:
    /学歴|大学|学校|卒業|専攻|学位|学士|学部|学科|在学|出身校|母校|大学院|学生時代|キャンパス|勉強して|何を勉強|学んだ|学んで|ulbi|\b(?:education|university|college|degree|major|graduat\w*|bachelor\w*|campus)\b/,
  projects:
    /プロジェクト|ぷろじぇくと|作品|制作物|制作実績|実績|作ったもの|作った物|つくったもの|作ったアプリ|作ったサイト|作ったシステム|開発したもの|開発したアプリ|手がけた|手掛けた|ポートフォリオ|成果物|アプリ|デモ|\b(?:projects?|portfolio|works|apps?|demo)\b/,
  contactStrong:
    /依頼|頼みたい|お願いしたい|お願いできますか|案件|採用|雇い|雇う|雇え|求人|スカウト|オファー|一緒に(?:働|仕事)|発注|見積|\b(?:hire|hiring|offer)\b/,
  experience:
    /経験|経歴|職歴|キャリア|職務|勤務|働い|働き|働く|勤め|在籍|インターン|前職|役職|ポジション|担当して|担当した|\b(?:experience|career|internships?)\b/,
  contact:
    /連絡|問い合わせ|問合せ|コンタクト|メール|メアド|電話|ライン|whatsapp|ワッツアップ|料金|費用|報酬|単価|フリーランス|相談したい|ご相談|話したい|話がしたい|面接|\b(?:contact|e-?mail|line|phone)\b/,
  about:
    /自己紹介|どんな人|どういう人|どのような人|どんな方|何者|なにもの|誰|だれ|プロフィール|ぷろふぃーる|人物像|人柄|性格|概要|紹介して|\b(?:about|profile|who\s+is|bio)\b/,
  aboutWithJose: /について|を教えて|知りたい|紹介|聞きたい|とは/,
  question: /\?|か$|何|なに|なん|どう|どこ|いつ|誰|だれ|なぜ|どうして|どんな|どの|教えて|知りたい/,
  link: /リンク|url|デモ|github|ギットハブ|ソースコード|ソース|コード|リポジトリ|レポジトリ|\b(?:links?|repo|demo|code)\b/,

  pekerjaanAmbiguous: /仕事|しごと|ジョブ|\b(?:work|jobs?)\b/,
  pekerjaanHistoryHint:
    /これまで|今まで|いままで|過去|以前|前の|前に|経験|経歴|職歴|履歴|してきた|してきま|やってきた|やってきま|した仕事|していた|してた|前者|一つ目|ひとつ目|1つ目|1番|一番目|最初の|\b(?:history|experience|past|previous|career|first)\b/i,
  pekerjaanOfferHint:
    /依頼|頼み|お願い|オファー|紹介したい|募集|求人|採用|雇|案件|発注|一緒に|協業|コラボ|フリーランス|任せたい|お任せ|\b(?:offer\w*|hire|hiring|recruit\w*|freelance|collaborat\w*)\b/i,

  offtopic:
    /レシピ|料理|天気|天気予報|翻訳|訳して|歌詞|歌って|占い|星座|運勢|宿題|\b(?:recipes?|weather|translate|lyrics|horoscope)\b/,
}

export function matchFaqIntent(rawText) {
  const text = normalizeChat(rawText)
  if (!text) return null
  if (!hasJa(text)) return en.matchFaqIntent(text)

  if (RX.education.test(text)) return { type: 'education' }
  if (RX.projects.test(text)) return { type: 'projects', wantsLink: RX.link.test(text) }
  if (RX.contactStrong.test(text)) return { type: 'contact' }
  if (RX.experience.test(text)) return { type: 'experience' }
  if (RX.contact.test(text)) return { type: 'contact' }
  if (RX.about.test(text)) return { type: 'about' }

  if (JOSE_RX.test(text) && (RX.aboutWithJose.test(text) || RX.question.test(text))) {
    return { type: 'about' }
  }

  if (RX.pekerjaanAmbiguous.test(text)) {
    if (RX.pekerjaanHistoryHint.test(text)) return { type: 'experience' }
    if (RX.pekerjaanOfferHint.test(text)) return { type: 'contact' }
    return { type: 'ambiguous_pekerjaan' }
  }

  if (RX.offtopic.test(text)) return { type: 'offtopic' }

  return null
}

export const PEKERJAAN_CLARIFY_HISTORY_RX = RX.pekerjaanHistoryHint
export const PEKERJAAN_CLARIFY_OFFER_RX =
  /依頼|頼み|お願い|オファー|紹介したい|募集|求人|採用|雇|案件|発注|一緒に|協業|コラボ|フリーランス|任せたい|お任せ|連絡|後者|二つ目|ふたつ目|2つ目|２つ目|2番|２番|二番目|\b(?:offer\w*|hire|hiring|recruit\w*|freelance|collaborat\w*|contact|second|latter)\b/i

const NAME_BODY = "([\\p{sc=Han}々〆ぁ-ゖァ-ヺーa-zA-Z][\\p{sc=Han}々〆ぁ-ゖァ-ヺー・a-zA-Z' .-]{0,20}?)"
const NAME_PREFIX =
  '(?:(?:はい|ええ|えっと|えーと|あ|あの|どうも|では|じゃあ)\\s*)?' +
  '(?:(?:私|わたし|わたくし|僕|ぼく|俺|おれ|自分|うち|あたし|こちら|こっち)(?:の(?:お?名前|なまえ))?(?:は|って)?\\s*|(?:お?名前|なまえ)(?:は|って|:)\\s*)?'
const NAME_SUFFIX =
  '(?:さん)?\\s*(?:です|でーす|だよ|だ|っす|と申します|ともうします|と申す者です|と言います|といいます|っていいます|って言います|っていう名前です|という名前です|でございます)(?:よ|ね|!)*'

const NAME_PATTERNS = [
  new RegExp(`^${NAME_PREFIX}${NAME_BODY}${NAME_SUFFIX}$`, 'u'),
  new RegExp(
    `^(?:(?:私|わたし|わたくし|僕|ぼく|俺|おれ|自分|あたし)の)?(?:お?名前|なまえ)(?:は|って|:)\\s*${NAME_BODY}(?:さん)?$`,
    'u',
  ),
  new RegExp(`^(?:私|わたし|わたくし|僕|ぼく|俺|おれ|あたし)は\\s*${NAME_BODY}(?:さん)?$`, 'u'),
  new RegExp(`^${NAME_BODY}\\s*(?:と|って)呼んで(?:ください|下さい|くれ|ね|ほしい|欲しい)?$`, 'u'),
]

const JA_NOT_A_NAME = new Set(
  `
  そう そうそう 大丈夫 だいじょうぶ 結構 けっこう いい よい 良い はい いいえ うん ええ いや
  学生 大学生 高校生 中学生 院生 社会人 会社員 公務員 エンジニア デザイナー プログラマー 開発者 経営者 社長
  採用担当 採用担当者 人事 人事担当 リクルーター 担当者 フリーランス 個人事業主 無職 主婦 新卒
  初めて はじめて 元気 げんき 暇 ひま 日本人 インドネシア人 外国人 日本 インドネシア 東京 大阪
  ここ そこ あそこ どこ 誰 だれ 何 なに なん 本当 ほんと 本気 了解 問題 無理 以上 それ これ あれ
  私 わたし わたくし 僕 ぼく 俺 おれ 自分 あなた 君 きみ ボット ロボット 人間 名前 なまえ
  匿名 秘密 内緒 ないしょ 不明 未定 なし 無し 特に 普通 ふつう 同じ 本人 客 お客 ゲスト ユーザー
  見学 質問 相談 依頼 よろしく 失礼 ありがとう すみません ごめん 眠い ねむい 楽しい 嬉しい うれしい
  好き 嫌い 忙しい いそがしい 疲れ 疲れた 最高 最悪 微妙 偶然 たまたま ファン 友達 友人 同僚
  ジョセ ホセ ジョゼ テスト てすと 以上です 冗談 嘘 うそ 怪しい者 怪しいもの 通りすがり
  なるほど へー ふーん えっと あの うーん まあ ちょっと たぶん 多分 もちろん ぜひ べつに 別に なんでも
  おまかせ お任せ すごい かっこいい かわいい おもしろい 面白い やばい まじ マジ ほんとう そっか
  `
    .split(/\s+/)
    .filter(Boolean),
)

const JA_INFLECTED_RX = /(?:ます|です|ました|でした|ない|たい|ください|だよ|よね|かな|けど|から|ので|った|って|しい|てる|でる)$/

function isLikelyJaName(word) {
  const w = (word || '').trim()
  if (!w || JA_NOT_A_NAME.has(w) || JA_NOT_A_NAME.has(w.toLowerCase())) return false
  if (/^[a-zA-Z][a-zA-Z'.-]*$/.test(w)) {
    return w.toLowerCase() !== 'jose' && !!en.extractPlainName(w)
  }
  const han = /^[\p{sc=Han}々〆]{1,6}$/u.test(w)
  const hira = /^[ぁ-ゖー]{2,8}$/.test(w) && !JA_INFLECTED_RX.test(w)
  const kata = /^[ァ-ヺー・]{2,12}$/.test(w) && !/^ー/.test(w)
  const hanHira = /^[\p{sc=Han}々]{1,4}[ぁ-ゖ]{2,4}$/u.test(w) && !/(?:い|く|う|る|た|て|しい|ない|ます|です)$/.test(w)
  if (!han && !hira && !kata && !hanHira) return false
  if (matchFaqIntent(w) || TECHS.some((t) => t.rx.test(w.toLowerCase())) || findProjectMentions(w).length) return false
  if (/[何誰]|なに|だれ|どこ|いつ/.test(w)) return false
  if (matchSmallTalk(w) || YES_RX.test(w) || NO_RX.test(w) || matchConversation(w)) return false
  return true
}

const cleanName = (name) => {
  const first = name.trim().replace(/(?:さん|くん|ちゃん|様|さま)$/, '').split(/\s+/)[0]
  return /^[a-zA-Z]/.test(first) ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : first
}

export function matchNameStatement(rawText) {
  const text = baseNorm(rawText).trim()
  if (!text) return null
  if (!hasJa(text)) return en.matchNameStatement(text)

  const sentences = text
    .replace(/(は|って|:)[、,\s]+/g, '$1')
    .split(/[。、,!?\n]+/)
    .map((s) => s.trim().replace(/[〜~ー]+$/, ''))
    .filter(Boolean)

  for (const sentence of sentences) {
    for (const rx of NAME_PATTERNS) {
      const match = sentence.match(rx)
      if (!match) continue
      const candidate = match[1].trim().replace(/(?:さん|くん|ちゃん|様|さま)$/, '')
      const parts = candidate.split(/\s+/).filter(Boolean)
      if (parts.length > 3 || !parts.every(isLikelyJaName)) continue
      return { name: cleanName(candidate) }
    }
  }
  return null
}

export function extractPlainName(rawText) {
  const text = baseNorm(rawText).trim()
  if (!text || /^w{2,}[\s!.]*$/i.test(text)) return null
  if (!hasJa(text)) return en.extractPlainName(text)
  const cleaned = text.replace(/[。.!〜~]+$/g, '').replace(/(?:さん|くん|ちゃん|様|さま)$/, '').trim()
  if (/[?、,]/.test(cleaned)) return null
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length === 0 || words.length > 3) return null
  if (!words.every(isLikelyJaName)) return null
  return cleanName(cleaned)
}

export const TIME_GREETINGS = ['おはようございます', 'こんにちは', 'こんばんは']

export function getTimeOfDay(date = new Date()) {
  const h = date.getHours()
  if (h >= 4 && h < 11) return 'おはようございます'
  if (h >= 11 && h < 18) return 'こんにちは'
  return 'こんばんは'
}

const GREETING_CORE =
  'こんにちは|こんにちわ|こんちは|こんちわ|ちわっす|こんばんは|こんばんわ|ばんわ|おはようございます|おはよう|おはよ|おっはー|はじめまして|初めまして|やあ|やぁ|どうも|ハロー|はろー|ハロ|もしもし|ヤッホー|やっほー|hello+|hi+|hey+|yo|good\\s+(?:morning|afternoon|evening)'
const GREETING_FILLER = 'jose|ジョセ|ホセ|さん|皆さん|みなさん|です|でーす|ございます|bot|ボット'

const SMALL_TALK = {
  greeting: sweepRx(GREETING_CORE, GREETING_FILLER),
  greetingPrefix:
    /^(?:こんにちは|こんにちわ|こんちは|こんばんは|こんばんわ|おはようございます|おはよう|はじめまして|初めまして|やあ|どうも(?!ありがと|有難)|ハロー|もしもし|hello+|hi+|hey+)(?![a-z])[\s、,!。.〜~ー]*/i,
  howAreYou:
    /お元気|元気(?:です|でした)?か|元気\?|げんき\?|げんきですか|調子(?:は|が)?(?:どう|いかが)|ご機嫌いかが|最近どう|how\s+are\s+you/i,
  thanks: sweepRx(
    'ありがと[うー]?(?:ございます|ございました|ございまーす)?|有難う(?:ございます|ございました)?|あざす|あざっす|あざーす|サンキュー|さんきゅー|サンクス|感謝(?:します|しています|です|いたします)?|助かりました|助かります|助かる|助かった|thanks|thank\\s+you|thx|ty',
    'どうも|本当に|ほんとに|ほんとうに|とても|すごく|色々|いろいろ|大変|たいへん|ね|です|よ|jose|ジョセ|さん|お世話になりました|教えてくれて|教えていただき|丁寧に|ご丁寧に|ご親切に',
  ),
  bye: sweepRx(
    'さようなら|さよなら|またね|またな|また今度|また来ます|またきます|また来るね|またあとで|また後で|じゃあね|じゃあまた|じゃね|じゃまた|バイバイ|ばいばい|バイ|失礼します|失礼いたします|失礼しました|お疲れ様でした|お疲れさまでした|おつかれさま|おつかれ|bye|goodbye|see\\s+you|cya',
    'では|じゃあ|それでは|それじゃ|ありがとう|ありがとうございました|ね|よ|さん|jose|ジョセ|また|ー',
  ),
  ack: sweepRx(
    'ok|okay|おk|おけ|おっけー|オッケー|オーケー|了解(?:です|しました)?|りょうかい|りょ|承知(?:しました|いたしました)|かしこまりました|わかりました|分かりました|わかった|分かった|なるほど|そうなんだ|そうなんですね|そうなんですか|へー|へえ|ふーん|ふむふむ|いいね|いいですね|ほう|納得',
    'ね|です|よ|ありがとう|ありがとうございます',
  ),
  aboutBot:
    /(?:あなた|貴方|君|きみ|お前|おまえ)(?:は|って)?(?:誰|だれ|何者|なにもの|なに|何|ボット|ロボット|ai|人間|本物)|(?:ボット|bot|ロボット|ai|人工知能|人間)(?:です|なの|なん)(?:か|\?|ですか)|(?:誰|だれ)と(?:話して|しゃべって|チャットして)/i,
}

export function matchSmallTalk(rawText) {
  const text = baseNorm(rawText).trim().toLowerCase()
  if (!text) return null
  if (!hasJa(text)) return en.matchSmallTalk(text)
  if (SMALL_TALK.aboutBot.test(text)) return { type: 'aboutBot' }
  if (SMALL_TALK.howAreYou.test(text)) return { type: 'howAreYou' }
  if (SMALL_TALK.greeting.test(text)) return { type: 'greeting' }
  if (SMALL_TALK.thanks.test(text)) return { type: 'thanks' }
  if (SMALL_TALK.bye.test(text)) return { type: 'bye' }
  if (SMALL_TALK.ack.test(text)) return { type: 'ack' }
  return null
}

export function stripGreetingPrefix(rawText) {
  let text = baseNorm(rawText).trim()
  if (!hasJa(text)) return en.stripGreetingPrefix(text)
  let prev
  do {
    prev = text
    text = text.replace(SMALL_TALK.greetingPrefix, '')
    if (text !== prev) text = text.replace(/^(?:jose|ジョセ|ホセ)(?:さん|様)?(?:[\s、,!。.〜~]+|$)/i, '')
  } while (text && text !== prev)
  return text.trim()
}

export function hasGreetingPrefix(rawText) {
  const text = baseNorm(rawText).trim()
  if (!hasJa(text)) return en.hasGreetingPrefix(text)
  return SMALL_TALK.greetingPrefix.test(text)
}

const JA_QUESTION_RX =
  /\?|(?:か|かな|かしら|かね|でしょうか|ますか|ですか|の)$|何|なに|なん(?:で|の|て|と)|どう|どこ|いつ|誰|だれ|なぜ|どうして|どんな|どの|どれ|いくら|教えて|知りたい|聞きたい|見せて/

export function looksLikeQuestion(rawText) {
  const text = baseNorm(rawText).trim()
  if (!hasJa(text)) return en.looksLikeQuestion(text)
  return JA_QUESTION_RX.test(text.replace(/[。!、\s〜~]+$/, ''))
}

export function getUserTimeGreeting(rawText) {
  const text = baseNorm(rawText).trim().toLowerCase()
  if (/おはよう|おはよ|おっはー|good\s+morning|^morning\b/.test(text)) return 'おはようございます'
  if (/こんばんは|こんばんわ|ばんわ|good\s+evening|^evening\b/.test(text)) return 'こんばんは'
  if (/こんにちは|こんにちわ|こんちは|こんちわ|good\s+afternoon|^afternoon\b/.test(text)) return 'こんにちは'
  return null
}

const MESSAGE_INTENT_RX =
  /依頼|お願いしたい|お願いできますか|お願いできれば|ご相談|相談したい|相談させて|案件|発注|見積|予算|費用|料金|報酬|単価|採用|雇|求人|スカウト|面接|オファー|フリーランス|協業|コラボ|一緒に(?:仕事|働|開発)|参加して|ご招待|招待|ご提案|提案|空いて|対応可能|作って(?:ほしい|欲しい|いただけ|もらえ|くれ)|開発して(?:ほしい|欲しい|いただけ|もらえ|くれ)|\b(?:offer|offering|freelance|hire|hiring|recruit\w*|interview|collaborat\w*|budget|quote|proposal|opportunit\w*)\b/i

export function looksLikeMessageToJose(rawText) {
  const text = baseNorm(rawText).trim()
  if (!hasJa(text)) return en.looksLikeMessageToJose(text)
  const jaChars = (text.match(/[぀-ヿ㐀-鿿豈-﫿々]/g) || []).length
  return jaChars >= 30 || approxWords(text) >= 12 || MESSAGE_INTENT_RX.test(text)
}

export const DECLINE_RX =
  /^(?:いいえ|いや|いえ|いいや|ううん|no|nope|nah)(?:[\s、,。!]|$)|^(?:後で|あとで|また今度|今はいい|今はちょっと|スキップ|パス)|(?:教え|言い|名乗り|書き|伝え|出し|渡し)たくない|(?:名前|なまえ|メール|メアド|アドレス)(?:は|を)?(?:ちょっと|秘密|ひみつ|内緒|ないしょ|言えな|教えられな|いいです|結構|なし|無し|ない|ありません|持って)|名乗るほど|秘密|ないしょ|内緒|匿名|やめておきます|やめとく|遠慮(?:します|しておきます|させて)|結構です|けっこうです|見てるだけ|見ているだけ|見に来ただけ|聞きたいだけ|質問だけ|先に質問|まず質問|ほかの話|他の話|別の話|話題を変え|\b(?:no\s+thanks|not\s+now|maybe\s+later|skip|rather\s+not|anonymous|just\s+(?:browsing|looking|asking))\b/i

export const RESUME_CONTACT_RX =
  /メッセージ(?:を)?(?:送|残|書|伝え|届け)|伝言|連絡(?:したい|を取りたい|をとりたい|します|させて)|コンタクト(?:したい|を取りたい)|問い合わせ(?:したい|します)|続けます|続けたい|続きを|再開|メール(?:アドレス)?を(?:教え|伝え|送り|お伝え)|メアドを|やっぱり(?:送|連絡|お願い)|\b(?:send\s+(?:him\s+)?(?:a\s+)?message|leave\s+(?:him\s+)?(?:a\s+)?message|contact\s+(?:him|jose)|continue|go\s+ahead)\b/i

export const PICK_ANY_RX =
  /^(?:何でも|なんでも|お任せ|おまかせ|任せ|まかせ|わからない|分からない|わかんない|分かんない|特にない|特になし|どれでも|どっちでも|どちらでも|適当に|別に|ほかの|他の|anything|whatever|up\s+to\s+you|you\s+choose|not\s+sure|i\s+don'?t\s+know|dunno)/i

export const TOPICS_MENU_HTML = [
  '<p>次のような内容をご案内できます。</p>',
  '<ul class="chat-widget__highlight-list">',
  '<li>Joseのプロフィール</li>',
  '<li>学歴</li>',
  '<li>職務経験と学生団体での活動</li>',
  '<li>これまでに手がけたプロジェクト</li>',
  '<li>Joseへの連絡方法</li>',
  '</ul>',
  '<p>「Joseはどんなプロジェクトを手がけましたか？」のように、気軽に質問を入力してください。あとでJoseにメッセージを送りたくなったら、「メッセージを送りたい」と入力してください。</p>',
].join('')

export function normalizeChat(rawText) {
  const text = baseNorm(rawText)
  if (!hasJa(text)) return en.normalizeChat(text)
  return text
    .toLowerCase()
    .replace(/([a-z])\1{2,}/g, '$1$1')
    .replace(/[〜~]+/g, ' ')
    .replace(/ー{2,}/g, 'ー')
    .replace(/[^\p{L}\p{N}@.?\s+#'-]/gu, ' ')
    .replace(/([^\x00-\x7f])\s+/g, '$1')
    .replace(/\s+(?=[^\x00-\x7f])/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s.]+$/, '')
    .trim()
}

const lastVariant = {}
export function pickVariant(key, list) {
  if (list.length === 1) return list[0]
  let index
  do {
    index = Math.floor(Math.random() * list.length)
  } while (index === lastVariant[key])
  lastVariant[key] = index
  return list[index]
}

const YES_CORE =
  'はい|はーい|うん|うむ|ええ|そう(?:です|だよ|そう|ですね)?|お願い(?:します|いたします|したいです)?|おねがい(?:します)?|よろしく(?:お願いします)?|ぜひ(?:とも)?|是非|もちろん|いいよ|いいね|いいです(?:よ|ね)|いいですとも|ok|okay|オッケー|おっけー|オーケー|了解|見たい(?:です)?|見せて(?:ください)?|見ます|見る|教えて(?:ください)?|知りたい(?:です)?|聞きたい(?:です)?|頼む|頼みます|もっと|続けて|大丈夫(?:です)?(?=.*(?:お願い|見せ|教え|ください|見たい|知りたい))|yes+|yeah|yep|yup|ya|sure|please|of\\s+course'
const YES_FILLER = 'ください|です|ね|よ|ありがとう(?:ございます)?|ぜひ|もちろん|jose'
export const YES_RX = new RegExp(
  `^(?:${YES_CORE})(?:${SEP}(?:${YES_CORE}|${YES_FILLER}))*${SEP}$|${en.YES_RX.source}`,
  'i',
)

const NO_CORE =
  'いいえ|いや|いえ|いいや|ううん|結構(?:です)?|けっこう(?:です)?|大丈夫(?:です)?|だいじょうぶ(?:です)?|いらない(?:です)?|要らない(?:です)?|いりません|不要(?:です)?|やめて|やめとく|やめておきます|やめます|遠慮(?:します|しておきます)|また今度|またあとで|また後で|後で|あとで|今はいい(?:です)?|今はいいかな|いいです(?![よね])|今度で|大丈夫かな|no+|nope|nah|not\\s+now|later|skip'
const NO_FILLER = 'です|ね|よ|ありがとう(?:ございます)?|すみません|ごめんなさい|今は|今回は|また|ちょっと|jose|お気遣い'
export const NO_RX = new RegExp(
  `^(?:${NO_CORE})(?:${SEP}(?:${NO_CORE}|${NO_FILLER}))*${SEP}$|${en.NO_RX.source}`,
  'i',
)

export const ABOUT_SHORT_HTML =
  '<p>簡単にご紹介すると、<strong>Jose Elio Parhusip</strong>はULBI（バンドン）でデジタルビジネスを学んだ卒業生で、現在は契約のFull Stack DeveloperとしてPT SPKDの開発に携わっています。Webアプリやモバイルアプリ、データダッシュボードの開発を得意としています。</p>'

const TECHS = [
  { name: 'Flutter', rx: /flutter|フラッター/ },
  { name: 'Dart', rx: /\bdart\b|ダート/ },
  { name: 'React', rx: /react|リアクト/ },
  { name: 'Vue.js', rx: /vue|ヴュー|ビュー(?:js|\.js|ジェイエス|\s*(?:は|が|を|も|って|の経験|使|でき|触))/ },
  { name: 'Node.js', rx: /\bnode(?:\s*js|\.js)?\b|ノード(?:js|\.js|ジェイエス)?/ },
  { name: 'Express', rx: /\bexpress(?:\s*js|\.js)?\b|エクスプレス/ },
  { name: 'Go', rx: /golang|go\s*言語|ゴー?言語|ゴーラング|(?<![a-z])go(?![a-z])/ },
  { name: 'Gin', rx: /\bgin\b/ },
  { name: 'PHP', rx: /\bphp\b/ },
  { name: 'Python', rx: /python|パイソン/ },
  { name: 'Streamlit', rx: /streamlit|ストリームリット/ },
  { name: 'Plotly', rx: /plotly|プロットリー/ },
  { name: 'Power BI', rx: /power\s*bi\b|パワー\s*bi|パワービーアイ/ },
  { name: 'Excel', rx: /\bexcel\b|エクセル/ },
  { name: 'Google Colab', rx: /colab|グーグルコラボ/ },
  { name: 'PostgreSQL', rx: /postgre|ポスグレ|ポストグレ/ },
  { name: 'MySQL', rx: /mysql|マイsql|マイエスキューエル/ },
  { name: 'Figma', rx: /figma|フィグマ/ },
  { name: 'Tailwind CSS', rx: /tailwind|テイルウィンド|テールウィンド/ },
  { name: 'Next.js', rx: /\bnext\s*\.?\s*js\b|\bnextjs\b|ネクスト(?:js|\.js|ジェイエス)/ },
  { name: 'TypeScript', rx: /typescript|タイプスクリプト|\bts\b/ },
  { name: 'JavaScript', rx: /javascript|ジャバスクリプト|\bjs\b/ },
  { name: 'Docker', rx: /docker|ドッカー/ },
  { name: 'Git', rx: /\bgit\b|ギット(?!ハブ)/ },
  { name: 'Postman', rx: /postman|ポストマン/ },
  { name: 'Swagger', rx: /swagger|スワッガー/ },
  { name: 'Pandas', rx: /\bpandas\b|パンダス/ },
  { name: 'GORM', rx: /\bgorm\b/ },
  { name: 'JWT', rx: /\bjwt\b/ },
  { name: 'Pinia', rx: /pinia|ピニア/ },
  { name: 'Midtrans', rx: /midtrans/ },
  { name: 'Gemini API', rx: /gemini|ジェミニ/ },
  { name: 'SAP', rx: /\bsap\b/ },
  { name: 'UML', rx: /\buml\b/ },
  { name: 'ERD', rx: /\berd\b/ },
  { name: 'REST API', rx: /\brest(?:ful)?\s*apis?\b|rest\s*api|レスト\s*api/ },
  { name: 'OCR', rx: /\bocr\b/ },
]

const UNKNOWN_TECHS = [
  ['Laravel', /laravel|ララベル/],
  ['Java', /(?<![a-z])java(?!script)(?![a-z])|ジャバ(?!スクリプト)|ジャヴァ/],
  ['Kotlin', /kotlin|コトリン/],
  ['Swift', /\bswift\b|スウィフト|スイフト/],
  ['Django', /django|ジャンゴ/],
  ['Flask', /\bflask\b|フラスク/],
  ['Angular', /angular|アンギュラー?/],
  ['Svelte', /svelte|スベルト|スヴェルト/],
  ['Nuxt', /\bnuxt|ナクスト/],
  ['Kubernetes', /kubernetes|\bk8s\b|クバネティス|クーベネティス/],
  ['AWS', /\baws\b/],
  ['Azure', /azure|アジュール/],
  ['GCP', /\bgcp\b/],
  ['MongoDB', /mongo|モンゴ/],
  ['Firebase', /firebase|ファイアベース|ファイヤーベース/],
  ['Ruby', /\bruby\b|ルビー/],
  ['Rust', /\brust\b/],
  ['Unity', /\bunity\b|ユニティ/],
  ['WordPress', /wordpress|ワードプレス/],
  ['Spring', /\bspring\b|スプリング/],
  ['.NET', /\.net\b|dotnet|ドットネット/],
  ['C++', /c\+\+/],
  ['C#', /c#|cシャープ/],
]

const stripHtml = (html) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')

function joinList(items) {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]}と${items[1]}`
  return items.join('、')
}

export function findTechEvidence(tech) {
  const rx = new RegExp(tech.rx.source, 'i')
  const name = (tech.name || '').toLowerCase()
  const uses = (item) =>
    item.tags.some((tag) => tag.toLowerCase() === name) ||
    rx.test(`${item.tags.join(' ')} ${stripHtml(item.summary)}`.normalize('NFKC').toLowerCase())
  return { projects: PROJECTS.filter(uses), roles: EXPERIENCES.filter(uses) }
}

const PROJECT_ALIASES = [
  { title: 'MedCredix', rx: /med\s*credix|メドクレディックス|クレデンシャリング/ },
  { title: 'SIMRS Dashboard', rx: /simrs|病院情報システム|電子カルテ/ },
  { title: 'Dashboard KOL', rx: /dashboard\s*kol|kol\s*dashboard|\bkol\b|savvy|tiktok|ティックトック|ティックトック/ },
  {
    title: 'Mobile JEC',
    rx: /(?:mobile|app|モバイル|アプリ)\s*jec|jec\s*(?:の)?\s*(?:mobile|app|モバイル|アプリ)|眼科(?:の)?アプリ/,
  },
  {
    title: 'Dashboard JEC',
    rx: /(?:dashboard|admin|ダッシュボード|管理画面)\s*jec|jec\s*(?:の)?\s*(?:dashboard|admin|ダッシュボード|管理画面)/,
  },
  { title: 'Secura Kost', rx: /secura|セキュラ|\bkost\b|下宿/ },
  { title: 'Toko Kelontong Online', rx: /kelontong|クロントン|食料品店|雑貨店|グロッサリー|ネットスーパー/ },
  { title: 'Kindle Coffee', rx: /kindle|キンドル|コーヒー|カフェ/ },
]

export function findProjectMentions(norm) {
  const text = (norm || '').toLowerCase()
  const found = PROJECT_ALIASES.filter((a) => a.rx.test(text)).map((a) => a.title)
  if (!found.length && /jec/.test(text)) found.push('Mobile JEC', 'Dashboard JEC')
  return PROJECTS.filter((p) => found.includes(p.title))
}

const YOU = '(?:あなた|貴方|君|きみ|お前|おまえ|ボット|bot|チャットボット)'

const CONVO = {
  rude:
    /バカ|ばか|馬鹿|アホ|あほ|クソ|くそ|糞|死ね|しね|うざい|ウザい|ウザ|きもい|キモい|キモ|黙れ|だまれ|役立たず|使えないボット|役に立たない|ポンコツ|\b(?:stupid|idiot|dumb|shut\s+up|fuck\w*|shit\w*)\b/,
  laugh: /^(?:w{1,}|笑+|草+|わら|ワロタ|(?:は)+|(?:ハ)+|あはは+|(?:へ)+|(?:ふ)+|lol+|xd)[\s!.?]*$/,
  compliment:
    /すごい|凄い|スゴい|すげ|素晴らしい|すばらしい|素敵|すてき|ステキ|かっこいい|カッコいい|格好いい|かっこよ|おしゃれ|お洒落|オシャレ|きれい|綺麗|見やすい|使いやすい|いいね|いいですね|最高|さすが|流石|天才|感動|よくできて|良くできて|よく出来て|レベル高|クオリティ高|クオリティが高|センスいい|センスが良|\b(?:awesome|amazing|impressive|cool|great|nice)\b/,
  complimentRequest: /見せて|教えて|知りたい|ください|ますか|ですか|\?/,
  meet: /よろしく|宜しく|はじめまして|初めまして|知り合いになりたい|仲良く|お近づき/,
  askBotName: new RegExp(
    `${YOU}の(?:お)?名前|お名前は(?:\\?|$|何|なん)|名前は(?:何|なん|\\?)|名前を教えて|(?:何|なん)て呼べば|なんと呼べば|何と呼べば|名前(?:は)?ある`,
  ),
  botCapabilities: /何ができ|なにができ|何が出来|何を聞け|何が聞け|何を質問|何について(?:聞け|質問|答え)|何を答え|何がわかる|何が分かる|何を知って|どんなことが(?:でき|聞け|わか)|どんな質問|使い方|ヘルプ|^help$|^メニュー|^menu$|^トピック|何を聞いたら/,
  askHuman:
    /(?:jose|ジョセ|ホセ)(?:さん)?本人|本人ですか|本人と(?:話|連絡)|本物の(?:jose|ジョセ|人)|人間と(?:話|チャット)|人と話し|担当者と話|オペレーター|有人|(?:jose|ジョセ|ホセ)(?:さん)?と(?:直接)?(?:話|チャット)(?:した|でき|せ)/,
  personal:
    /年齢|何歳|なんさい|誕生日|生年月日|彼女|恋人|結婚|既婚|独身|奥さん|お嫁|宗教|給料|給与|年収|月収|身長|体重|付き合って(?:る|いる)|何年生まれ/,
  gpa: /gpa|ipk|成績|評定|首席|優等|学業成績/,
  cert: /資格|免許|認定|修了証|証明書|サーティフィケート|toefl|toeic|講座|研修|ブートキャンプ|オンラインコース|\bcertificat\w*/,
  cv: /履歴書|職務経歴書|\bcv\b|\bresume\b|レジュメ/,
  currentJob:
    /(?:今(?!まで|日)|現在|最近|現職)[^]*?(?:仕事|働|勤め|勤務|所属|職|何をして|なにして|何して|やって)|どこで働いて(?:い|る|ます)|どこに(?:勤めて|勤務)|勤務先|所属先|職業|何の仕事をして(?:い|る|ます)|どこの会社/,
  currentJobPast: /いました|いた$|ていた|てた|ました|これまで|以前|過去/,
  currentJobNow: /今(?!まで)|現在|最近|現職/,
  location:
    /どこに住|どこ住み|住んで|住まい|在住|拠点|所在地|出身|どこの人|どこから来|どこにいる|どこにいま|地元|どこの国|何県|どの街|どの都市|どこの都市|どこで暮ら/,
  availability:
    /仕事を探して|求職|転職活動|就職活動|就活|募集中|手が空|空いて|空き(?:状況|は|が)|対応可能|対応できます|受けて(?:い|ます|る|くれ)|受け付けて|受付中|引き受け|採用可能|雇える|雇うこと|案件を(?:受|募)|稼働|仕事(?:は)?募集|オープン(?!ソース)|\b(?:open\s+to\s+work|available|availability)\b/,
  social: /github|ギットハブ|linkedin|リンクトイン|リンクドイン|インスタ|instagram|\bsns\b|ツイッター|twitter|ソーシャル/,
  skills:
    /スキル|技術|ぎじゅつ|ツール|言語|できること|出来ること|使える|得意|専門|強み|スタック|テック|使用技術|プログラミング|\b(?:skills?|tools|tech\s*stack|stack)\b/,
  skillQuestion:
    /できます|出来ます|できる|出来る|でき\?|使え|使っ|使う|つかえ|つかっ|つかう|使用|扱え|あつかえ|書け|書ける|経験|触っ|触れ|分かる|わかる|得意|知って|詳しい|スキル|実務|やったこと|やってた|\?|か$/,

  botActivity: /何してる|なにしてる|何をして(?:い|る)|何してるの|忙しい|いそがしい/,
  botEat: /ご飯(?:は)?食べ|ごはん(?:は)?食べ|食べた\?|食べましたか|お腹(?:すい|空い)|おなか(?:すい|空い)|寝(?:る|ない|ます)の|寝てる|眠らない|食事/,
  botGender: /性別|男の子|女の子|男性|女性|男なの|女なの|男ですか|女ですか/,
  botHome: new RegExp(
    `${YOU}[^]*(?:どこに住|どこ住み|どこから|どこにいる|どこにいま|出身|住んで)`,
  ),
  botMaker:
    /(?:誰|だれ)が(?:作|つく|開発|制作|作成)|(?:誰|だれ)に(?:作|つく)られ|作ったのは(?:誰|だれ)|開発者は|作者は(?:誰|だれ)|製作者|制作者|作成者|どうやって作られ|どうやってできて/,
  mood: /疲れ|つかれ|眠い|ねむい|退屈|暇|ひま|悲しい|かなしい|つらい|辛い|しんどい|ストレス|イライラ|いらいら|寂しい|さみしい|さびしい|頭痛|頭が痛|落ち込|最悪|だるい|ダルい/,
  happy:
    /^(?:今日は|今|とても|すごく|めっちゃ|超)?(?:嬉しい|うれしい|楽しい|たのしい|幸せ|しあわせ|元気|げんき|最高の気分|ワクワク|わくわく|ハッピー)(?:です|だよ|よ|でーす)?[\s!.]*$/,
  testMsg: /^(?:test|testing|tes|テスト|てすと|check|ping|チェック)(?:\s*\d+)*[\s!.?]*$/,
  goodnight: /おやすみ|お休みなさい|もう寝(?:る|ます)|寝ますね|寝るね|寝ます$/,

  timeNow: /今何時|いま何時|今なんじ|いまなんじ|何時ですか|何時\?|なんじ\?|現在時刻|今の時間|今の時刻|時刻を教えて|時間を教えて/,
  dateNow: /今日は何日|何日ですか|今日の日付|日付|何曜日|なんようび|今日は何月|今何月|今年は何年|今は何年|何年ですか$|今日は何の日/,

  botAge: new RegExp(`${YOU}[^]*(?:何歳|なんさい|年齢|いくつ|いつ(?:生まれ|作られ))|いつ作られた`),
  botLanguage:
    /(?:日本語|英語|インドネシア語|何語|ほかの言語|他の言語|中国語|韓国語)[^]*(?:話せ|しゃべれ|喋れ|わかる|分かる|使え|できる|対応|ok|大丈夫|でいい|でも)/,
  botLikes: new RegExp(`${YOU}[^]*(?:好き|趣味)|趣味は|好きな(?:もの|食べ物|色|こと|音楽)は`),
  apology:
    /^(?:すみません|すいません|ごめん|ごめんなさい|ごめんね|失礼しました|申し訳(?:ない|ありません|ございません))(?:でした)?(?:[\s!.]*(?:間違え(?:ました|た)|打ち間違い|まちがえた))?[\s!.]*$/,
  askPermission:
    /^(?:すみません|すいません|あの)?\s*(?:質問(?:があります|があるんですが|があるのですが|してもいい(?:ですか)?|していい(?:ですか)?|いいですか|できますか|ある)|(?:聞いて|お聞きして|伺って)(?:も)?(?:いい|よろしい)(?:ですか|でしょうか)?|聞きたいことが(?:あります|ある|あるんですが)|ちょっといい(?:ですか)?|ちょっと質問)\??$/,
}

const GUARD = {
  inappropriate:
    /エロ|えろ|セックス|せっくす|アダルト|ヌード|裸の|風俗|ポルノ|ギャンブル|カジノ|賭博|麻薬|大麻|覚醒剤|\b(?:porn\w*|sex|sexy|nsfw|xxx)\b/,
  moneyRequest:
    /お金(?:を)?(?:貸して|かして|ちょうだい|ください|下さい|ほしい|欲しい|送って|振り込んで|恵んで)|金(?:を)?貸して|借金させて|寄付して|送金して|おごって|奢って/,
  illegal:
    /ハッキング|ハック(?!ション|アソン)|クラック|フィッシング|ddos|乗っ取|不正アクセス|パスワード(?:を)?(?:教えて|盗|破|解析)|盗む|盗んで|盗み方|海賊版|マルウェア|ウイルスを作|ランサムウェア|スパム|キーロガー|\bhack(?!athon)\w*/,
  flirt: new RegExp(
    `^(?:${YOU}(?:が|のこと)?)?(?:好き|大好き)(?:です)?[\\s!.]*$|愛してる|あいしてる|愛しています|付き合って(?:ください|ほしい|下さい)|結婚して(?:ください|ほしい)|デート(?:しよう|して|しませんか)|${YOU}(?:は|って)?(?:かわいい|可愛い|イケメン|かっこいい|美人)|会いたい|キスして`,
  ),
  homework:
    /(?:宿題|課題|レポート|卒論|卒業論文|論文|作文|試験|テスト問題)[^]*(?:やって|手伝って|書いて|解いて|代わりに|お願い|作って)|(?:コード|プログラム|スクリプト|関数)(?:を)?(?:書いて|作って|生成して)|バグ(?:を)?(?:直して|修正して)|デバッグして/,
}

const OFFTOPIC_TOPICS = [
  ['政治', /政治|選挙|首相|総理|大統領|政府|国会|政党|議員/],
  ['ニュースや芸能ゴシップ', /ニュース|ゴシップ|芸能|有名人|スキャンダル/],
  ['スポーツ', /サッカー|野球|バスケ|テニス|バドミントン|ワールドカップ|オリンピック|\bf1\b|\bnba\b|相撲|ゴルフ|ラグビー/],
  ['ゲーム', /ゲーム|げーむ|マイクラ|マインクラフト|ポケモン|フォートナイト|原神|ロブロックス|valorant|ヴァロラント|モバレ|モバイルレジェンド/],
  ['映画やエンタメ', /映画|ドラマ|アニメ|漫画|マンガ|音楽|歌手|ライブ|コンサート|netflix|ネトフリ|k-?pop|アイドル|歌詞|歌って/],
  ['お金や投資', /株価|株(?!式)|仮想通貨|暗号資産|ビットコイン|投資|\bfx\b|為替|金価格|トレード/],
  ['健康', /薬を|熱が|風邪|ダイエット|症状|病気|咳|インフルエンザ|ビタミン|体調/],
  ['料理', /レシピ|料理|献立|晩ごはん|晩御飯|夕飯|レストラン|お菓子|(?:ケーキ|カレー|パン)の作り方/],
  ['天気', /天気|気温|台風|地震|洪水|雨が|雪が/],
  ['占い', /占い|星座|運勢|タロット|おみくじ|血液型/],
  ['学校の勉強', /数学|物理|化学|生物|方程式|計算して|解いて|試験問題/],
  ['翻訳', /翻訳|訳して|英訳|和訳|どういう意味/],
  ['宗教', /宗教|神様|お祈り|聖書|コーラン|お経/],
  ['旅行', /旅行|観光|ホテル|航空券|フライト|休暇|おすすめの場所/],
  ['ショッピング', /買い物|ショッピング|セール|クーポン|割引|amazon|アマゾン|楽天/],
  ['ほかのAIアシスタント', /chatgpt|チャットgpt|\bgpt|copilot|siri|alexa|アレクサ/],
]

const TOPIC_JA = {
  politics: '政治',
  'news and gossip': 'ニュースや芸能ゴシップ',
  sports: 'スポーツ',
  games: 'ゲーム',
  'movies and entertainment': '映画やエンタメ',
  'finance and investing': 'お金や投資',
  health: '健康',
  cooking: '料理',
  'the weather': '天気',
  'fortune telling': '占い',
  'school subjects': '学校の勉強',
  translation: '翻訳',
  religion: '宗教',
  travel: '旅行',
  shopping: 'ショッピング',
  'other AI assistants': 'ほかのAIアシスタント',
}

const JOSE_TOPIC_RX =
  /jose|ジョセ|ホセ|プロジェクト|ポートフォリオ|経験|経歴|学歴|大学|スキル|ツール|連絡|履歴書|medcredix|simrs|jec|病院|アプリ|サイト|システム|開発|作品/

function matchGuard(norm) {
  if (GUARD.inappropriate.test(norm)) return { type: 'inappropriate' }
  if (GUARD.moneyRequest.test(norm)) return { type: 'money' }
  if (GUARD.illegal.test(norm)) return { type: 'illegal' }
  if (GUARD.flirt.test(norm)) return { type: 'flirt' }
  if (GUARD.homework.test(norm)) return { type: 'homework' }
  if (!JOSE_TOPIC_RX.test(norm)) {
    const topic = OFFTOPIC_TOPICS.find(([, rx]) => rx.test(norm))
    if (topic) return { type: 'offtopicTopic', topic: topic[0] }
  }
  return null
}

function fromEnglish(result) {
  if (!result) return result
  if (result.projects) {
    const titles = result.projects.map((p) => p.title)
    return { ...result, projects: PROJECTS.filter((p) => titles.includes(p.title)) }
  }
  if (result.type === 'offtopicTopic') return { ...result, topic: TOPIC_JA[result.topic] || result.topic }
  if (result.type === 'techCheck') {
    return { ...result, tech: TECHS.find((t) => t.name === result.tech.name) || result.tech }
  }
  return result
}

const INQUIRY_ACTION_RX =
  /予算|費用|料金|値段|見積|いくら|単価|相場|作って(?:ほしい|欲しい|もらえ|いただけ|くれ)|作ってもらいたい|作っていただきたい|開発して(?:ほしい|欲しい|もらえ|いただけ|くれ)|制作(?:を)?(?:依頼|お願い)|開発(?:を)?(?:依頼|お願い)|作れますか|作れる\?|作ることは(?:可能|でき)/
const INQUIRY_PRODUCT_RX =
  /サイト|ウェブ|web|ホームページ|\bhp\b|\blp\b|ランディングページ|アプリ|システム|ダッシュボード|ecサイト|通販|ネットショップ|プラットフォーム|モバイル|\b(?:website|app)\b/

export function matchConversation(rawText) {
  const norm = normalizeChat(rawText)
  if (!norm) return null
  if (/^w{2,}[\s!.?]*$/.test(norm)) return { type: 'laugh' }
  if (!hasJa(norm)) return fromEnglish(en.matchConversation(norm))
  const words = approxWords(norm)
  const aboutJose = ABOUT_JOSE_RX.test(norm)

  if (CONVO.rude.test(norm)) return { type: 'rude' }
  const guard = matchGuard(norm)
  if (guard) return guard

  if (INQUIRY_ACTION_RX.test(norm) && INQUIRY_PRODUCT_RX.test(norm)) return { type: 'projectInquiry' }

  if (CONVO.testMsg.test(norm)) return { type: 'testMsg' }
  if (CONVO.timeNow.test(norm)) return { type: 'timeNow' }
  if (CONVO.dateNow.test(norm)) return { type: 'dateNow' }
  if (CONVO.botAge.test(norm)) return { type: 'botAge' }
  if (CONVO.botLanguage.test(norm)) return { type: 'botLanguage' }
  if (CONVO.botLikes.test(norm) && !aboutJose) return { type: 'botLikes' }
  if (CONVO.apology.test(norm)) return { type: 'apology' }
  if (CONVO.askPermission.test(norm)) return { type: 'askPermission' }
  if (CONVO.laugh.test(norm)) return { type: 'laugh' }
  if (CONVO.goodnight.test(norm)) return { type: 'goodnight' }
  if (CONVO.botMaker.test(norm)) return { type: 'botMaker' }
  if (CONVO.botGender.test(norm) && !aboutJose) return { type: 'botGender' }
  if (CONVO.botHome.test(norm) && !aboutJose) return { type: 'botHome' }
  if (CONVO.botEat.test(norm) && !aboutJose) return { type: 'botEat' }
  if (CONVO.botActivity.test(norm) && !aboutJose && words <= 6) return { type: 'botActivity' }
  if (CONVO.mood.test(norm) && !aboutJose && words <= 8) return { type: 'mood' }
  if (CONVO.happy.test(norm)) return { type: 'happy' }
  if (CONVO.compliment.test(norm) && words <= 9 && !CONVO.complimentRequest.test(norm)) {
    return { type: 'compliment' }
  }

  const introducesName = /です|申します|といいます|と言います|って呼んで/.test(norm) && matchNameStatement(rawText)
  if (CONVO.meet.test(norm) && !introducesName) {
    return JOSE_RX.test(norm) ? { type: 'aboutJose' } : { type: 'meetBot' }
  }
  if (CONVO.askBotName.test(norm) && !aboutJose) return { type: 'askBotName' }
  if (CONVO.botCapabilities.test(norm) && !aboutJose) return { type: 'botCapabilities' }
  if (CONVO.askHuman.test(norm)) return { type: 'askHuman' }
  if (CONVO.personal.test(norm)) return { type: 'personal' }
  if (CONVO.gpa.test(norm)) return { type: 'gpa' }
  if (CONVO.cert.test(norm)) return { type: 'cert' }
  if (CONVO.cv.test(norm)) return { type: 'cv' }
  if (CONVO.availability.test(norm)) return { type: 'availability' }
  if (
    CONVO.currentJob.test(norm) &&
    !(CONVO.currentJobPast.test(norm) && !CONVO.currentJobNow.test(norm))
  ) {
    return { type: 'currentJob' }
  }

  const projects = findProjectMentions(norm)
  if (projects.length) return { type: 'projectDetail', projects }

  const tech = TECHS.find((t) => t.rx.test(norm))
  if (tech && CONVO.skillQuestion.test(norm)) return { type: 'techCheck', tech }
  const unknownTech = UNKNOWN_TECHS.find(([, rx]) => rx.test(norm))
  if (unknownTech && CONVO.skillQuestion.test(norm)) return { type: 'techUnknown', tech: unknownTech[0] }

  if (CONVO.location.test(norm) && !RX.education.test(norm)) return { type: 'location' }
  if (CONVO.social.test(norm) && !/プロジェクト|リポジトリ|デモ|repo|demo/.test(norm)) return { type: 'social' }
  if (CONVO.skills.test(norm)) return { type: 'skills' }
  return null
}

export const TOOLS_TEXT =
  'Vue.js、React、Next.js、TypeScript、Tailwind CSS、Go（Gin）、Node.js/Express、PHP、PostgreSQL、MySQL、Docker、Git、Postman、Swagger、Python、Pandas、Streamlit、Plotly、Power BI、Excel、Google Colab、Flutter、Dart、Figma'

export { joinList }
