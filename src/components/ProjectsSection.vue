<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import { vType } from '@/directives/type'
import { lang, t } from '@/composables/useLang'
import GithubContributions from './GithubContributions.vue'

import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import excelIcon from './icons/icons-about/excel-logo.svg'
import flutterIcon from './icons/icons-about/lockup_flutter_horizontal.svg'
import nodeIcon from './icons/icons-about/Node.js_logo.svg'
import mysqlIcon from './icons/icons-about/mysql-ar21.svg'
import googleIcon from './icons/icons-about/google-icon-logo-svgrepo-com.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import tailwindIcon from './icons/icons-about/Tailwind_CSS_Logo.svg'
import vueIcon from './icons/icons-about/Vue.js_Logo_2.svg'

import kolThumb from './img-proyek/img-bisnis-intelegence/img-savvy-1.webp'
import mobileJecThumb from './img-proyek/img-jec/IMG-JEC-1.jpeg'
import dashboardJecThumb from './img-proyek/img-admin-jec/img-admin-jec-1.webp'
import securaKostThumb from './img-proyek/img-securakost/img-securakost-beranda.webp'
import tokoKelontongThumb from './img-proyek/img-toko-kelontong/img-toko-beranda.webp'
import kindleCoffeeThumb from './img-proyek/img-kindle-coffee/img-kindle-beranda.webp'
import securaKostShotCari from './img-proyek/img-securakost/img-securakost-cari.webp'
import securaKostShotDetail from './img-proyek/img-securakost/img-securakost-detail.webp'
import securaKostShotPengajuan from './img-proyek/img-securakost/img-securakost-pengajuan.webp'
import securaKostShotEdukasi from './img-proyek/img-securakost/img-securakost-edukasi.webp'
import securaKostShotDashboard from './img-proyek/img-securakost/img-securakost-dashboard.webp'
import securaKostShotKostSaya from './img-proyek/img-securakost/img-securakost-kost-saya.webp'
import securaKostShotKontrak from './img-proyek/img-securakost/img-securakost-kontrak.webp'
import securaKostShotEscrow from './img-proyek/img-securakost/img-securakost-escrow.webp'
import securaKostShotMediasi from './img-proyek/img-securakost/img-securakost-mediasi.webp'
import tokoKelontongShotProduk from './img-proyek/img-toko-kelontong/img-toko-produk.webp'
import tokoKelontongShotCaraPesan from './img-proyek/img-toko-kelontong/img-toko-cara-pesan.webp'
import tokoKelontongShotFaq from './img-proyek/img-toko-kelontong/img-toko-faq.webp'
import tokoKelontongShotRiwayat from './img-proyek/img-toko-kelontong/img-toko-riwayat.webp'
import tokoKelontongShotTentang from './img-proyek/img-toko-kelontong/img-toko-tentang.webp'
import tokoKelontongShotKontak from './img-proyek/img-toko-kelontong/img-toko-kontak.webp'
import kindleCoffeeShotCaraPesan from './img-proyek/img-kindle-coffee/img-kindle-cara-pesan.webp'
import kindleCoffeeShotMenu from './img-proyek/img-kindle-coffee/img-kindle-menu.webp'
import kindleCoffeeShotTentang from './img-proyek/img-kindle-coffee/img-kindle-tentang.webp'
import medcredixThumb from './img-proyek/img-medcredix/img-medcredix-risk-radar.webp'
import goIcon from './icons/icons-about/Go-logo.svg'
import dockerIcon from './icons/icons-about/Docker-logo.svg'
import swaggerIcon from './icons/icons-about/Swagger-logo.svg'
import postmanIcon from './icons/icons-about/Postman-logo.svg'
import typescriptIcon from './icons/icons-about/TypeScript-logo.svg'
import gitIcon from './icons/icons-about/Git-logo.svg'
import ginIcon from './icons/icons-stack/gin.svg'
import gormIcon from './icons/icons-stack/gorm.svg'
import postgresIcon from './icons/icons-stack/postgresql.svg'
import jwtIcon from './icons/icons-stack/jwt.svg'
import storageIcon from './icons/icons-stack/storage.svg'
import caddyIcon from './icons/icons-stack/caddy.svg'
import nginxIcon from './icons/icons-stack/nginx.svg'
import viteIcon from './icons/icons-stack/vite.svg'
import piniaIcon from './icons/icons-stack/pinia.svg'
import chartjsIcon from './icons/icons-stack/chartjs.svg'
import nextIcon from './icons/icons-about/Nextjs-logo.svg'
import shadcnIcon from './icons/icons-stack/shadcn.svg'
import zodIcon from './icons/icons-stack/zod.svg'
import rechartsIcon from './icons/icons-stack/recharts.svg'
import centrifugoIcon from './icons/icons-stack/centrifugo.svg'
import redisIcon from './icons/icons-stack/redis.svg'
import midtransIcon from './icons/icons-stack/midtrans.svg'
import pandasIcon from './icons/icons-about/Pandas-logo.svg'
import plotlyIcon from './icons/icons-about/Plotly-mark.svg'
import numpyIcon from './icons/icons-stack/numpy.svg'
import geminiIcon from './icons/icons-stack/gemini.svg'
import flutterMarkIcon from './icons/icons-about/Flutter-mark.svg'
import dartIcon from './icons/icons-about/Dart-logo.svg'
import nodeMarkIcon from './icons/icons-about/Nodejs-mark.svg'
import expressIcon from './icons/icons-about/Express-logo.svg'
import mysqlMarkIcon from './icons/icons-about/MySQL-mark.svg'
import figmaIcon from './icons/icons-about/Figma-logo.svg'
import gmailIcon from './icons/icons-about/gmail.svg'
import firebaseIcon from './icons/icons-stack/firebase.svg'
import ocrIcon from './icons/icons-stack/ocr.svg'
import tensorflowIcon from './icons/icons-stack/tensorflow.svg'
import leafletIcon from './icons/icons-stack/leaflet.svg'
import pdfIcon from './icons/icons-stack/pdf.svg'
import mapsIcon from './icons/icons-stack/maps.svg'
import vercelIcon from './icons/icons-stack/vercel.svg'
import cssIcon from './icons/icons-stack/css.svg'
import apiIcon from './icons/icons-stack/api.svg'
import simrsLogin from './img-proyek/img-simrs/img-simrs-login.webp'
import simrsKunjungan from './img-proyek/img-simrs/img-simrs-kunjungan.webp'
import simrsDetailKunjungan from './img-proyek/img-simrs/img-simrs-detail-kunjungan.webp'
import simrsSpri from './img-proyek/img-simrs/img-simrs-spri.webp'
import simrsRawatInap from './img-proyek/img-simrs/img-simrs-rawat-inap.webp'
import simrsSuratKematian from './img-proyek/img-simrs/img-simrs-surat-kematian.webp'
import simrsTagihan from './img-proyek/img-simrs/img-simrs-tagihan.webp'
import simrsKasir from './img-proyek/img-simrs/img-simrs-kasir.webp'
import simrsGiziLabel from './img-proyek/img-simrs/img-simrs-gizi-label.webp'
import simrsPramusaji from './img-proyek/img-simrs/img-simrs-pramusaji.webp'
import medcredixLogin from './img-proyek/img-medcredix/img-medcredix-login.webp'
import medcredixPortalEnv from './img-proyek/img-medcredix/img-medcredix-portal-lingkungan.webp'
import medcredixDashboard from './img-proyek/img-medcredix/img-medcredix-dashboard.webp'
import medcredixEarlyWarnings from './img-proyek/img-medcredix/img-medcredix-early-warnings.webp'
import medcredixActions from './img-proyek/img-medcredix/img-medcredix-actions.webp'
import medcredixPractitioners from './img-proyek/img-medcredix/img-medcredix-practitioners.webp'
import medcredixCredentials from './img-proyek/img-medcredix/img-medcredix-credentials.webp'
import medcredixVerification from './img-proyek/img-medcredix/img-medcredix-verification.webp'
import medcredixWorkforce from './img-proyek/img-medcredix/img-medcredix-workforce.webp'
import medcredixInterop from './img-proyek/img-medcredix/img-medcredix-interop.webp'
import medcredixPathway from './img-proyek/img-medcredix/img-medcredix-pathway.webp'
import medcredixClaimIntegrity from './img-proyek/img-medcredix/img-medcredix-claim-integrity.webp'
import medcredixDataTrust from './img-proyek/img-medcredix/img-medcredix-data-trust.webp'
import medcredixCompliance from './img-proyek/img-medcredix/img-medcredix-compliance.webp'
import medcredixAudit from './img-proyek/img-medcredix/img-medcredix-audit.webp'
import medcredixPortalApi from './img-proyek/img-medcredix/img-medcredix-portal-api.webp'

const moreProjectsHref = 'https://github.com/joseparhusip?tab=repositories'

const projects = [
  {
    title: 'MedCredix',
    category: { id: 'Backend · Kesehatan', en: 'Backend · Healthcare', ja: 'バックエンド · 医療' },
    internal: true,
    desc: {
      id: [
        'Platform kesiapan kredensial rumah sakit (multi-RS, data terisolasi per RS). Saya membangun backend-nya: skema PostgreSQL 33 tabel dan REST API Go (Gin) + GORM, lengkap dengan dokumentasi Swagger.',
        'Membangun mesin skoring kesiapan RS (Health Score, BDCS, Trust) dengan rincian skor, snapshot bulanan, dan unit test. Hasilnya dipakai untuk dashboard eksekutif, daftar risiko, peringatan dini, dan rencana tindak lanjut.',
        'Mengimplementasikan keamanan berlapis: autentikasi JWT, RBAC per peran, password bcrypt, pembatas percobaan login, CAPTCHA, serta unggahan dokumen yang dienkripsi AES-256-GCM.',
        'Membangun alur kredensial tenaga medis (unggah, verifikasi atau penolakan, persetujuan, prasyarat) yang disertai audit trail, dan job otomatis untuk memperbarui status kredensial.',
        'Mengintegrasikan data SIMRS lewat klien FHIR untuk uji koneksi resource, dengan mode simulasi saat server FHIR belum tersedia.',
        'Men-deploy dengan Docker Compose (PostgreSQL, API, dan web Nginx) untuk lingkungan dev, sandbox, dan produksi di VPS. Caddy menjadi reverse proxy dengan HTTPS otomatis.',
      ],
      en: [
        'A hospital credentialing readiness platform (multi-hospital, with data isolated per hospital). I built the backend: a 33-table PostgreSQL schema and a Go (Gin) + GORM REST API, complete with Swagger documentation.',
        'Built a hospital readiness scoring engine (Health Score, BDCS, Trust) with score breakdowns, monthly snapshots, and unit tests. The results feed the executive dashboard, risk list, early warnings, and follow-up plans.',
        'Implemented layered security: JWT authentication, role-based access control (RBAC), bcrypt password hashing, login attempt limiting, CAPTCHA, and document uploads encrypted with AES-256-GCM.',
        'Built the medical staff credentialing workflow (upload, verification or rejection, approval, prerequisites) with an audit trail, plus automated jobs that update credential statuses.',
        'Integrated SIMRS data through a FHIR client for resource connection testing, with a simulation mode for when the FHIR server is not yet available.',
        'Deployed with Docker Compose (PostgreSQL, API, and an Nginx web server) for dev, sandbox, and production environments on a VPS. Caddy serves as the reverse proxy with automatic HTTPS.',
      ],
      ja: [
        '病院の資格認定（クレデンシャリング）への対応状況を管理するプラットフォーム（複数病院対応、病院ごとにデータを分離）。バックエンドを担当し、PostgreSQLの33テーブル構成のスキーマと、Go（Gin）+ GORMによるREST APIをSwaggerドキュメント付きで構築。',
        '病院の対応状況を評価するスコアリングエンジン（Health Score、BDCS、Trust）を構築。スコアの内訳、月次スナップショット、ユニットテストまで実装し、算出結果を経営層向けダッシュボード、リスク一覧、早期警告、改善計画に活用。',
        '多層的なセキュリティを実装。JWT認証、ロールベースのアクセス制御（RBAC）、bcryptによるパスワードのハッシュ化、ログイン試行回数の制限、CAPTCHA、AES-256-GCMで暗号化した書類アップロードに対応。',
        '医療従事者の資格認定ワークフロー（アップロード、審査または差し戻し、承認、前提条件の確認）を監査証跡付きで構築。資格ステータスを自動更新するジョブも実装。',
        'FHIRクライアントを介してSIMRS（病院情報システム）のデータを連携し、リソースの接続テストを実装。FHIRサーバーが未整備の段階でも動作確認できるシミュレーションモードを用意。',
        'Docker Compose（PostgreSQL、API、NginxによるWebサーバー）を用いて、VPS上の開発・サンドボックス・本番の各環境にデプロイ。リバースプロキシにはCaddyを採用し、HTTPSを自動化。',
      ],
    },
    stack: [
      {
        group: 'Backend',
        items: [
          { name: 'Go', icon: goIcon },
          { name: 'Gin', icon: ginIcon },
          { name: 'GORM', icon: gormIcon },
          { name: 'PostgreSQL', icon: postgresIcon },
          { name: 'JWT', icon: jwtIcon },
          { name: 'Swagger', icon: swaggerIcon },
          { name: 'S3 Storage', icon: storageIcon },
        ],
      },
      {
        group: 'Frontend',
        items: [
          { name: 'Vue.js', icon: vueIcon },
          { name: 'TypeScript', icon: typescriptIcon },
          { name: 'Vite', icon: viteIcon },
          { name: 'Tailwind CSS', icon: tailwindIcon },
          { name: 'Pinia', icon: piniaIcon },
          { name: 'Chart.js', icon: chartjsIcon },
        ],
      },
      {
        group: { id: 'Infrastruktur & alat', en: 'Infrastructure & tools', ja: 'インフラ・ツール' },
        items: [
          { name: 'Docker', icon: dockerIcon },
          { name: 'Caddy', icon: caddyIcon },
          { name: 'Nginx', icon: nginxIcon },
          { name: 'Postman', icon: postmanIcon },
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Analisis kebutuhan', en: 'Requirements analysis', ja: '要件分析' },
        text: {
          id: 'Memetakan alur kredensial RS, peran pengguna, dan indikator kesiapan bersama tim.',
          en: 'Mapped the hospital credentialing flow, user roles, and readiness indicators with the team.',
          ja: 'チームと共に、病院の資格認定フロー、ユーザーのロール、対応状況の指標を整理。',
        },
      },
      {
        title: { id: 'Pemodelan sistem & database', en: 'System & database modeling', ja: 'システム・データベース設計' },
        text: {
          id: 'Membuat use case diagram, activity diagram, dan ERD, lalu merancang skema PostgreSQL 33 tabel dengan data terisolasi per rumah sakit.',
          en: 'Created use case diagrams, activity diagrams, and an ERD, then designed a 33-table PostgreSQL schema with data isolated per hospital.',
          ja: 'ユースケース図、アクティビティ図、ERDを作成し、病院ごとにデータを分離した33テーブル構成のPostgreSQLスキーマを設計。',
        },
      },
      {
        title: { id: 'Fondasi API & keamanan', en: 'API foundation & security', ja: 'API基盤とセキュリティ' },
        text: {
          id: 'Membangun REST API Go (Gin) + GORM dengan JWT, RBAC per tombol, rate limit, CAPTCHA, dan bcrypt.',
          en: 'Built the Go (Gin) + GORM REST API with JWT, per-button RBAC, rate limiting, CAPTCHA, and bcrypt.',
          ja: 'Go（Gin）+ GORMでREST APIを構築し、JWT、ボタン単位のRBAC、レート制限、CAPTCHA、bcryptを実装。',
        },
      },
      {
        title: { id: 'Fitur inti', en: 'Core features', ja: 'コア機能' },
        text: {
          id: 'Mesin skoring kesiapan RS, alur kredensial tenaga medis, unggahan dokumen terenkripsi, dan audit trail.',
          en: 'The hospital readiness scoring engine, medical staff credentialing workflow, encrypted document uploads, and audit trail.',
          ja: '病院の対応状況スコアリング、医療従事者の資格認定ワークフロー、暗号化した書類アップロード、監査証跡を実装。',
        },
      },
      {
        title: { id: 'Integrasi SIMRS', en: 'SIMRS integration', ja: 'SIMRS連携' },
        text: {
          id: 'API integrasi dengan API key (baca & impor) serta klien FHIR dengan mode simulasi.',
          en: 'Integration API with API keys (read & import) and a FHIR client with a simulation mode.',
          ja: 'APIキーによる連携API（参照・インポート）と、シミュレーションモード付きのFHIRクライアントを構築。',
        },
      },
      {
        title: { id: 'Dokumentasi & pengujian', en: 'Documentation & testing', ja: 'ドキュメントとテスト' },
        text: {
          id: 'Dokumentasi Swagger, Developer Portal, unit test skoring, dan pengujian endpoint dengan Postman.',
          en: 'Swagger documentation, a Developer Portal, scoring unit tests, and endpoint testing with Postman.',
          ja: 'Swaggerドキュメント、Developer Portal、スコアリングのユニットテスト、Postmanによるエンドポイント検証。',
        },
      },
      {
        title: { id: 'Deploy', en: 'Deployment', ja: 'デプロイ' },
        text: {
          id: 'Docker Compose untuk dev, sandbox, dan produksi, dengan Caddy sebagai reverse proxy HTTPS otomatis.',
          en: 'Docker Compose for dev, sandbox, and production, with Caddy as an automatic-HTTPS reverse proxy.',
          ja: '開発・サンドボックス・本番の各環境をDocker Composeで構築し、CaddyでHTTPSを自動化。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Autentikasi', en: 'Authentication', ja: '認証' },
        routes: [
          ['POST', '/api/auth'],
          ['POST', '/api/auth/web'],
          ['GET', '/api/auth/captcha'],
          ['POST', '/api/auth/refresh'],
          ['POST', '/api/auth/logout'],
          ['POST', '/api/auth/password/forgot'],
          ['POST', '/api/auth/password/verify'],
          ['POST', '/api/auth/password/reset'],
          ['PATCH', '/api/me/password'],
        ],
      },
      {
        group: { id: 'Dashboard & skor', en: 'Dashboard & scores', ja: 'ダッシュボード・スコア' },
        routes: [
          ['GET', '/api/bootstrap'],
          ['GET', '/api/dashboard'],
          ['GET', '/api/scores'],
          ['POST', '/api/scores/snapshot'],
          ['GET', '/api/admin'],
          ['GET', '/api/search'],
        ],
      },
      {
        group: { id: 'Risiko & tindak lanjut', en: 'Risks & follow-ups', ja: 'リスク・改善' },
        routes: [
          ['GET · POST · PATCH', '/api/risks'],
          ['GET · PATCH', '/api/warnings'],
          ['GET · POST · PATCH', '/api/actions'],
          ['PATCH', '/api/notifications'],
        ],
      },
      {
        group: { id: 'Kredensial tenaga medis', en: 'Medical staff credentials', ja: '医療従事者の資格認定' },
        routes: [
          ['GET · POST · PATCH', '/api/practitioners'],
          ['GET · POST · PATCH', '/api/credentials'],
          ['GET · PATCH', '/api/requirements'],
          ['GET', '/api/requirements/file'],
          ['POST', '/api/requirements/upload'],
          ['GET · PATCH', '/api/documents'],
          ['GET', '/api/documents/file'],
          ['POST', '/api/documents/upload'],
        ],
      },
      {
        group: { id: 'Klinis, klaim & kepatuhan', en: 'Clinical, claims & compliance', ja: '臨床・請求・コンプライアンス' },
        routes: [
          ['GET · PATCH', '/api/claims'],
          ['GET', '/api/clinical'],
          ['GET', '/api/compliance'],
          ['GET', '/api/evidence'],
          ['GET', '/api/audit'],
          ['GET · POST', '/api/reports'],
        ],
      },
      {
        group: { id: 'Administrasi', en: 'Administration', ja: '管理' },
        routes: [
          ['GET · PATCH', '/api/settings'],
          ['POST · PATCH', '/api/users'],
          ['POST · PATCH', '/api/hospitals'],
          ['GET', '/api/hospital-directory'],
          ['GET', '/api/regions'],
          ['GET · POST', '/api/data'],
          ['PATCH', '/api/role-permissions'],
          ['GET · POST', '/api/integration-keys'],
          ['DELETE', '/api/integration-keys/:id'],
        ],
      },
      {
        group: { id: 'Integrasi SIMRS (API key)', en: 'SIMRS integration (API key)', ja: 'SIMRS連携（APIキー）' },
        routes: [
          ['GET', '/api/integration/ping'],
          ['GET', '/api/integration/{dashboard, scores, risks, …}'],
          ['POST', '/api/integration/import/practitioners'],
          ['POST', '/api/integration/import/credentials'],
          ['POST', '/api/integration/import/claims'],
        ],
      },
      {
        group: { id: 'Developer Portal', en: 'Developer Portal', ja: 'Developer Portal' },
        routes: [
          ['POST', '/api/docs/login'],
          ['POST', '/api/docs/register'],
          ['POST', '/api/docs/register/verify'],
          ['POST', '/api/docs/register/resend'],
          ['POST', '/api/docs/password/{forgot, verify, reset}'],
          ['GET', '/api/docs/{me, spec, environments}'],
          ['POST', '/api/docs/logout'],
          ['GET', '/api/health'],
        ],
      },
    ],
    thumb: medcredixThumb,
    shots: [
      { src: medcredixDashboard, caption: { id: 'Dashboard eksekutif & Hospital Health Score', en: 'Executive dashboard & Hospital Health Score', ja: 'エグゼクティブダッシュボードとHospital Health Score' } },
      { src: medcredixThumb, caption: 'Hospital Risk Radar' },
      { src: medcredixEarlyWarnings, caption: { id: 'Early warning berbasis ambang batas', en: 'Threshold-based early warnings', ja: 'しきい値ベースの早期警告' } },
      { src: medcredixActions, caption: { id: 'Action Center: rencana tindak lanjut', en: 'Action Center: follow-up plans', ja: 'Action Center：フォローアップ計画' } },
      { src: medcredixPractitioners, caption: { id: 'Daftar praktisi tenaga medis', en: 'Medical practitioner list', ja: '医療従事者一覧' } },
      { src: medcredixCredentials, caption: { id: 'Kredensial STR & SIP', en: 'STR & SIP credentials', ja: 'STR・SIPの資格情報' } },
      { src: medcredixVerification, caption: { id: 'Verifikasi & persetujuan komite medis', en: 'Verification & medical committee approval', ja: '検証と医療委員会の承認' } },
      { src: medcredixWorkforce, caption: { id: 'Kesiapan clinical workforce', en: 'Clinical workforce readiness', ja: '臨床スタッフの準備状況' } },
      { src: medcredixInterop, caption: { id: 'Interoperabilitas SATUSEHAT, BPJS & FHIR', en: 'SATUSEHAT, BPJS & FHIR interoperability', ja: 'SATUSEHAT・BPJS・FHIRとの相互運用性' } },
      { src: medcredixPathway, caption: { id: 'Kepatuhan clinical pathway', en: 'Clinical pathway compliance', ja: 'クリニカルパスの遵守状況' } },
      { src: medcredixClaimIntegrity, caption: { id: 'Integritas klaim', en: 'Claim integrity', ja: '請求の整合性' } },
      { src: medcredixDataTrust, caption: { id: 'Skor kepercayaan data (Data Trust)', en: 'Data Trust score', ja: 'データ信頼度スコア' } },
      { src: medcredixCompliance, caption: { id: 'Kepatuhan regulasi', en: 'Regulatory compliance', ja: '規制遵守' } },
      { src: medcredixAudit, caption: { id: 'Audit trail immutable', en: 'Immutable audit trail', ja: '改ざん不可の監査ログ' } },
      { src: medcredixLogin, caption: { id: 'Halaman masuk dengan CAPTCHA', en: 'Sign-in page with CAPTCHA', ja: 'CAPTCHA付きのログイン画面' } },
      { src: medcredixPortalEnv, caption: 'Developer Portal: Sandbox & Production' },
      {
        src: medcredixPortalApi,
        caption: { id: 'Developer Portal: referensi API', en: 'Developer Portal: API reference', ja: 'Developer Portal：APIリファレンス' },
      },
    ],
    techStack: [{ name: 'Go (Gin)' }, { name: 'PostgreSQL' }, { name: 'Swagger' }, { name: 'Docker' }],
  },
  {
    title: 'SIMRS Dashboard',
    category: { id: 'Frontend · Kesehatan', en: 'Frontend · Healthcare', ja: 'フロントエンド · 医療' },
    internal: true,
    desc: {
      id: [
        'Dashboard SIMRS (sistem informasi rumah sakit) dengan Next.js 16, React 19, TypeScript, dan Tailwind CSS. Bagian saya: seluruh fitur role dokter, rawat inap (SPRI dan surat persetujuan/penolakan), surat kematian, kasir sampai pembayaran Midtrans, serta role gizi dan pramusaji.',
        'Role dokter: antrean pasien, catatan klinis dan pemeriksaan fisik, tanda vital, diagnosis ICD-10, resume medis yang ditandatangani, daftar pasien rawat inap, dan hasil laboratorium/radiologi.',
        'Rawat inap dari SPRI dokter: surat persetujuan atau penolakan pasien (tanda tangan digital atau unggah scan), pemilihan ruang dan tempat tidur, sampai cetak gelang pasien.',
        'Surat kematian: penerbitan, serah terima jenazah, cetak dokumen, dan pembatalan dengan riwayat yang tercatat.',
        'Kasir: buka/tutup shift, tagihan dan rincian biaya, pembayaran tunai, refund dan void, pembayaran Midtrans (buat transaksi, sinkron status, notifikasi), serta invoice dan kuitansi PDF.',
        'Gizi dan pramusaji: master tekstur, diet, makanan, menu, dan siklus menu; instruksi diet pasien; order makan (generate, validasi, produksi, cetak label); konfirmasi alergen, penyajian, dan pencatatan asupan.',
        'Terhubung ke REST API Go (Gin) lewat kontrak Swagger, validasi Zod, hak akses per peran, dan notifikasi realtime Centrifugo; NIK disamarkan dan data pasien tidak disimpan di browser.',
      ],
      en: [
        'A SIMRS (hospital information system) dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS. My part: every doctor-role feature, inpatient admission (SPRI and consent/refusal forms), death certificates, the cashier flow through to Midtrans payments, and the nutrition and meal-server roles.',
        'Doctor role: the patient queue, clinical notes and physical exams, vital signs, ICD-10 diagnoses, signed medical summaries, the inpatient list, and laboratory/radiology results.',
        'Inpatient admission from the doctor\'s SPRI: patient consent or refusal forms (digital signature or scanned upload), room and bed selection, through to printing the patient wristband.',
        'Death certificates: issuing, body handover, document printing, and voiding with a recorded history.',
        'Cashier: opening and closing shifts, bills and itemized charges, cash payments, refunds and voids, Midtrans payments (creating transactions, syncing status, notifications), and PDF invoices and receipts.',
        'Nutrition and meal servers: master data for textures, diets, foods, menus, and menu cycles; patient diet instructions; meal orders (generate, validate, produce, print labels); allergen confirmation, serving, and intake recording.',
        'Connected to the Go (Gin) REST API through the Swagger contract, with Zod validation, role-based access, and real-time Centrifugo notifications; national ID numbers are masked and patient data is never stored in the browser.',
      ],
      ja: [
        'Next.js 16、React 19、TypeScript、Tailwind CSSで構築したSIMRS（病院情報システム）のダッシュボード。担当範囲は、医師ロールの全機能、入院受付（SPRIと同意書・拒否書）、死亡診断書、Midtrans決済までの会計、栄養科と配膳スタッフのロール。',
        '医師ロール：患者の受付待ち一覧、診療記録と身体診察、バイタルサイン、ICD-10による診断、署名付きの退院時要約、入院患者一覧、検査・放射線の結果表示を実装。',
        '医師のSPRI（入院指示書）を起点に、患者の同意書・拒否書（電子署名またはスキャン画像のアップロード）、病室とベッドの選択、患者用リストバンドの印刷までの入院受付フローを構築。',
        '死亡診断書：発行、ご遺体の引き渡し、書類の印刷、履歴を残した取り消しまでを実装。',
        '会計：シフトの開始・締め、請求と明細、現金決済、返金・取り消し、Midtrans決済（取引の作成、ステータス同期、通知）、PDFの請求書と領収書を実装。',
        '栄養科・配膳：食形態、食種、食品、献立、献立サイクルのマスタ管理、患者の食事指示、食事オーダー（生成、確認、調理、ラベル印刷）、アレルゲン確認、配膳、摂取量の記録を実装。',
        'Swaggerの仕様に基づきGo（Gin）のREST APIと連携し、Zodによる入力検証、ロール別のアクセス制御、Centrifugoのリアルタイム通知に対応。NIKはマスク表示し、患者データはブラウザに保存しない設計。',
      ],
    },
    stack: [
      {
        group: 'Frontend',
        items: [
          { name: 'Next.js', icon: nextIcon },
          { name: 'React', icon: reactIcon },
          { name: 'TypeScript', icon: typescriptIcon },
          { name: 'Tailwind CSS', icon: tailwindIcon },
          { name: 'shadcn/ui', icon: shadcnIcon },
          { name: 'Zod', icon: zodIcon },
          { name: 'Recharts', icon: rechartsIcon },
        ],
      },
      {
        group: 'Backend',
        items: [
          { name: 'Go', icon: goIcon },
          { name: 'Gin', icon: ginIcon },
          { name: 'PostgreSQL', icon: postgresIcon },
          { name: 'Redis', icon: redisIcon },
          { name: 'MinIO', icon: storageIcon },
          { name: 'JWT', icon: jwtIcon },
          { name: 'Swagger', icon: swaggerIcon },
        ],
      },
      {
        group: { id: 'Integrasi & alat', en: 'Integrations & tools', ja: '連携・ツール' },
        items: [
          { name: 'Midtrans', icon: midtransIcon },
          { name: 'Centrifugo', icon: centrifugoIcon },
          { name: 'Docker', icon: dockerIcon },
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Analisis alur per role', en: 'Per-role flow analysis', ja: 'ロール別の業務分析' },
        text: {
          id: 'Memetakan pekerjaan dokter, kasir, ahli gizi, dan pramusaji, serta dokumen medis (SPRI, persetujuan, surat kematian).',
          en: 'Mapped the work of doctors, cashiers, dietitians, and meal servers, plus the medical documents (SPRI, consent, death certificate).',
          ja: '医師、会計、管理栄養士、配膳スタッフの業務と、医療書類（SPRI、同意書、死亡診断書）を整理。',
        },
      },
      {
        title: { id: 'Pemodelan sistem', en: 'System modeling', ja: 'システム設計' },
        text: {
          id: 'Membuat use case diagram dan activity diagram per role, lalu menyusun alur layar sesuai kontrak Swagger.',
          en: 'Created use case and activity diagrams per role, then laid out the screen flows against the Swagger contract.',
          ja: 'ロールごとにユースケース図とアクティビティ図を作成し、Swaggerの仕様に沿って画面遷移を設計。',
        },
      },
      {
        title: { id: 'Role dokter', en: 'Doctor role', ja: '医師ロール' },
        text: {
          id: 'Antrean, pemeriksaan, tanda vital, diagnosis ICD-10, resume medis, pasien rawat inap, dan hasil penunjang.',
          en: 'Queue, examinations, vital signs, ICD-10 diagnoses, medical summaries, inpatients, and test results.',
          ja: '受付待ち、診察、バイタル、ICD-10診断、退院時要約、入院患者、検査結果を実装。',
        },
      },
      {
        title: { id: 'Dokumen medis', en: 'Medical documents', ja: '医療書類' },
        text: {
          id: 'SPRI, surat persetujuan/penolakan dengan tanda tangan digital, gelang pasien, dan surat kematian siap cetak.',
          en: 'SPRI, consent/refusal forms with digital signatures, patient wristbands, and print-ready death certificates.',
          ja: 'SPRI、電子署名付きの同意書・拒否書、患者用リストバンド、印刷対応の死亡診断書を作成。',
        },
      },
      {
        title: { id: 'Kasir & Midtrans', en: 'Cashier & Midtrans', ja: '会計とMidtrans' },
        text: {
          id: 'Shift kasir, tagihan, pembayaran tunai dan Midtrans, sinkron status transaksi, invoice dan kuitansi PDF.',
          en: 'Cashier shifts, bills, cash and Midtrans payments, transaction status sync, and PDF invoices and receipts.',
          ja: '会計シフト、請求、現金・Midtrans決済、取引ステータスの同期、PDFの請求書・領収書を実装。',
        },
      },
      {
        title: { id: 'Gizi & pramusaji', en: 'Nutrition & meal servers', ja: '栄養科・配膳' },
        text: {
          id: 'Master menu dan diet, order makan, cetak label, konfirmasi alergen, penyajian, dan pencatatan asupan.',
          en: 'Menu and diet master data, meal orders, label printing, allergen checks, serving, and intake records.',
          ja: '献立・食種のマスタ、食事オーダー、ラベル印刷、アレルゲン確認、配膳、摂取量の記録を実装。',
        },
      },
      {
        title: { id: 'Uji & rilis', en: 'Testing & release', ja: 'テストとリリース' },
        text: {
          id: 'Validasi Zod, pengecekan per role, Husky dan commitlint, lalu dikemas dengan Docker.',
          en: 'Zod validation, per-role checks, Husky and commitlint, then packaged with Docker.',
          ja: 'Zodによる検証、ロールごとの動作確認、Husky・commitlintを経て、Dockerでパッケージ化。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Dokter: pemeriksaan', en: 'Doctor: examinations', ja: '医師：診察' },
        routes: [
          ['GET · POST', '/api/v1/clinical/encounters/:id/notes'],
          ['POST', '/api/v1/clinical/notes/:id/{amend, verify}'],
          ['GET · POST', '/api/v1/clinical/encounters/:id/physical-exams'],
          ['GET · POST', '/api/v1/clinical/encounters/:id/vitals'],
          ['GET · POST', '/api/v1/clinical/encounters/:id/diagnoses'],
          ['GET', '/api/v1/clinical/icd10'],
          ['GET', '/api/v1/clinical/encounters/:id/resume'],
          ['PUT', '/api/v1/clinical/encounters/:id/resume/draft'],
          ['POST', '/api/v1/clinical/encounters/:id/resume/sign'],
        ],
      },
      {
        group: { id: 'Rawat inap & SPRI', en: 'Inpatient & SPRI', ja: '入院・SPRI' },
        routes: [
          ['GET', '/api/v1/encounters/admission-orders'],
          ['GET · POST', '/api/v1/encounters/:id/admission-statements'],
          ['POST', '/api/v1/encounters/:id/admission-statements/:statementId/void'],
          ['GET · POST', '/api/v1/encounters/:id/wristband-prints'],
          ['POST', '/api/v1/documents/uploads'],
        ],
      },
      {
        group: { id: 'Surat kematian', en: 'Death certificates', ja: '死亡診断書' },
        routes: [
          ['GET · POST', '/api/v1/encounters/:id/death-certificate'],
          ['POST', '/api/v1/encounters/:id/death-certificate/void'],
          ['POST', '/api/v1/encounters/:id/death-certificate/handover'],
          ['POST', '/api/v1/encounters/:id/death-certificate/prints'],
        ],
      },
      {
        group: { id: 'Kasir & tagihan', en: 'Cashier & billing', ja: '会計・請求' },
        routes: [
          ['POST', '/api/v1/billing/cashier-shifts'],
          ['GET', '/api/v1/billing/cashier-shifts/current'],
          ['POST', '/api/v1/billing/cashier-shifts/:id/close'],
          ['GET', '/api/v1/billing/bills'],
          ['GET', '/api/v1/billing/bills/:id'],
          ['POST', '/api/v1/billing/bills/:id/{finalize, reopen, cancel}'],
          ['POST', '/api/v1/billing/bills/:id/payments'],
          ['POST', '/api/v1/billing/bills/:id/refunds'],
          ['POST', '/api/v1/billing/payments/:id/void'],
        ],
      },
      {
        group: { id: 'Pembayaran Midtrans', en: 'Midtrans payments', ja: 'Midtrans決済' },
        routes: [
          ['GET · POST', '/api/v1/billing/bills/:id/midtrans-transactions'],
          ['GET', '/api/v1/billing/midtrans-transactions/:id'],
          ['POST', '/api/v1/billing/midtrans-transactions/:id/sync'],
          ['POST', '/api/v1/billing/midtrans-transactions/:id/cancel'],
          ['POST', '/api/v1/billing/midtrans/notifications'],
        ],
      },
      {
        group: { id: 'Gizi: master & instruksi', en: 'Nutrition: master data', ja: '栄養科：マスタ・指示' },
        routes: [
          ['GET · POST', '/api/v1/nutrition/{textures, diets, foods, menus}'],
          ['GET · POST', '/api/v1/nutrition/menu-cycles'],
          ['POST', '/api/v1/nutrition/menu-cycles/:id/{approve, retire}'],
          ['GET · POST', '/api/v1/nutrition/encounters/:id/diet-instructions'],
          ['POST', '/api/v1/nutrition/diet-instructions/:id/deactivate'],
        ],
      },
      {
        group: { id: 'Order makan & pramusaji', en: 'Meal orders & serving', ja: '食事オーダー・配膳' },
        routes: [
          ['GET · POST', '/api/v1/nutrition/meal-orders'],
          ['POST', '/api/v1/nutrition/meal-orders/{generate, submit, validate, produce}'],
          ['POST', '/api/v1/nutrition/meal-orders/:id/allergen-confirm'],
          ['POST', '/api/v1/nutrition/meal-orders/:id/label-prints'],
          ['POST', '/api/v1/nutrition/meal-orders/:id/serving'],
          ['POST', '/api/v1/nutrition/meal-orders/:id/intake'],
          ['GET', '/api/v1/nutrition/{preparation, intake}'],
        ],
      },
    ],
    thumb: simrsKunjungan,
    shots: [
      { src: simrsLogin, caption: { id: 'Halaman masuk', en: 'Sign-in page', ja: 'ログイン画面' } },
      { src: simrsKunjungan, caption: { id: 'Daftar kunjungan pasien dokter (DPJP)', en: 'Doctor (DPJP) patient visit list', ja: '担当医（DPJP）の受診一覧' } },
      { src: simrsDetailKunjungan, caption: { id: 'Detail kunjungan dan alur pelayanan', en: 'Visit detail and care flow', ja: '受診詳細と診療フロー' } },
      { src: simrsSpri, caption: { id: 'Surat Perintah Rawat Inap (SPRI)', en: 'Inpatient admission order (SPRI)', ja: '入院指示書（SPRI）' } },
      { src: simrsRawatInap, caption: { id: 'Pasien rawat inap: surat rujukan, APS, dan sertifikat kematian', en: 'Inpatient: referral letter, AMA statement, and death certificate', ja: '入院患者：紹介状、自己退院同意書、死亡診断書' } },
      { src: simrsSuratKematian, caption: { id: 'Pratinjau sertifikat medis penyebab kematian', en: 'Medical certificate of cause of death preview', ja: '死亡診断書のプレビュー' } },
      { src: simrsTagihan, caption: { id: 'Tagihan pasien lunas lewat Midtrans', en: 'Patient bill paid via Midtrans', ja: 'Midtransで支払い済みの請求書' } },
      { src: simrsKasir, caption: { id: 'Shift kasir dan rekap per metode bayar', en: 'Cashier shift and totals per payment method', ja: 'レジのシフトと支払方法別の集計' } },
      { src: simrsGiziLabel, caption: { id: 'Gizi: produksi & label makanan', en: 'Nutrition: meal production & labels', ja: '栄養科：食事の調理とラベル' } },
      { src: simrsPramusaji, caption: { id: 'Pramusaji: pembagian makan pasien', en: 'Meal server: serving patient meals', ja: '配膳：患者への配膳' } },
    ],
    techStack: [{ name: 'Next.js' }, { name: 'React' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' }],
  },
  {
    title: 'Dashboard KOL',
    category: { id: 'Data & BI', en: 'Data & BI', ja: 'データ · BI' },
    desc: {
      id: [
        'Membangun pipeline ETL dengan Python (Pandas) untuk membersihkan dan mentransformasi data ekspor TikTok Shop.',
        'Mengidentifikasi dan memperbaiki bug double-counting pada metrik views dan likes yang menyebabkan data performa creator terhitung berulang.',
        'Merancang metrik turunan (GMV, Conversion Rate, GMV per View, Engagement Rate) serta sistem scoring creator berbasis percentile-rank yang tahan terhadap outlier.',
        'Membangun dan menghosting dashboard BI interaktif 5 halaman (Streamlit + Plotly) mencakup Overview, Campaign & Produk, Creator Intelligence, Risk & Anomali, dan AI Insights untuk monitoring GMV dan performa campaign secara real time.',
        'Mengintegrasikan Gemini AI API untuk menghasilkan analisis strategi dan rencana aksi 30 hari secara otomatis berdasarkan ringkasan performa bulanan.',
      ],
      en: [
        'Built an ETL pipeline in Python (Pandas) to clean and transform TikTok Shop export data.',
        'Identified and fixed a double-counting bug in the views and likes metrics that caused creator performance data to be counted multiple times.',
        'Designed derived metrics (GMV, Conversion Rate, GMV per View, Engagement Rate) and a percentile-rank-based creator scoring system that is robust to outliers.',
        'Built and hosted a 5-page interactive BI dashboard (Streamlit + Plotly) covering Overview, Campaign & Products, Creator Intelligence, Risk & Anomalies, and AI Insights for real-time monitoring of GMV and campaign performance.',
        'Integrated the Gemini AI API to automatically generate strategy analysis and a 30-day action plan based on monthly performance summaries.',
      ],
      ja: [
        'Python（Pandas）でETLパイプラインを構築し、TikTok Shopのエクスポートデータをクレンジング・変換。',
        'viewsとlikesの指標で発生していた二重集計のバグを特定・修正し、クリエイターのパフォーマンスデータが重複して計上される問題を解消。',
        '派生指標（GMV、Conversion Rate、GMV per View、Engagement Rate）と、外れ値に強いパーセンタイル順位ベースのクリエイタースコアリングを設計。',
        'GMVとキャンペーン成果をリアルタイムで把握できる全5ページのインタラクティブなBIダッシュボード（Streamlit + Plotly）を構築・公開。Overview、Campaign & Products、Creator Intelligence、Risk & Anomalies、AI Insightsの5ページで構成。',
        'Gemini AI APIを連携し、月次パフォーマンスのサマリーをもとに戦略分析と30日間のアクションプランを自動生成。',
      ],
    },
    stack: [
      {
        group: { id: 'Data & analitik', en: 'Data & analytics', ja: 'データ・分析' },
        items: [
          { name: 'Python', icon: pythonIcon },
          { name: 'Pandas', icon: pandasIcon },
          { name: 'NumPy', icon: numpyIcon },
          { name: 'Excel (openpyxl)', icon: excelIcon },
        ],
      },
      {
        group: { id: 'Dashboard & AI', en: 'Dashboard & AI', ja: 'ダッシュボード・AI' },
        items: [
          { name: 'Streamlit', icon: streamlitIcon },
          { name: 'Plotly', icon: plotlyIcon },
          { name: 'Gemini API', icon: geminiIcon },
        ],
      },
      {
        group: { id: 'Alat & deploy', en: 'Tools & deployment', ja: 'ツール・デプロイ' },
        items: [
          { name: 'Git', icon: gitIcon },
          { name: 'Streamlit Cloud', icon: streamlitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Memahami data', en: 'Understanding the data', ja: 'データの把握' },
        text: {
          id: 'Mempelajari laporan ekspor TikTok Shop (campaign, creator, video, produk) dan menentukan pertanyaan bisnis yang harus dijawab.',
          en: 'Studied the TikTok Shop export report (campaigns, creators, videos, products) and defined the business questions to answer.',
          ja: 'TikTok Shopのエクスポートデータ（キャンペーン、クリエイター、動画、商品）を分析し、答えるべきビジネス課題を定義。',
        },
      },
      {
        title: { id: 'ETL & pembersihan', en: 'ETL & cleaning', ja: 'ETL・データクレンジング' },
        text: {
          id: 'Mengubah format Rupiah dan durasi, menormalkan teks, lalu deduplikasi di tingkat video untuk memperbaiki views dan likes yang terhitung ganda.',
          en: 'Parsed Rupiah and duration formats, normalized text, then deduplicated at the video level to fix double-counted views and likes.',
          ja: 'ルピア表記や再生時間を変換し、テキストを正規化。動画単位で重複を除き、再生数といいね数の二重計上を修正。',
        },
      },
      {
        title: { id: 'Metrik & skor kreator', en: 'Metrics & creator scores', ja: '指標・クリエイタースコア' },
        text: {
          id: 'Merancang GMV, conversion rate, GMV per view, engagement rate, dan skor kreator berbasis percentile rank yang tahan outlier.',
          en: 'Designed GMV, conversion rate, GMV per view, engagement rate, and an outlier-resistant, percentile-rank creator score.',
          ja: 'GMV、コンバージョン率、再生あたりGMV、エンゲージメント率と、外れ値に強いパーセンタイル順位ベースのクリエイタースコアを設計。',
        },
      },
      {
        title: { id: 'Desain dashboard', en: 'Dashboard design', ja: 'ダッシュボード設計' },
        text: {
          id: 'Lima halaman (Overview, Campaign & Produk, Creator Intelligence, Risk & Anomali, AI Insights) dengan filter sidebar dan tema terang/gelap.',
          en: 'Five pages (Overview, Campaigns & Products, Creator Intelligence, Risk & Anomalies, AI Insights) with sidebar filters and light/dark themes.',
          ja: '5ページ構成（概要、キャンペーン・商品、クリエイター分析、リスク・異常、AIインサイト）に、サイドバーのフィルターとライト/ダークテーマを搭載。',
        },
      },
      {
        title: { id: 'Analisis risiko', en: 'Risk analysis', ja: 'リスク分析' },
        text: {
          id: 'Konsentrasi GMV (Pareto), kreator tanpa penjualan, video bermasalah, dan campaign berkinerja rendah, ditambah daftar hidden gems.',
          en: 'GMV concentration (Pareto), creators with zero sales, problem videos, and low-performing campaigns, plus a list of hidden gems.',
          ja: 'GMVの集中度（パレート分析）、売上ゼロのクリエイター、問題のある動画、成果の低いキャンペーンを可視化し、有望なクリエイターも抽出。',
        },
      },
      {
        title: { id: 'AI Insights', en: 'AI insights', ja: 'AIインサイト' },
        text: {
          id: 'Gemini API membuat insight singkat, rencana aksi 30 hari, dan saran coaching untuk kreator.',
          en: 'The Gemini API generates quick insights, a 30-day action plan, and coaching tips for creators.',
          ja: 'Gemini APIで、要点のまとめ、30日間のアクションプラン、クリエイター向けのコーチング案を自動生成。',
        },
      },
      {
        title: { id: 'Deploy', en: 'Deployment', ja: 'デプロイ' },
        text: {
          id: 'Dihosting di Streamlit Cloud dengan API key tersimpan aman di secrets dan dataset yang termuat otomatis.',
          en: 'Hosted on Streamlit Cloud, with the API key kept safely in secrets and the dataset loaded automatically.',
          ja: 'Streamlit Cloudで公開し、APIキーはsecretsで安全に管理、データセットは自動で読み込み。',
        },
      },
    ],
    thumb: kolThumb,
    techStack: [
      { name: 'Python', icon: pythonIcon },
      { name: 'Streamlit', icon: streamlitIcon },
      { name: 'Excel', icon: excelIcon },
    ],
    demoHref: 'https://dashboard-savvy.streamlit.app/',
    codeHref: 'https://github.com/joseparhusip/dashboard-savvy',
  },
  {
    title: 'Mobile JEC',
    category: { id: 'Aplikasi Mobile', en: 'Mobile App', ja: 'モバイルアプリ' },
    desc: {
      id: [
        'Mengumpulkan data melalui kuesioner ke pengguna baru non-JEC sebagai dasar analisis kebutuhan aplikasi.',
        'Merancang UI aplikasi di Figma serta mendokumentasikan arsitektur sistem melalui Use Case, Activity, Class Diagram, dan ERD.',
        'Membangun backend menggunakan Node.js & Express.js untuk mendukung komunikasi data antara aplikasi dan server.',
        'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi data pengguna.',
        'Merancang database relasional menggunakan MySQL dengan metode pengembangan sistem Waterfall yang diintegrasikan pendekatan User-Centered Design (UCD).',
        'Mengimplementasikan UI ke aplikasi Android menggunakan Flutter & Dart, termasuk fitur OCR untuk membaca data KTP secara otomatis saat pendaftaran, serta login dengan akun Google.',
      ],
      en: [
        'Collected data through questionnaires with new non-JEC users as the basis for analyzing the app\'s requirements.',
        'Designed the app UI in Figma and documented the system architecture with Use Case, Activity, and Class Diagrams and an ERD.',
        'Built the backend with Node.js & Express.js to handle data communication between the app and the server.',
        'Implemented the authentication (auth) system and app security features to protect user data.',
        'Designed a relational MySQL database using the Waterfall development method combined with a User-Centered Design (UCD) approach.',
        'Implemented the UI as an Android app with Flutter & Dart, including an OCR feature that automatically reads ID card (KTP) data during registration, plus sign-in with a Google account.',
      ],
      ja: [
        'アプリの要件分析の土台として、JECを利用したことのない新規ユーザーを対象にアンケートを実施し、データを収集。',
        'FigmaでアプリのUIを設計し、ユースケース図、アクティビティ図、クラス図、ERDでシステム構成を文書化。',
        'Node.js & Express.jsでバックエンドを構築し、アプリとサーバー間のデータ通信を実装。',
        'ユーザーデータを保護するため、認証（auth）機能とアプリのセキュリティ機能を実装。',
        'ウォーターフォール型の開発手法にユーザー中心設計（UCD）のアプローチを組み合わせ、MySQLでリレーショナルデータベースを設計。',
        'Flutter & DartでUIをAndroidアプリとして実装。登録時にKTP（身分証明書）の情報を自動で読み取るOCR機能や、Googleアカウントでのログインにも対応。',
      ],
    },
    stack: [
      {
        group: 'Mobile',
        items: [
          { name: 'Flutter', icon: flutterMarkIcon },
          { name: 'Dart', icon: dartIcon },
          { name: 'Google Sign-In', icon: googleIcon },
          { name: 'Google Maps', icon: mapsIcon },
          { name: 'Firebase (FCM)', icon: firebaseIcon },
          { name: 'PDF', icon: pdfIcon },
        ],
      },
      {
        group: 'Backend',
        items: [
          { name: 'Node.js', icon: nodeMarkIcon },
          { name: 'Express', icon: expressIcon },
          { name: 'MySQL', icon: mysqlMarkIcon },
          { name: 'JWT', icon: jwtIcon },
          { name: 'Nodemailer (OTP)', icon: gmailIcon },
        ],
      },
      {
        group: { id: 'AI & pengolahan citra', en: 'AI & image processing', ja: 'AI・画像処理' },
        items: [
          { name: 'Tesseract OCR', icon: ocrIcon },
          { name: 'face-api (TensorFlow.js)', icon: tensorflowIcon },
          { name: 'Gemini API', icon: geminiIcon },
        ],
      },
      {
        group: { id: 'Desain & alat', en: 'Design & tools', ja: 'デザイン・ツール' },
        items: [
          { name: 'Figma', icon: figmaIcon },
          { name: 'Postman', icon: postmanIcon },
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Riset pengguna', en: 'User research', ja: 'ユーザー調査' },
        text: {
          id: 'Kuesioner untuk calon pengguna non-JEC dengan metode Waterfall dan User-Centered Design (UCD).',
          en: 'Questionnaires for prospective non-JEC users, using the Waterfall method with User-Centered Design (UCD).',
          ja: 'ウォーターフォール型とユーザー中心設計（UCD）を組み合わせ、JECを未利用の見込みユーザーにアンケートを実施。',
        },
      },
      {
        title: { id: 'Pemodelan sistem', en: 'System modeling', ja: 'システム設計' },
        text: {
          id: 'Use case, activity, dan class diagram serta ERD sebagai dasar arsitektur aplikasi.',
          en: 'Use case, activity, and class diagrams plus an ERD as the foundation of the architecture.',
          ja: 'ユースケース図、アクティビティ図、クラス図、ERDを作成し、アーキテクチャの土台を設計。',
        },
      },
      {
        title: { id: 'Desain UI', en: 'UI design', ja: 'UIデザイン' },
        text: {
          id: 'Mendesain alur dan tampilan aplikasi pasien di Figma.',
          en: 'Designed the patient app flows and screens in Figma.',
          ja: '患者向けアプリの画面遷移とUIをFigmaでデザイン。',
        },
      },
      {
        title: { id: 'Backend REST API', en: 'REST API backend', ja: 'REST APIの構築' },
        text: {
          id: 'Node.js + Express dengan MySQL untuk booking, apotek, invoice, notifikasi, dan konten.',
          en: 'Node.js + Express with MySQL for booking, pharmacy, invoices, notifications, and content.',
          ja: 'Node.js + ExpressとMySQLで、予約、薬局、請求書、通知、コンテンツのAPIを構築。',
        },
      },
      {
        title: { id: 'Autentikasi berlapis', en: 'Layered authentication', ja: '多層認証' },
        text: {
          id: 'Login email dengan OTP, Google Sign-In, login wajah, reset password, dan OCR KTP saat registrasi.',
          en: 'Email login with OTP, Google Sign-In, face login, password reset, and ID card (KTP) OCR at registration.',
          ja: 'OTP付きメールログイン、Googleログイン、顔認証ログイン、パスワード再設定、登録時のKTP（身分証）OCRを実装。',
        },
      },
      {
        title: { id: 'Fitur aplikasi', en: 'App features', ja: 'アプリ機能' },
        text: {
          id: 'Booking dokter, LASIK/FLACS, apotek online, invoice PDF, notifikasi FCM, chatbot AI, dan tes mata mandiri.',
          en: 'Doctor booking, LASIK/FLACS, an online pharmacy, PDF invoices, FCM notifications, an AI chatbot, and self eye tests.',
          ja: '医師の予約、LASIK/FLACS、オンライン薬局、PDF請求書、FCM通知、AIチャットボット、セルフ視力検査を実装。',
        },
      },
      {
        title: { id: 'Pengujian', en: 'Testing', ja: 'テスト' },
        text: {
          id: 'Black Box Testing dan System Usability Scale (SUS) pada 120 responden dengan skor rata-rata 79.',
          en: 'Black Box Testing and a System Usability Scale (SUS) study with 120 respondents, averaging a score of 79.',
          ja: 'ブラックボックステストと、120名を対象としたSUS（システムユーザビリティ尺度）評価で平均79点を獲得。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Autentikasi', en: 'Authentication', ja: '認証' },
        routes: [
          ['POST', '/api/auth/register'],
          ['POST', '/api/auth/scan-ktp'],
          ['POST', '/api/auth/login'],
          ['POST', '/api/auth/google-login'],
          ['POST', '/api/auth/login-face'],
          ['POST', '/api/auth/{forgot-password, verify-otp, reset-password}'],
          ['POST', '/api/auth/resend-otp'],
          ['POST', '/api/auth/update-fcm-token'],
        ],
      },
      {
        group: { id: 'Booking & layanan', en: 'Booking & services', ja: '予約・サービス' },
        routes: [
          ['GET', '/api/booking/doctors'],
          ['GET', '/api/booking/doctors/:id'],
          ['GET', '/api/booking/booked-slots'],
          ['GET', '/api/booking/my-bookings'],
          ['POST', '/api/booking/create'],
          ['GET', '/api/{lasik, flacs}'],
          ['GET', '/api/{lasik, flacs}/doctors/:branchId'],
          ['POST', '/api/{lasik, flacs}/booking'],
          ['GET', '/api/layanan'],
        ],
      },
      {
        group: { id: 'Apotek & pesanan', en: 'Pharmacy & orders', ja: '薬局・注文' },
        routes: [
          ['GET', '/api/apotik/obat'],
          ['GET · POST', '/api/cart'],
          ['PUT · DELETE', '/api/cart/:cart_id'],
          ['POST', '/api/cart/checkout'],
          ['PUT', '/api/cart/payment-confirm/:pesanan_id'],
          ['GET', '/api/pesanan'],
          ['GET', '/api/pesanan/:id/status'],
          ['GET', '/api/invoice/{detail, download}/:type/:id'],
        ],
      },
      {
        group: { id: 'Akun & notifikasi', en: 'Account & notifications', ja: 'アカウント・通知' },
        routes: [
          ['GET · PUT', '/api/profile'],
          ['POST', '/api/profile/upload-image'],
          ['GET', '/api/notifications/inbox'],
          ['PUT', '/api/notifications/:id/read'],
          ['GET', '/api/coin/{status, history}'],
          ['POST', '/api/coin/claim/daily'],
        ],
      },
      {
        group: { id: 'Chatbot AI & konten', en: 'AI chatbot & content', ja: 'AIチャットボット・コンテンツ' },
        routes: [
          ['GET', '/api/chatbot/history'],
          ['POST', '/api/chatbot/send'],
          ['DELETE', '/api/chatbot/clear'],
          ['GET', '/api/{promos, events, videos, journals, testimonials}'],
          ['GET', '/api/{fasilitas, lokasi, asuransi, penghargaan}'],
        ],
      },
    ],
    thumb: mobileJecThumb,
    techStack: [
      { name: 'Flutter', icon: flutterIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
      { name: 'Google Login', icon: googleIcon },
    ],
    demoHref: 'https://drive.google.com/file/d/1oze0Swrzc9JgRU-l0gX_ZiuBRP6WWuNV/view?usp=sharing',
    codeHref: 'https://github.com/joseparhusip/application_jec',
  },
  {
    title: 'Dashboard JEC',
    category: { id: 'Web Admin', en: 'Web Admin', ja: 'Web管理画面' },
    desc: {
      id: [
        'Merancang dan mengembangkan antarmuka admin dashboard menggunakan React JS untuk mengelola data pasien, jadwal, dan operasional klinik secara terpusat.',
        'Membangun backend menggunakan Node.js & Express.js, satu ekosistem yang sama dengan backend Mobile JEC, untuk mendukung komunikasi data antara dashboard dan server.',
        'Mengimplementasikan sistem autentikasi (auth) dan fitur keamanan aplikasi untuk melindungi akses data admin.',
        'Menggunakan database relasional MySQL yang sama dan terintegrasi dengan aplikasi Mobile JEC, sehingga data pasien dan operasional tetap konsisten di kedua platform.',
        'Menyediakan tampilan ringkas berupa statistik, antrian pasien, dan manajemen data secara terpusat untuk mempermudah operasional klinik sehari-hari.',
      ],
      en: [
        'Designed and developed the admin dashboard interface with React JS to manage patient data, schedules, and clinic operations in one place.',
        'Built the backend with Node.js & Express.js, in the same ecosystem as the Mobile JEC backend, to handle data communication between the dashboard and the server.',
        'Implemented the authentication (auth) system and app security features to protect access to admin data.',
        'Used the same relational MySQL database, integrated with the Mobile JEC app, so patient and operational data stay consistent across both platforms.',
        'Provided a concise view of statistics, the patient queue, and centralized data management to simplify day-to-day clinic operations.',
      ],
      ja: [
        '患者データ、診療スケジュール、クリニックの運営を一元管理する管理者向けダッシュボードの画面を、React JSで設計・開発。',
        'Mobile JECと同じエコシステムで、Node.js & Express.jsによるバックエンドを構築し、ダッシュボードとサーバー間のデータ通信を実装。',
        '管理者データへのアクセスを保護するため、認証（auth）機能とアプリのセキュリティ機能を実装。',
        'Mobile JECアプリと共通のMySQLリレーショナルデータベースを連携させ、患者データと運営データを両プラットフォームで一貫して管理。',
        '統計情報、患者の受付待ち状況、データの一元管理をわかりやすくまとめた画面を用意し、日々のクリニック運営を効率化。',
      ],
    },
    stack: [
      {
        group: 'Frontend',
        items: [
          { name: 'React', icon: reactIcon },
          { name: 'Vite', icon: viteIcon },
          { name: 'React Router', icon: reactIcon },
          { name: 'Recharts', icon: rechartsIcon },
          { name: 'Leaflet', icon: leafletIcon },
          { name: 'jsPDF', icon: pdfIcon },
          { name: 'SheetJS (Excel)', icon: excelIcon },
        ],
      },
      {
        group: 'Backend',
        items: [
          { name: 'Node.js', icon: nodeMarkIcon },
          { name: 'Express', icon: expressIcon },
          { name: 'MySQL', icon: mysqlMarkIcon },
          { name: 'JWT', icon: jwtIcon },
          { name: 'Nodemailer (OTP)', icon: gmailIcon },
        ],
      },
      {
        group: { id: 'Alat', en: 'Tools', ja: 'ツール' },
        items: [
          { name: 'Figma', icon: figmaIcon },
          { name: 'Postman', icon: postmanIcon },
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Kebutuhan admin', en: 'Admin requirements', ja: '管理者の要件' },
        text: {
          id: 'Memetakan data yang dikelola admin: pasien, dokter dan jadwal, obat, pesanan, booking, dan konten aplikasi.',
          en: 'Mapped the data admins manage: patients, doctors and schedules, medicines, orders, bookings, and app content.',
          ja: '管理者が扱うデータ（患者、医師とスケジュール、薬、注文、予約、アプリのコンテンツ）を整理。',
        },
      },
      {
        title: { id: 'Satu database', en: 'One shared database', ja: '共通データベース' },
        text: {
          id: 'Memakai backend dan database MySQL yang sama dengan Mobile JEC, jadi perubahan admin langsung tampil di aplikasi.',
          en: 'Shares the backend and MySQL database with Mobile JEC, so admin changes appear in the app right away.',
          ja: 'Mobile JECとバックエンド・MySQLデータベースを共有し、管理画面での変更がアプリに即時反映。',
        },
      },
      {
        title: { id: 'Dashboard & laporan', en: 'Dashboard & reports', ja: 'ダッシュボード・レポート' },
        text: {
          id: 'Statistik, aktivitas login, tindakan tertunda, dan layanan terpopuler, dengan ekspor PDF dan Excel.',
          en: 'Statistics, login activity, pending actions, and top services, with PDF and Excel exports.',
          ja: '統計、ログイン履歴、未対応のタスク、人気サービスを可視化し、PDF・Excelで出力。',
        },
      },
      {
        title: { id: 'Manajemen operasional', en: 'Operations management', ja: '業務管理' },
        text: {
          id: 'Dokter dan jadwal praktik, obat, pesanan dan status pembayaran, serta booking LASIK/FLACS.',
          en: 'Doctors and practice schedules, medicines, orders and payment status, and LASIK/FLACS bookings.',
          ja: '医師と診療スケジュール、薬、注文と支払いステータス、LASIK/FLACSの予約を管理。',
        },
      },
      {
        title: { id: 'Konten & lokasi', en: 'Content & locations', ja: 'コンテンツ・拠点' },
        text: {
          id: 'Promo, event, video, jurnal, testimoni, asuransi, fasilitas, dan peta cabang dengan Leaflet.',
          en: 'Promos, events, videos, journals, testimonials, insurance, facilities, and branch maps with Leaflet.',
          ja: 'プロモーション、イベント、動画、記事、口コミ、保険、施設、Leafletによる拠点マップを管理。',
        },
      },
      {
        title: { id: 'Akses & keamanan', en: 'Access & security', ja: 'アクセス・セキュリティ' },
        text: {
          id: 'Login admin dengan JWT, reset password lewat OTP email, dan manajemen akun admin.',
          en: 'Admin login with JWT, password reset via email OTP, and admin account management.',
          ja: 'JWTによる管理者ログイン、メールOTPでのパスワード再設定、管理者アカウントの管理を実装。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Autentikasi admin', en: 'Admin authentication', ja: '管理者認証' },
        routes: [
          ['POST', '/api/admin/auth/login'],
          ['POST', '/api/admin/auth/{forgot-password, verify-otp, reset-password}'],
          ['GET · PUT', '/api/admin/auth/profile'],
          ['GET · POST · PUT · DELETE', '/api/admin/manage'],
        ],
      },
      {
        group: { id: 'Beranda', en: 'Home dashboard', ja: 'ホーム' },
        routes: [
          ['GET', '/api/admin/beranda/stats'],
          ['GET', '/api/admin/beranda/{login-activity, recent-activity}'],
          ['GET', '/api/admin/beranda/{pending-actions, top-services}'],
          ['PUT', '/api/admin/beranda/process-action'],
        ],
      },
      {
        group: { id: 'Pasien, dokter & jadwal', en: 'Patients, doctors & schedules', ja: '患者・医師・スケジュール' },
        routes: [
          ['GET · POST · PUT · DELETE', '/api/admin/users'],
          ['GET · POST · PUT · DELETE', '/api/admin/dokter'],
          ['GET · POST · PUT · DELETE', '/api/admin/layanan-dokter/jadwal'],
          ['GET · PUT', '/api/admin/layanan-dokter/layanan/:dokter_id'],
        ],
      },
      {
        group: { id: 'Pesanan & booking', en: 'Orders & bookings', ja: '注文・予約' },
        routes: [
          ['GET', '/api/admin/pesanan'],
          ['GET', '/api/admin/pesanan/:id/detail'],
          ['PATCH', '/api/admin/pesanan/:id/{status, payment-status}'],
          ['GET · DELETE', '/api/admin/layanan/{lasik, flacs}'],
          ['PUT', '/api/admin/layanan/{lasik, flacs}/:id/status'],
          ['GET · PUT · DELETE', '/api/admin/{cart, coin}'],
        ],
      },
      {
        group: { id: 'Obat, fasilitas & konten', en: 'Medicines, facilities & content', ja: '薬・施設・コンテンツ' },
        routes: [
          ['GET · POST · PUT · DELETE', '/api/admin/obat'],
          ['GET · POST · PUT · DELETE', '/api/admin/{fasilitas, fasilitas-rs, maps}'],
          ['GET · POST · PUT · DELETE', '/api/admin/{promos, events, videos, journals}'],
          ['GET · POST · PUT · DELETE', '/api/admin/{testimonials, asuransi}'],
        ],
      },
    ],
    thumb: dashboardJecThumb,
    techStack: [
      { name: 'React', icon: reactIcon },
      { name: 'Node.js', icon: nodeIcon },
      { name: 'MySQL', icon: mysqlIcon },
    ],
    demoHref: 'https://administrator-jec.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/administrator-jec',
  },
  {
    title: 'Secura Kost',
    category: { id: 'Web App', en: 'Web App', ja: 'Webアプリ' },
    desc: {
      id: [
        'Mengembangkan prototype platform marketplace kost secara end-to-end, mencakup perancangan UI/UX, arsitektur komponen, dan alur navigasi antar halaman.',
        'Membangun frontend menggunakan React, React Router, dan CSS.',
        'Membangun sistem autentikasi dua peran (penyewa & pemilik kost) dengan tab switching dinamis dan validasi form interaktif.',
        'Mengimplementasikan fitur Virtual Tour 360° pada detail kost untuk meningkatkan transparansi dan kepercayaan pengguna.',
        'Merancang landing page responsif dengan komponen dinamis: hero carousel, grid solusi, timeline cara kerja, dan segmentasi target audiens.',
        'Membangun modul profil tim dengan struktur visual (tree layout) menggunakan komponen reusable.',
      ],
      en: [
        'Developed an end-to-end prototype of a boarding house (kost) marketplace platform, covering UI/UX design, component architecture, and navigation flow between pages.',
        'Built the frontend with React, React Router, and CSS.',
        'Built a two-role authentication system (tenants & property owners) with dynamic tab switching and interactive form validation.',
        'Implemented a 360° Virtual Tour feature on listing detail pages to increase transparency and user trust.',
        'Designed a responsive landing page with dynamic components: a hero carousel, solutions grid, how-it-works timeline, and target audience segments.',
        'Built a team profile module with a visual structure (tree layout) using reusable components.',
      ],
      ja: [
        '下宿（kost）マーケットプレイスのプロトタイプをエンドツーエンドで開発。UI/UXデザイン、コンポーネント設計、ページ間のナビゲーションフローまでを担当。',
        'React、React Router、CSSでフロントエンドを構築。',
        '入居者と物件オーナーの2つのロールに対応した認証機能を構築し、動的なタブ切り替えとインタラクティブなフォームバリデーションを実装。',
        '物件詳細ページに360°バーチャルツアー機能を実装し、情報の透明性とユーザーからの信頼を向上。',
        'ヒーローカルーセル、ソリューション一覧のグリッド、利用の流れを示すタイムライン、ターゲット層別の紹介など、動的なコンポーネントで構成したレスポンシブなランディングページを設計。',
        '再利用可能なコンポーネントを用いて、メンバー構成をツリー形式で可視化するチーム紹介モジュールを構築。',
      ],
    },
    thumb: securaKostThumb,
    shots: [
      { src: securaKostThumb, caption: { id: 'Landing page', en: 'Landing page', ja: 'ランディングページ' } },
      { src: securaKostShotCari, caption: { id: 'Cari kost dengan filter & smart matching', en: 'Kost search with filters & smart matching', ja: 'フィルターとスマートマッチングによる物件検索' } },
      { src: securaKostShotDetail, caption: { id: 'Detail kost dengan Virtual Tour 360°', en: 'Listing detail with a 360° Virtual Tour', ja: '360°バーチャルツアー付きの物件詳細' } },
      { src: securaKostShotPengajuan, caption: { id: 'Form pengajuan sewa', en: 'Rental application form', ja: '入居申込フォーム' } },
      { src: securaKostShotEdukasi, caption: { id: 'Edukasi hukum penyewa', en: 'Tenant legal education', ja: '入居者向けの法律ガイド' } },
      { src: securaKostShotDashboard, caption: { id: 'Dashboard pemilik kost', en: 'Owner dashboard', ja: 'オーナー用ダッシュボード' } },
      { src: securaKostShotKostSaya, caption: { id: 'Kelola kost saya', en: 'Manage my listings', ja: '自分の物件の管理' } },
      { src: securaKostShotKontrak, caption: { id: 'Kontrak digital', en: 'Digital contracts', ja: '電子契約' } },
      { src: securaKostShotEscrow, caption: { id: 'Escrow & deposit', en: 'Escrow & deposits', ja: 'エスクローと預かり金' } },
      { src: securaKostShotMediasi, caption: { id: 'Mediasi konflik', en: 'Conflict mediation', ja: 'トラブル調停' } },
    ],
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    stack: [
      {
        group: 'Frontend',
        items: [
          { name: 'React', icon: reactIcon },
          { name: 'React Router', icon: reactIcon },
          { name: 'Vite', icon: viteIcon },
          { name: 'CSS', icon: cssIcon },
        ],
      },
      {
        group: { id: 'Alat & deploy', en: 'Tools & deploy', ja: 'ツール・デプロイ' },
        items: [
          { name: 'Git', icon: gitIcon },
          { name: 'Vercel', icon: vercelIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Landing page', en: 'Landing page', ja: 'ランディングページ' },
        text: {
          id: 'Hero carousel, solusi, cara kerja, segmentasi target, dan halaman tim dengan tree layout.',
          en: 'Hero carousel, solutions, how it works, target segments, and a team page with a tree layout.',
          ja: 'ヒーローカルーセル、ソリューション、利用の流れ、ターゲット層、ツリー形式のチーム紹介ページを制作。',
        },
      },
      {
        title: { id: 'Autentikasi dua peran', en: 'Two-role authentication', ja: '2ロール認証' },
        text: {
          id: 'Masuk dan daftar untuk penyewa atau pemilik kost dengan tab dinamis dan validasi form.',
          en: 'Sign in and sign up as a tenant or an owner, with dynamic tabs and form validation.',
          ja: '入居者とオーナーのログイン・登録を、動的タブとフォームバリデーションで実装。',
        },
      },
      {
        title: { id: 'Cari & detail kost', en: 'Search & listing detail', ja: '検索・物件詳細' },
        text: {
          id: 'Pencarian kost, detail dengan Virtual Tour 360° dan info deposit escrow.',
          en: 'Kost search, and a detail page with a 360° Virtual Tour and escrow deposit info.',
          ja: '物件検索と、360°バーチャルツアー・エスクロー預かり金の情報を備えた詳細ページ。',
        },
      },
      {
        title: { id: 'Pengajuan sewa', en: 'Rental application', ja: '入居申込' },
        text: {
          id: 'Form pengajuan sewa dengan tanda tangan digital lewat signature pad.',
          en: 'A rental application form with a digital signature pad.',
          ja: '署名パッドによる電子署名付きの入居申込フォーム。',
        },
      },
      {
        title: { id: 'Dashboard pemilik', en: 'Owner dashboard', ja: 'オーナー用ダッシュボード' },
        text: {
          id: 'Kelola kost (tambah, edit, lihat), penyewa aktif, kontrak digital, escrow deposit, mediasi konflik, dan pengaturan.',
          en: 'Manage listings (add, edit, view), active tenants, digital contracts, escrow deposits, conflict mediation, and settings.',
          ja: '物件の追加・編集・閲覧、入居者、電子契約、エスクロー預かり金、トラブル調停、設定を管理。',
        },
      },
      {
        title: { id: 'Edukasi hukum', en: 'Legal education', ja: '法律ガイド' },
        text: {
          id: 'Halaman edukasi hukum sewa-menyewa untuk penyewa dan pemilik.',
          en: 'A legal education page on renting for tenants and owners.',
          ja: '入居者とオーナー向けに賃貸に関する法律を解説するページ。',
        },
      },
    ],
    demoHref: 'https://secura-kost.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/secura-kost',
  },
  {
    title: 'Toko Kelontong Online',
    category: { id: 'E-commerce', en: 'E-commerce', ja: 'ECサイト' },
    desc: {
      id: [
        'Mengembangkan prototype website e-commerce "Toko Kelontong Online" secara end-to-end, mencakup UI/UX, struktur komponen, dan alur navigasi halaman.',
        'Membangun frontend menggunakan Vue.js (Composition API), Vue Router, dan CSS.',
        'Mengimplementasikan state management dengan Pinia untuk mengelola keranjang belanja dan filter kategori produk secara reaktif.',
        'Membangun katalog produk dinamis dengan filter kategori, fallback gambar error, dan format Rupiah otomatis.',
        'Merancang alur pemesanan lengkap dari katalog, detail pesanan, hingga riwayat pesanan pengguna.',
        'Membangun komponen reusable (navbar, footer, page header, promo banner, testimonial) untuk konsistensi desain.',
        'Menyusun halaman informasi pendukung (FAQ, cara pemesanan, kebijakan privasi, syarat & ketentuan, hubungi kami).',
      ],
      en: [
        'Developed an end-to-end prototype of the "Toko Kelontong Online" e-commerce website, covering UI/UX, component structure, and page navigation flow.',
        'Built the frontend with Vue.js (Composition API), Vue Router, and CSS.',
        'Implemented state management with Pinia to reactively manage the shopping cart and product category filters.',
        'Built a dynamic product catalog with category filters, fallbacks for broken images, and automatic Rupiah formatting.',
        'Designed the complete ordering flow, from the catalog and order details to the user\'s order history.',
        'Built reusable components (navbar, footer, page header, promo banner, testimonial) for design consistency.',
        'Created supporting information pages (FAQ, how to order, privacy policy, terms & conditions, contact us).',
      ],
      ja: [
        'ECサイト「Toko Kelontong Online」（オンラインの食料雑貨店）のプロトタイプをエンドツーエンドで開発。UI/UX、コンポーネント構成、ページ間のナビゲーションフローまでを担当。',
        'Vue.js（Composition API）、Vue Router、CSSでフロントエンドを構築。',
        'Piniaによる状態管理を実装し、ショッピングカートと商品カテゴリーのフィルターをリアクティブに管理。',
        'カテゴリーフィルター、画像読み込みエラー時の代替表示、ルピア表記の自動フォーマットを備えた動的な商品カタログを構築。',
        'カタログから注文詳細、ユーザーの注文履歴までの一連の注文フローを設計。',
        'デザインの一貫性を保つため、再利用可能なコンポーネント（ナビゲーションバー、フッター、ページヘッダー、プロモーションバナー、お客様の声）を構築。',
        'よくある質問、注文方法、プライバシーポリシー、利用規約、お問い合わせといった補足情報ページを作成。',
      ],
    },
    thumb: tokoKelontongThumb,
    shots: [
      { src: tokoKelontongThumb, caption: { id: 'Beranda dengan promo & kategori', en: 'Home with promos & categories', ja: 'プロモーションとカテゴリーのあるホーム' } },
      { src: tokoKelontongShotProduk, caption: { id: 'Katalog produk terlaris', en: 'Best-selling product catalog', ja: '売れ筋商品のカタログ' } },
      { src: tokoKelontongShotCaraPesan, caption: { id: 'Cara pemesanan', en: 'How to order', ja: '注文方法' } },
      { src: tokoKelontongShotFaq, caption: { id: 'FAQ', en: 'FAQ', ja: 'よくある質問' } },
      { src: tokoKelontongShotRiwayat, caption: { id: 'Riwayat pesanan', en: 'Order history', ja: '注文履歴' } },
      { src: tokoKelontongShotTentang, caption: { id: 'Tentang kami', en: 'About us', ja: '会社概要' } },
      { src: tokoKelontongShotKontak, caption: { id: 'Hubungi kami', en: 'Contact us', ja: 'お問い合わせ' } },
    ],
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    stack: [
      {
        group: 'Frontend',
        items: [
          { name: 'Vue.js', icon: vueIcon },
          { name: 'Vue Router', icon: vueIcon },
          { name: 'Pinia', icon: piniaIcon },
          { name: 'Vite', icon: viteIcon },
          { name: 'CSS', icon: cssIcon },
        ],
      },
      {
        group: { id: 'Integrasi', en: 'Integrations', ja: '連携' },
        items: [
          { name: 'Midtrans Snap', icon: midtransIcon },
          { name: 'Vercel Functions', icon: vercelIcon },
          { name: 'Open Food Facts API', icon: apiIcon },
        ],
      },
      {
        group: { id: 'Alat', en: 'Tools', ja: 'ツール' },
        items: [
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Katalog produk', en: 'Product catalog', ja: '商品カタログ' },
        text: {
          id: 'Harga dari katalog toko, foto dan merek asli dari Open Food Facts dengan cache 24 jam, retry, dan fallback.',
          en: 'Prices from the store catalog, real photos and brands from Open Food Facts with a 24-hour cache, retry, and fallback.',
          ja: '価格は店舗カタログから、商品写真とブランドはOpen Food Factsから取得し、24時間キャッシュ・リトライ・フォールバックを実装。',
        },
      },
      {
        title: { id: 'Filter & pencarian', en: 'Filters & search', ja: 'フィルター・検索' },
        text: {
          id: 'Filter kategori dan pencarian reaktif dengan Pinia.',
          en: 'Reactive category filters and search with Pinia.',
          ja: 'Piniaでカテゴリーフィルターと検索をリアクティブに管理。',
        },
      },
      {
        title: { id: 'Keranjang', en: 'Cart', ja: 'カート' },
        text: {
          id: 'Cart drawer dengan stepper jumlah, disimpan di localStorage.',
          en: 'A cart drawer with a quantity stepper, persisted in localStorage.',
          ja: '数量ステッパー付きのカートドロワーを実装し、localStorageに保存。',
        },
      },
      {
        title: { id: 'Checkout Midtrans', en: 'Midtrans checkout', ja: 'Midtrans決済' },
        text: {
          id: 'Serverless function membuat token Snap, lalu popup pembayaran Midtrans terbuka.',
          en: 'A serverless function creates a Snap token, then the Midtrans payment popup opens.',
          ja: 'サーバーレス関数でSnapトークンを発行し、Midtransの決済ポップアップを表示。',
        },
      },
      {
        title: { id: 'Riwayat pesanan', en: 'Order history', ja: '注文履歴' },
        text: {
          id: 'Riwayat dan detail pesanan, termasuk bayar ulang pesanan yang masih pending.',
          en: 'Order history and details, including paying again for pending orders.',
          ja: '注文履歴と詳細を表示し、支払い待ちの注文は再決済が可能。',
        },
      },
      {
        title: { id: 'Halaman informasi', en: 'Info pages', ja: '情報ページ' },
        text: {
          id: 'FAQ, cara pemesanan, kebijakan privasi, syarat & ketentuan, hubungi kami, dan tentang kami.',
          en: 'FAQ, how to order, privacy policy, terms & conditions, contact us, and about us.',
          ja: 'よくある質問、注文方法、プライバシーポリシー、利用規約、お問い合わせ、会社概要を作成。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Serverless (Vercel)', en: 'Serverless (Vercel)', ja: 'サーバーレス（Vercel）' },
        routes: [
          ['POST', '/api/checkout'],
        ],
      },
      {
        group: { id: 'Midtrans Snap', en: 'Midtrans Snap', ja: 'Midtrans Snap' },
        routes: [
          ['POST', '/snap/v1/transactions'],
        ],
      },
      {
        group: { id: 'Open Food Facts', en: 'Open Food Facts', ja: 'Open Food Facts' },
        routes: [
          ['GET', '/api/v2/search'],
          ['GET', '/api/v2/product/:barcode'],
        ],
      },
    ],
    demoHref: 'https://toko-kelontong-online.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/toko-kelontong-online',
  },
  {
    title: 'Kindle Coffee',
    category: { id: 'Landing Page', en: 'Landing Page', ja: 'ランディングページ' },
    desc: {
      id: [
        'Mengembangkan prototype front end website coffee shop "Kindle Coffee" secara end-to-end, mencakup UI/UX, struktur komponen, dan alur navigasi antar halaman (Home, Menu, Cart, History, About). Proyek ini murni prototype tampilan, belum terhubung ke backend/server sungguhan.',
        'Membangun frontend menggunakan Vue.js (Composition API, Vue Router) dan CSS untuk seluruh tampilan.',
        'Mengimplementasikan state management dengan Pinia untuk mengelola keranjang belanja, pemilihan meja/kursi, dan riwayat pesanan secara reaktif.',
        'Membangun halaman Menu dengan filter kategori produk serta katalog dinamis menggunakan komponen ProductCard yang reusable.',
        'Merancang alur pemesanan pada halaman Cart, mencakup pemilihan nomor meja/kursi interaktif dan simulasi checkout (integrasi UI Midtrans Snap sebagai contoh alur pembayaran, tanpa backend nyata).',
        'Membangun halaman Riwayat Pesanan dengan filter rentang tanggal, status pesanan pending dengan countdown, serta fitur cetak struk/invoice ke PDF menggunakan jsPDF.',
        'Menyusun halaman Home dan About sebagai landing page dengan hero section, value proposition, dan testimoni untuk memperkuat identitas brand.',
      ],
      en: [
        'Developed an end-to-end front-end prototype of the "Kindle Coffee" coffee shop website, covering UI/UX, component structure, and navigation between pages (Home, Menu, Cart, History, About). This project is a UI-only prototype and is not yet connected to a real backend/server.',
        'Built the frontend with Vue.js (Composition API, Vue Router) and CSS for the entire interface.',
        'Implemented state management with Pinia to reactively manage the shopping cart, table/seat selection, and order history.',
        'Built the Menu page with product category filters and a dynamic catalog using a reusable ProductCard component.',
        'Designed the ordering flow on the Cart page, including interactive table/seat number selection and a simulated checkout (a Midtrans Snap UI integration as a sample payment flow, without a real backend).',
        'Built the Order History page with a date range filter, pending order status with a countdown, and receipt/invoice printing to PDF using jsPDF.',
        'Created the Home and About pages as a landing page with a hero section, value proposition, and testimonials to strengthen the brand identity.',
      ],
      ja: [
        'カフェ「Kindle Coffee」のWebサイトのフロントエンドのプロトタイプをエンドツーエンドで開発。UI/UX、コンポーネント構成、ページ間のナビゲーション（Home、Menu、Cart、History、About）までを担当。画面のみのプロトタイプで、実際のバックエンド／サーバーとは未接続。',
        '画面全体をVue.js（Composition API、Vue Router）とCSSで構築。',
        'Piniaによる状態管理を実装し、ショッピングカート、テーブル・座席の選択、注文履歴をリアクティブに管理。',
        '商品カテゴリーのフィルターと、再利用可能なProductCardコンポーネントによる動的なカタログを備えたMenuページを構築。',
        'Cartページの注文フローを設計。テーブル・座席番号をインタラクティブに選べる機能と、チェックアウトのシミュレーション（決済フローの例としてMidtrans SnapのUIを組み込み、実際のバックエンドは不使用）を実装。',
        '期間指定フィルター、カウントダウン付きの支払い待ちステータス、jsPDFによるレシート・請求書のPDF出力機能を備えた注文履歴ページを構築。',
        'ブランドイメージを強化するため、ヒーローセクション、バリュープロポジション、お客様の声を盛り込んだHomeページとAboutページをランディングページとして制作。',
      ],
    },
    thumb: kindleCoffeeThumb,
    shots: [
      { src: kindleCoffeeThumb, caption: { id: 'Beranda', en: 'Home', ja: 'ホーム' } },
      { src: kindleCoffeeShotCaraPesan, caption: { id: 'Cara pesan & lokasi kedai', en: 'How to order & shop location', ja: '注文方法と店舗の場所' } },
      { src: kindleCoffeeShotMenu, caption: { id: 'Menu dengan filter kategori', en: 'Menu with category filters', ja: 'カテゴリーフィルター付きのメニュー' } },
      { src: kindleCoffeeShotTentang, caption: { id: 'Tentang Kindle Coffee', en: 'About Kindle Coffee', ja: 'Kindle Coffeeについて' } },
    ],
    techStack: [
      { name: 'Vue.js', icon: vueIcon },
      { name: 'Tailwind CSS', icon: tailwindIcon },
    ],
    stack: [
      {
        group: 'Frontend',
        items: [
          { name: 'Vue.js', icon: vueIcon },
          { name: 'Vue Router', icon: vueIcon },
          { name: 'Pinia', icon: piniaIcon },
          { name: 'Vite', icon: viteIcon },
          { name: 'CSS', icon: cssIcon },
          { name: 'jsPDF', icon: pdfIcon },
        ],
      },
      {
        group: { id: 'Integrasi', en: 'Integrations', ja: '連携' },
        items: [
          { name: 'Midtrans Snap', icon: midtransIcon },
          { name: 'Vercel Functions', icon: vercelIcon },
        ],
      },
      {
        group: { id: 'Alat', en: 'Tools', ja: 'ツール' },
        items: [
          { name: 'Node.js (sharp)', icon: nodeMarkIcon },
          { name: 'Git', icon: gitIcon },
        ],
      },
    ],
    flow: [
      {
        title: { id: 'Aset & performa', en: 'Assets & performance', ja: 'アセット・パフォーマンス' },
        text: {
          id: 'Script Node + sharp untuk optimasi gambar menu, rute lazy-load, dan Snap.js dimuat hanya di halaman pembayaran.',
          en: 'Node + sharp scripts to optimize menu images, lazy-loaded routes, and Snap.js loaded only on payment pages.',
          ja: 'Node + sharpでメニュー画像を最適化し、ルートを遅延読み込み、Snap.jsは決済ページでのみ読み込み。',
        },
      },
      {
        title: { id: 'Menu', en: 'Menu', ja: 'メニュー' },
        text: {
          id: 'Filter kategori, pencarian, dan product sheet untuk detail produk.',
          en: 'Category filters, search, and a product sheet for item details.',
          ja: 'カテゴリーフィルター、検索、商品詳細シートを実装。',
        },
      },
      {
        title: { id: 'Keranjang & meja', en: 'Cart & table', ja: 'カート・席選択' },
        text: {
          id: 'Keranjang Pinia tersimpan di localStorage dan denah meja interaktif untuk memilih kursi.',
          en: 'A Pinia cart persisted in localStorage and an interactive floor map for picking a seat.',
          ja: 'localStorageに保存するPiniaのカートと、席を選べるインタラクティブな座席マップ。',
        },
      },
      {
        title: { id: 'Checkout Midtrans', en: 'Midtrans checkout', ja: 'Midtrans決済' },
        text: {
          id: 'Serverless function membuat token Snap, lalu popup pembayaran Midtrans terbuka (sandbox).',
          en: 'A serverless function creates a Snap token, then the Midtrans payment popup opens (sandbox).',
          ja: 'サーバーレス関数でSnapトークンを発行し、Midtransの決済ポップアップを表示（サンドボックス）。',
        },
      },
      {
        title: { id: 'Riwayat & struk', en: 'History & receipts', ja: '履歴・レシート' },
        text: {
          id: 'Filter rentang tanggal, countdown pesanan pending, dan cetak struk PDF dengan jsPDF.',
          en: 'Date range filters, a countdown for pending orders, and PDF receipts with jsPDF.',
          ja: '期間フィルター、支払い待ち注文のカウントダウン、jsPDFによるPDFレシート出力。',
        },
      },
      {
        title: { id: 'Status buka toko', en: 'Opening status', ja: '営業状況' },
        text: {
          id: 'Status buka/tutup real-time yang diperbarui otomatis berdasarkan jam operasional.',
          en: 'A live open/closed status that updates automatically from opening hours.',
          ja: '営業時間に合わせて自動更新される営業中・閉店のリアルタイム表示。',
        },
      },
    ],
    api: [
      {
        group: { id: 'Serverless (Vercel)', en: 'Serverless (Vercel)', ja: 'サーバーレス（Vercel）' },
        routes: [
          ['POST', '/api/checkout'],
        ],
      },
      {
        group: { id: 'Midtrans Snap', en: 'Midtrans Snap', ja: 'Midtrans Snap' },
        routes: [
          ['POST', '/snap/v1/transactions'],
        ],
      },
    ],
    demoHref: 'https://kindle-coffeeid.vercel.app/',
    codeHref: 'https://github.com/joseparhusip/kindle-coffee.id',
  },
]

const total = projects.length

const activeIndex = ref(0)
const activeProject = computed(() => projects[activeIndex.value])

function offsetOf(index) {
  let d = (index - activeIndex.value + total) % total
  if (d > total / 2) d -= total
  return d
}

function goTo(index) {
  activeIndex.value = (index + total) % total
}

function next() {
  goTo(activeIndex.value + 1)
}

function prev() {
  goTo(activeIndex.value - 1)
}

function onSlideClick(index) {
  if (index === activeIndex.value) openLightbox(projects[index])
  else goTo(index)
}

let pointerStartX = null
let pointerMoved = false

function onPointerDown(event) {
  pointerStartX = event.clientX
  pointerMoved = false
}

function onPointerUp(event) {
  if (pointerStartX === null) return
  const dx = event.clientX - pointerStartX
  pointerStartX = null
  if (Math.abs(dx) < 45) return
  pointerMoved = true
  if (dx < 0) next()
  else prev()
}

function onSlideClickGuarded(index) {
  if (pointerMoved) {
    pointerMoved = false
    return
  }
  onSlideClick(index)
}

const detailOpen = ref(false)
const detailTab = ref('summary')

const DETAIL_TABS = [
  { key: 'summary', label: { id: 'Ringkasan', en: 'Summary', ja: '概要' } },
  { key: 'stack', label: 'Tech stack' },
  { key: 'flow', label: { id: 'Alur', en: 'Process', ja: '開発の流れ' } },
  { key: 'api', label: 'API' },
]

const detailTabs = computed(() =>
  DETAIL_TABS.filter((tab) => tab.key === 'summary' || activeProject.value[tab.key]),
)


function toggleDetail() {
  detailOpen.value = !detailOpen.value
  if (detailOpen.value) detailTab.value = 'summary'
}

function onTabKeydown(event, index) {
  const tabs = detailTabs.value
  let next = -1
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.length - 1
  if (next < 0) return
  event.preventDefault()
  detailTab.value = tabs[next].key
  event.currentTarget.parentElement.children[next]?.focus()
}

watch(activeIndex, () => {
  detailOpen.value = false
  detailTab.value = 'summary'
})

const lightboxProject = ref(null)
const lightboxIndex = ref(0)

function shotsOf(project) {
  return project.shots || [{ src: project.thumb, caption: '' }]
}

const lightboxShots = computed(() => (lightboxProject.value ? shotsOf(lightboxProject.value) : []))
const lightboxShot = computed(() => lightboxShots.value[lightboxIndex.value])

function openLightbox(project) {
  lightboxIndex.value = 0
  lightboxProject.value = project
}

function closeLightbox() {
  lightboxProject.value = null
}

function stepLightbox(dir) {
  const n = lightboxShots.value.length
  lightboxIndex.value = (lightboxIndex.value + dir + n) % n
}

function preventImageAction(event) {
  event.preventDefault()
  return false
}

function hostLabel(project) {
  return project.internal ? t({ id: 'Proyek kontrak', en: 'Contract project', ja: '契約案件' }) : demoHost(project.demoHref)
}

function demoHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host === 'drive.google.com' ? 'APK · Google Drive' : host
  } catch {
    return ''
  }
}

const galleryEl = ref(null)

const galleryState = ref('folded')
let galleryOpenTimer = null

function openGallery() {
  galleryState.value = 'opening'
  galleryOpenTimer = setTimeout(() => (galleryState.value = 'open'), 1300)
}

onUnmounted(() => clearTimeout(galleryOpenTimer))

function onKeydown(event) {
  if (event.key === 'Escape') {
    if (lightboxProject.value) closeLightbox()
    else if (detailOpen.value) detailOpen.value = false
    return
  }
  if (lightboxProject.value) {
    if (lightboxShots.value.length > 1 && event.key === 'ArrowRight') stepLightbox(1)
    else if (lightboxShots.value.length > 1 && event.key === 'ArrowLeft') stepLightbox(-1)
    return
  }
  if (!galleryEl.value || !galleryEl.value.contains(document.activeElement)) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const AUTOPLAY_MS = 7000
const autoProgress = ref(0)
const galleryInView = ref(false)
const pointerInside = ref(false)
const focusInside = ref(false)
const autoPaused = computed(
  () =>
    !galleryInView.value ||
    pointerInside.value ||
    focusInside.value ||
    Boolean(lightboxProject.value) ||
    detailOpen.value,
)

let autoFrame = 0
let autoLast = 0
let autoObserver = null

function autoTick(now) {
  autoFrame = requestAnimationFrame(autoTick)
  const dt = Math.min(now - autoLast, 100)
  autoLast = now
  if (autoPaused.value || document.hidden) return
  autoProgress.value = Math.min(1, autoProgress.value + dt / AUTOPLAY_MS)
  if (autoProgress.value >= 1) next()
}

function startAuto() {
  if (autoFrame) return
  autoLast = performance.now()
  autoFrame = requestAnimationFrame(autoTick)
}

function stopAuto() {
  cancelAnimationFrame(autoFrame)
  autoFrame = 0
}

watch(activeIndex, () => (autoProgress.value = 0))

function onGalleryPointerEnter(event) {
  if (event.pointerType === 'mouse') pointerInside.value = true
}

function onGalleryPointerLeave(event) {
  if (event.pointerType === 'mouse') pointerInside.value = false
}

function onGalleryTouchStart() {
  pointerInside.value = true
}

function onGalleryTouchEnd() {
  pointerInside.value = false
}

function onGalleryFocusOut(event) {
  if (!galleryEl.value?.contains(event.relatedTarget)) focusInside.value = false
}

onMounted(() => {
  autoObserver = new IntersectionObserver(
    (entries) => {
      galleryInView.value = entries[0].isIntersecting
      if (galleryInView.value) startAuto()
      else stopAuto()
    },
    { threshold: 0.35 },
  )
  if (galleryEl.value) autoObserver.observe(galleryEl.value)
})

onUnmounted(() => {
  stopAuto()
  autoObserver?.disconnect()
})
</script>

<template>
  <section id="proyek" class="projects">
    <div class="container">
      <header class="section-head">
        <div class="section-head__meta">
          <span v-reveal class="section-label">
            <span class="section-label__num">03</span> {{ t({ id: 'Proyek', en: 'Projects', ja: 'プロジェクト' }) }}
          </span>
          <span v-reveal="80" class="section-head__note">
            {{ t({
              id: `${String(total).padStart(2, '0')} proyek terpilih`,
              en: `${String(total).padStart(2, '0')} selected projects`,
              ja: `厳選プロジェクト${total}件`,
            }) }}<br />Web · Mobile · Data
          </span>
        </div>
        <div class="section-head__main projects__head-main">
          <div>
            <h2 :key="lang" v-type="'proyek'" class="section-title">
              <template v-if="lang === 'en'">
                Things I've <span class="serif-accent">built</span>
              </template>
              <template v-else-if="lang === 'ja'">
                これまで<span class="serif-accent">つくってきた</span>もの
              </template>
              <template v-else>
                Karya yang pernah saya <span class="serif-accent">bangun</span>
              </template>
            </h2>
            <p v-reveal="160" class="section-lead projects__lead">
              {{ t({
                id: 'Kumpulan proyek yang menunjukkan cara saya berpikir, mulai dari menyusun struktur sampai menyelesaikan detail kecil.',
                en: 'A collection of projects that shows how I think, from setting up the structure to polishing the final details.',
                ja: '全体の構成づくりから細部の仕上げまで、私の考え方が伝わるプロジェクトをまとめました。',
              }) }}
            </p>
          </div>
          <a
            v-reveal="200"
            :href="moreProjectsHref"
            class="btn btn--ghost projects__more"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t({ id: 'Lihat proyek lainnya', en: 'View more projects', ja: 'ほかのプロジェクトを見る' }) }}
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            </svg>
          </a>
        </div>
      </header>

      <div
        ref="galleryEl"
        v-reveal.scale="{ delay: 120, onReveal: openGallery }"
        class="gallery"
        :class="{
          'gallery--folded': galleryState === 'folded',
          'gallery--opening': galleryState === 'opening',
        }"
        role="region"
        aria-roledescription="carousel"
        :aria-label="t({ id: 'Galeri proyek', en: 'Project gallery', ja: 'プロジェクトギャラリー' })"
        @pointerenter="onGalleryPointerEnter"
        @pointerleave="onGalleryPointerLeave"
        @touchstart.passive="onGalleryTouchStart"
        @touchend.passive="onGalleryTouchEnd"
        @touchcancel.passive="onGalleryTouchEnd"
        @focusin="focusInside = true"
        @focusout="onGalleryFocusOut"
      >
        <div
          class="gallery__stage"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="pointerStartX = null"
        >
          <button
            v-for="(project, index) in projects"
            :key="project.title"
            type="button"
            class="gallery__slide"
            :class="{
              'gallery__slide--active': offsetOf(index) === 0,
              'gallery__slide--hidden': Math.abs(offsetOf(index)) > 2,
              'gallery__slide--far': Math.abs(offsetOf(index)) === 2,
            }"
            :style="{ '--d': offsetOf(index), '--abs': Math.abs(offsetOf(index)) }"
            :tabindex="Math.abs(offsetOf(index)) > 1 ? -1 : 0"
            :aria-hidden="Math.abs(offsetOf(index)) > 2"
            :aria-current="offsetOf(index) === 0 ? 'true' : undefined"
            :data-cursor="offsetOf(index) === 0
              ? t({ id: 'Lihat', en: 'View', ja: '見る' })
              : t({ id: 'Pilih', en: 'Select', ja: '選ぶ' })"
            :aria-label="offsetOf(index) === 0
              ? t({ id: `Perbesar gambar ${project.title}`, en: `Enlarge ${project.title} image`, ja: `${project.title}の画像を拡大` })
              : t({ id: `Tampilkan proyek ${project.title}`, en: `Show ${project.title} project`, ja: `${project.title}を表示` })"
            @click="onSlideClickGuarded(index)"
            @contextmenu.prevent="preventImageAction"
          >
            <span class="gallery__chrome" aria-hidden="true">
              <span class="gallery__no">No. {{ String(index + 1).padStart(2, '0') }}</span>
              <span class="gallery__url">{{ hostLabel(project) }}</span>
              <span v-if="project.shots?.length > 1" class="gallery__shots">
                {{ t({
                  id: `${project.shots.length} foto`,
                  en: `${project.shots.length} photos`,
                  ja: `写真${project.shots.length}枚`,
                }) }}
              </span>
            </span>
            <span class="gallery__shot">
              <img
                :src="project.thumb"
                :alt="project.title"
                class="gallery__img"
                :loading="Math.abs(offsetOf(index)) <= 1 ? 'eager' : 'lazy'"
                draggable="false"
                @contextmenu.prevent="preventImageAction"
                @dragstart.prevent="preventImageAction"
              />
              <span v-if="offsetOf(index) === 0" class="gallery__zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </span>
          </button>
        </div>

        <div class="gallery__controls">
          <span class="gallery__counter mono-meta">
            No. <strong>{{ String(activeIndex + 1).padStart(2, '0') }}</strong>
            / {{ String(total).padStart(2, '0') }}
          </span>

          <div
            class="gallery__dots-nav"
            :class="{ 'is-paused': autoPaused }"
            role="tablist"
            :aria-label="t({ id: 'Pilih proyek', en: 'Select project', ja: 'プロジェクトを選択' })"
          >
            <button
              v-for="(project, index) in projects"
              :key="`dot-${project.title}`"
              type="button"
              role="tab"
              class="gallery__dot"
              :class="{ 'gallery__dot--active': index === activeIndex }"
              :style="index === activeIndex ? { '--fill': autoProgress } : null"
              :aria-selected="index === activeIndex"
              :aria-label="t({
                id: `Proyek ${index + 1}: ${project.title}`,
                en: `Project ${index + 1}: ${project.title}`,
                ja: `プロジェクト${index + 1}：${project.title}`,
              })"
              @click="goTo(index)"
            ></button>
          </div>

          <div class="gallery__arrows">
            <button type="button" class="btn-close gallery__arrow" :aria-label="t({ id: 'Proyek sebelumnya', en: 'Previous project', ja: '前のプロジェクト' })" @click="prev">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </button>
            <button type="button" class="btn-close gallery__arrow" :aria-label="t({ id: 'Proyek berikutnya', en: 'Next project', ja: '次のプロジェクト' })" @click="next">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <Transition name="info" mode="out-in">
          <div :key="activeProject.title" class="gallery__info" :aria-live="autoPaused ? 'polite' : 'off'">
            <div class="gallery__meta">
              <span class="gallery__num" aria-hidden="true">
                {{ String(activeIndex + 1).padStart(2, '0') }}
              </span>
              <span class="gallery__category">{{ t(activeProject.category) }}</span>
              <span v-if="!activeProject.internal" class="gallery__host">{{ demoHost(activeProject.demoHref) }}</span>
            </div>

            <div class="gallery__body">
              <h3 class="gallery__title">{{ activeProject.title }}</h3>
              <p class="gallery__summary">{{ t(activeProject.desc)[0] }}</p>

              <ul v-if="!activeProject.stack" class="gallery__stack" :aria-label="t({ id: 'Teknologi', en: 'Technologies', ja: '使用技術' })">
                <li v-for="tech in activeProject.techStack" :key="tech.name" class="gallery__chip">
                  {{ tech.name }}
                </li>
              </ul>

              <div class="gallery__actions">
                <button
                  type="button"
                  class="btn btn--ghost gallery__detail-btn"
                  :aria-expanded="detailOpen"
                  aria-controls="project-detail"
                  @click="toggleDetail"
                >
                  {{ detailOpen
                    ? t({ id: 'Tutup detail', en: 'Hide details', ja: '詳細を閉じる' })
                    : t({ id: 'Detail pengerjaan', en: 'Project details', ja: '担当内容を見る' }) }}
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    aria-hidden="true"
                    class="gallery__detail-icon"
                    :class="{ 'gallery__detail-icon--open': detailOpen }"
                  >
                    <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>

                <span v-if="activeProject.internal" class="gallery__private">
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
                  </svg>
                  <template v-if="lang === 'en'">Contract project · no public demo or code</template>
                  <template v-else-if="lang === 'ja'">契約案件 · デモ・コードは非公開</template>
                  <template v-else>Proyek kontrak · tanpa demo &amp; kode publik</template>
                </span>
                <a
                  v-if="!activeProject.internal"
                  :href="activeProject.codeHref"
                  class="gallery__icon-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="t({
                    id: `Kode sumber ${activeProject.title} di GitHub`,
                    en: `${activeProject.title} source code on GitHub`,
                    ja: `${activeProject.title}のソースコード（GitHub）`,
                  })"
                  :title="t({ id: 'Kode Sumber', en: 'Source Code', ja: 'ソースコード' })"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55
                         0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66
                         -1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94
                         .1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04
                         -.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0
                         c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04
                         0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1
                         0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"
                    />
                  </svg>
                </a>
                <a
                  v-if="!activeProject.internal"
                  :href="activeProject.demoHref"
                  class="btn btn--primary gallery__demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="t({
                    id: `Lihat demo ${activeProject.title}`,
                    en: `View ${activeProject.title} demo`,
                    ja: `${activeProject.title}のデモを見る`,
                  })"
                >
                  {{ t({ id: 'Lihat demo', en: 'View demo', ja: 'デモを見る' }) }}
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>

              <div
                id="project-detail"
                class="gallery__detail"
                :class="{ 'gallery__detail--open': detailOpen }"
                :aria-hidden="!detailOpen"
                :inert="!detailOpen"
              >
                <div class="gallery__detail-inner">
                  <div
                    v-if="detailTabs.length > 1"
                    class="detail-tabs"
                    role="tablist"
                    :aria-label="t({ id: 'Bagian detail proyek', en: 'Project detail sections', ja: 'プロジェクト詳細' })"
                  >
                    <button
                      v-for="(tab, index) in detailTabs"
                      :key="tab.key"
                      type="button"
                      role="tab"
                      class="detail-tabs__tab"
                      :class="{ 'is-active': detailTab === tab.key }"
                      :aria-selected="detailTab === tab.key"
                      :tabindex="detailTab === tab.key ? 0 : -1"
                      @click="detailTab = tab.key"
                      @keydown="onTabKeydown($event, index)"
                    >
                      {{ t(tab.label) }}
                    </button>
                  </div>

                  <template v-if="detailTab === 'summary'">
                  <span class="gallery__detail-eyebrow">{{ t({ id: 'Ringkasan pengerjaan', en: 'Work summary', ja: '担当内容' }) }}</span>
                  <ol class="gallery__detail-list">
                    <li v-for="point in t(activeProject.desc)" :key="point" class="gallery__detail-point">
                      {{ point }}
                    </li>
                  </ol>
                  </template>

                  <template v-if="detailTab === 'stack' && activeProject.stack">
                    <div class="stack">
                      <div v-for="group in activeProject.stack" :key="t(group.group)" class="stack__group">
                        <span class="stack__label">{{ t(group.group) }}</span>
                        <ul class="stack__items">
                          <li v-for="item in group.items" :key="item.name" class="stack__item">
                            <img :src="item.icon" :alt="''" width="22" height="22" class="stack__icon" draggable="false" />
                            <span>{{ item.name }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>

                  <template v-if="detailTab === 'flow' && activeProject.flow">
                    <ol class="flow">
                      <li v-for="(step, index) in activeProject.flow" :key="index" class="flow__step">
                        <span class="flow__num">{{ String(index + 1).padStart(2, '0') }}</span>
                        <div>
                          <strong class="flow__title">{{ t(step.title) }}</strong>
                          <p class="flow__text">{{ t(step.text) }}</p>
                        </div>
                      </li>
                    </ol>
                  </template>

                  <template v-if="detailTab === 'api' && activeProject.api">
                    <div class="api">
                      <div v-for="group in activeProject.api" :key="t(group.group)" class="api__group">
                        <span class="api__label">{{ t(group.group) }}</span>
                        <ul class="api__list">
                          <li v-for="[method, path] in group.routes" :key="method + path" class="api__row">
                            <span class="api__methods">
                              <span
                                v-for="m in method.split(' · ')"
                                :key="m"
                                class="api__method"
                                :class="`api__method--${m.toLowerCase()}`"
                              >{{ m }}</span>
                            </span>
                            <code class="api__path">{{ path }}</code>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <GithubContributions />
    </div>

    <Transition name="lightbox">
      <div
        v-if="lightboxProject"
        class="project-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="lightboxProject.title"
        @click.self="closeLightbox"
        @contextmenu.prevent="preventImageAction"
      >
        <button
          type="button"
          class="btn-close btn-close--dark project-lightbox__close"
          :aria-label="t({ id: 'Tutup gambar', en: 'Close image', ja: '画像を閉じる' })"
          @click="closeLightbox"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div class="project-lightbox__stage">
          <button
            v-if="lightboxShots.length > 1"
            type="button"
            class="btn-close btn-close--dark project-lightbox__nav project-lightbox__nav--prev"
            :aria-label="t({ id: 'Foto sebelumnya', en: 'Previous photo', ja: '前の写真' })"
            @click.stop="stepLightbox(-1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </button>

          <img
            :key="lightboxShot.src"
            :src="lightboxShot.src"
            :alt="t(lightboxShot.caption) || lightboxProject.title"
            class="project-lightbox__img"
            draggable="false"
            @contextmenu.prevent="preventImageAction"
            @dragstart.prevent="preventImageAction"
            @click.stop
          />

          <button
            v-if="lightboxShots.length > 1"
            type="button"
            class="btn-close btn-close--dark project-lightbox__nav project-lightbox__nav--next"
            :aria-label="t({ id: 'Foto berikutnya', en: 'Next photo', ja: '次の写真' })"
            @click.stop="stepLightbox(1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>

        <p class="project-lightbox__caption">
          <span>
            {{ t(lightboxProject.category) }}
            <template v-if="lightboxShots.length > 1">
              · {{ lightboxIndex + 1 }} / {{ lightboxShots.length }}
            </template>
          </span>
          {{ lightboxProject.title }}
          <small v-if="lightboxShot.caption">{{ t(lightboxShot.caption) }}</small>
        </p>

        <div v-if="lightboxShots.length > 1" class="project-lightbox__thumbs">
          <button
            v-for="(shot, i) in lightboxShots"
            :key="shot.src"
            type="button"
            class="project-lightbox__thumb"
            :class="{ 'project-lightbox__thumb--active': i === lightboxIndex }"
            :aria-label="t({
              id: `Foto ${i + 1}: ${t(shot.caption)}`,
              en: `Photo ${i + 1}: ${t(shot.caption)}`,
              ja: `写真${i + 1}：${t(shot.caption)}`,
            })"
            :aria-current="i === lightboxIndex ? 'true' : undefined"
            @click.stop="lightboxIndex = i"
          >
            <img :src="shot.src" alt="" draggable="false" />
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.projects {
  padding: var(--section-y) 0;
  background: var(--color-surface);
  overflow: hidden;
}

.projects__head-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 3rem;
}

.projects__lead {
  margin: 1rem 0 0;
  max-width: 34rem;
}

.projects__more {
  flex-shrink: 0;
}

.gallery {
  --slide-w: min(460px, 46%);
  --slide-gap: 66%;
  position: relative;
}

.gallery__stage {
  position: relative;
  height: clamp(230px, 27vw, 330px);
  perspective: 1400px;
  touch-action: pan-y;
  user-select: none;
}

.gallery__slide {
  --scale: calc(1 - var(--abs) * 0.16);
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--slide-w);
  padding: 0;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: var(--color-bg);
  overflow: hidden;
  cursor: pointer;
  z-index: calc(10 - var(--abs));
  transform:
    translate(-50%, -50%)
    translateX(calc(var(--d) * var(--slide-gap)))
    scale(var(--scale));
  transition: transform 0.6s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.5s ease,
    border-color 0.3s ease;
}

.gallery--folded .gallery__slide {
  transform: translate(-50%, -50%) scale(calc(var(--scale) * 0.92));
}

.gallery--folded .gallery__slide:not(.gallery__slide--active) {
  opacity: 0;
}

.gallery--opening .gallery__slide {
  transition-duration: 0.95s, 0.7s, 0.3s;
  transition-delay: calc(var(--abs) * 90ms + 150ms);
}

.gallery__slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-surface);
  opacity: calc(var(--abs) * 0.35);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.gallery__slide--active {
  cursor: zoom-in;
  border-color: transparent;
  box-shadow: 0 0 34px -6px color-mix(in srgb, var(--rgb-1) var(--rgb-glow), transparent);
}

.gallery {
  --rgb-1: var(--color-primary);
  --rgb-2: var(--color-accent);
  --rgb-3: color-mix(in srgb, var(--color-primary) 45%, #fff);
  --rgb-glow: 55%;
}

:global(:root[data-theme='light']) .gallery {
  --rgb-glow: 32%;
}

@property --gallery-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.gallery__slide--active::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--gallery-angle),
    var(--rgb-1),
    var(--rgb-3),
    var(--rgb-2),
    var(--rgb-1)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
  animation: gallery-rgb 6s linear infinite;
  pointer-events: none;
}

@keyframes gallery-rgb {
  to {
    --gallery-angle: 360deg;
  }
}

.gallery__slide:not(.gallery__slide--active):hover {
  border-color: var(--color-text-soft);
}

.gallery__slide:not(.gallery__slide--active):hover::after {
  opacity: calc(var(--abs) * 0.2);
}

.gallery__slide--far {
  opacity: 0.7;
}

.gallery__slide--hidden {
  opacity: 0;
  pointer-events: none;
}

.gallery__slide:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.gallery__chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.gallery__no {
  flex-shrink: 0;
  padding-right: 0.75rem;
  border-right: 1px solid var(--color-rule);
  color: var(--color-text);
}

.gallery__url {
  flex: 1;
  min-width: 0;
  text-align: left;
  text-transform: none;
  letter-spacing: 0.02em;
  color: var(--color-text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery__shots {
  flex-shrink: 0;
  padding-left: 0.75rem;
  border-left: 1px solid var(--color-rule);
  color: var(--color-text);
}

.gallery__shot {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  transition: transform 0.7s var(--ease-out);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.gallery__slide--active:hover .gallery__img {
  transform: scale(1.03);
}

.gallery__zoom {
  position: absolute;
  right: 0.7rem;
  bottom: 0.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background: rgba(18, 17, 15, 0.78);
  color: #fff;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s var(--ease-out);
}

.gallery__slide--active:hover .gallery__zoom,
.gallery__slide--active:focus-visible .gallery__zoom {
  opacity: 1;
  transform: none;
}

.gallery__controls {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  align-items: center;
  gap: 1rem clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2rem, 4vw, 2.75rem);
  padding: 0.9rem 0;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.gallery__counter strong {
  font-weight: 500;
  color: var(--color-text);
}

.gallery__dots-nav {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  gap: 0.35rem;
  margin-right: 6rem;
}

.gallery__dot {
  position: relative;
  flex: 1 1 0;
  max-width: 64px;
  transition: flex-grow 0.4s var(--ease-out), max-width 0.4s var(--ease-out);
  height: 22px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.gallery__dot::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  border-radius: 2px;
  background: var(--color-rule);
  transition: background 0.25s ease, height 0.25s ease, margin 0.25s ease;
}

.gallery__dot:hover::before {
  background: var(--color-text-soft);
}

.gallery__dot--active {
  flex-grow: 2.4;
  max-width: 128px;
}

.gallery__dot--active::before {
  height: 4px;
  margin-top: -2px;
  background: color-mix(in srgb, var(--color-primary) 35%, var(--color-rule));
}

.gallery__dot--active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 4px;
  margin-top: -2px;
  border-radius: 2px;
  background: var(--color-primary);
  transform: scaleX(var(--fill, 0));
  transform-origin: left center;
  pointer-events: none;
}

.gallery__dots-nav.is-paused .gallery__dot--active::after {
  opacity: 0.7;
}

.gallery__arrows {
  grid-row: 1;
  grid-column: 2;
  justify-self: end;
  display: flex;
  gap: 0.4rem;
}

.gallery__arrow {
  --close-size: 38px;
}

.gallery__info {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
  gap: 1rem clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(1.75rem, 3vw, 2.5rem);
}

.gallery__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gallery__num {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(3rem, 6vw, 4.5rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-transform: none;
  color: var(--color-text);
}

.gallery__category {
  margin-top: 0.6rem;
  color: var(--color-text);
}

.gallery__host {
  max-width: 100%;
  text-transform: none;
  letter-spacing: 0.02em;
  color: var(--color-text-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery__body {
  max-width: 44rem;
}

.gallery__title {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.08;
  color: var(--color-text);
  margin: 0 0 0.85rem;
}

.gallery__summary {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.gallery__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.gallery__chip {
  padding: 0.28rem 0.6rem;
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
  white-space: nowrap;
}

.gallery__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.6rem;
}

.gallery__detail-btn[aria-expanded='true'] {
  border-color: var(--color-text);
}

.gallery__detail-icon {
  transition: transform 0.35s var(--ease-out);
}

.gallery__detail-icon--open {
  transform: rotate(45deg);
}

.gallery__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  color: var(--color-text);
  --depth: var(--btn-depth);
  background: var(--btn-ghost-face);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 var(--depth) 0 var(--btn-ghost-edge),
    0 calc(var(--depth) + 10px) 18px -12px var(--btn-ghost-shadow);
  transition: border-color 0.2s ease, background-color 0.2s ease,
    transform 0.18s var(--ease-out), box-shadow 0.18s var(--ease-out);
}

.gallery__icon-link:hover {
  --depth: calc(var(--btn-depth) + 2px);
  border-color: var(--color-text-soft);
  transform: translateY(-2px);
}

.gallery__icon-link:active {
  --depth: 1px;
  transform: translateY(var(--btn-press));
  transition-duration: 0.06s;
}

.gallery__private {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.gallery__demo svg {
  transition: transform 0.25s var(--ease-out);
}

.gallery__demo:hover svg {
  transform: translate(2px, -2px);
}

.gallery__detail {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

.gallery__detail--open {
  grid-template-rows: 1fr;
}

.gallery__detail-inner {
  min-height: 0;
  overflow: hidden;
}

.gallery__detail-eyebrow {
  display: block;
  margin-top: 1.75rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--color-rule);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.detail-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 1.5rem;
  margin-bottom: 1.4rem;
  padding: 4px;
  border-radius: 12px;
  background: var(--color-surface-soft);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.14);
}

.detail-tabs__tab {
  min-height: 36px;
  padding: 0 0.95rem;
  border: 0;
  border-radius: 9px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.detail-tabs__tab:hover {
  color: var(--color-text);
}

.detail-tabs__tab.is-active {
  background: var(--btn-ghost-face), var(--color-surface);
  color: var(--color-text);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 2px 0 var(--btn-ghost-edge),
    0 6px 12px -8px var(--btn-ghost-shadow);
  transform: translateY(-1px);
}

.detail-tabs__tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.stack {
  display: grid;
  gap: 1rem;
}

.stack__label,
.api__label {
  display: block;
  margin-bottom: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.stack__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.stack__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 38px;
  padding: 0 0.8rem 0 0.6rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--btn-ghost-face), var(--color-surface);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-text);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 2px 0 var(--btn-ghost-edge);
}

.stack__icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  user-select: none;
}

.flow {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.flow__step {
  position: relative;
  display: grid;
  grid-template-columns: 2.4rem minmax(0, 1fr);
  gap: 0.9rem;
  padding: 0 0 1.1rem;
}

.flow__step::before {
  content: '';
  position: absolute;
  top: 2rem;
  bottom: 0;
  left: 1.05rem;
  width: 1px;
  background: var(--color-rule);
}

.flow__step:last-child::before {
  display: none;
}

.flow__num {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: var(--color-surface-soft);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-primary);
  box-shadow: 0 2px 0 var(--btn-ghost-edge);
}

.flow__title {
  display: block;
  padding-top: 0.3rem;
  font-size: 0.95rem;
  color: var(--color-text);
}

.flow__text {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.api {
  display: grid;
  gap: 1.4rem;
}

.api__list {
  display: grid;
  margin: 0;
  padding: 0;
  border: 1px solid var(--color-rule);
  border-radius: 10px;
  list-style: none;
  overflow: hidden;
}

.api__row {
  display: grid;
  grid-template-columns: 12.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.9rem;
  padding: 0.5rem 0.8rem;
}

.api__row + .api__row {
  border-top: 1px solid var(--color-rule);
}

.api__methods {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.api__method {
  min-width: 2.9rem;
  padding: 0.2rem 0.35rem;
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
  color: #fff;
}

.api__method--get {
  background: #1f7fe0;
}

.api__method--post {
  background: #1a9a5c;
}

.api__method--patch {
  background: #c9861a;
}

.api__method--put {
  background: #0f8a86;
}

.api__method--delete {
  background: #c8202f;
}

.api__path {
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .api__row {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
  }
}

.gallery__detail-list {
  list-style: none;
  counter-reset: detail-point;
  margin: 0.4rem 0 0.25rem;
  padding: 0;
}

.gallery__detail-point {
  position: relative;
  padding: 0.85rem 0 0.85rem 2.6rem;
  border-bottom: 1px solid var(--color-border);
  counter-increment: detail-point;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.gallery__detail-point:last-child {
  border-bottom: 0;
}

.gallery__detail-point::before {
  content: counter(detail-point, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0.95rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.gallery__detail--open .gallery__detail-point {
  animation: detail-point-in 0.45s var(--ease-out) backwards;
}

.gallery__detail-point:nth-child(1) { animation-delay: 0.08s; }
.gallery__detail-point:nth-child(2) { animation-delay: 0.13s; }
.gallery__detail-point:nth-child(3) { animation-delay: 0.18s; }
.gallery__detail-point:nth-child(4) { animation-delay: 0.23s; }
.gallery__detail-point:nth-child(5) { animation-delay: 0.28s; }
.gallery__detail-point:nth-child(n + 6) { animation-delay: 0.33s; }

@keyframes detail-point-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.info-enter-active,
.info-leave-active {
  transition: opacity 0.25s ease, transform 0.3s var(--ease-out);
}

.info-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.info-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.project-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  padding: 4.5rem 1.25rem 2rem;
  background: rgba(14, 12, 10, 0.92);
}

.project-lightbox__img {
  max-width: min(92vw, 1150px);
  max-height: 66vh;
  object-fit: contain;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.12);
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.project-lightbox__caption {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
}

.project-lightbox__caption small {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.project-lightbox__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.project-lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 1;
  margin-top: -22px;
}

.project-lightbox__nav--prev {
  left: -58px;
}

.project-lightbox__nav--next {
  right: -58px;
}

.project-lightbox__thumbs {
  display: flex;
  gap: 0.5rem;
  max-width: 100%;
  overflow-x: auto;
}

.project-lightbox__thumb {
  flex-shrink: 0;
  width: 84px;
  height: 52px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  background: none;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.project-lightbox__thumb:hover,
.project-lightbox__thumb--active {
  opacity: 1;
  border-color: #fff;
}

.project-lightbox__thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
  pointer-events: none;
}

@media (max-width: 1320px) {
  .project-lightbox__nav--prev {
    left: 8px;
  }

  .project-lightbox__nav--next {
    right: 8px;
  }
}

.project-lightbox__caption span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.project-lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-active .project-lightbox__img {
  transition: transform 0.4s var(--ease-out);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .project-lightbox__img {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .gallery__slide,
  .gallery__slide::after,
  .gallery__detail {
    transition: none;
  }

  .gallery__detail-point {
    animation: none !important;
  }

  .gallery__slide--active,
  .gallery__slide--active::before {
    animation-duration: 6s !important;
    animation-iteration-count: infinite !important;
  }
}

@media (max-width: 860px) {
  .projects__head-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .gallery {
    --slide-w: min(420px, 60%);
    --slide-gap: 62%;
  }
}

@media (max-width: 760px) {
  .gallery__controls {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .gallery__dots-nav {
    grid-column: 2;
    margin-right: 0;
  }

  .gallery__arrows {
    grid-column: 3;
  }

  .gallery__info {
    grid-template-columns: 1fr;
  }

  .gallery__meta {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem 0.9rem;
  }

  .gallery__num {
    font-size: 2.6rem;
  }

  .gallery__category {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .gallery {
    --slide-w: 84%;
    --slide-gap: 92%;
  }

  .gallery__stage {
    height: clamp(220px, 62vw, 300px);
  }

  .gallery__actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 46px;
  }

  .gallery__demo,
  .gallery__private {
    grid-column: 1 / -1;
  }

  .gallery__demo {
    order: -1;
  }

  .gallery__actions:has(.gallery__private) {
    grid-template-columns: minmax(0, 1fr);
  }

  .gallery__private {
    justify-content: center;
    text-align: center;
    line-height: 1.5;
  }

  .gallery__slide--far {
    opacity: 0;
    pointer-events: none;
  }

  .gallery__counter {
    font-size: 0.66rem;
  }

  .gallery__summary {
    font-size: 0.94rem;
  }

  .gallery__detail-point {
    padding-left: 2.1rem;
  }

  .gallery__slide--active .gallery__zoom {
    opacity: 1;
    transform: none;
  }
}
</style>
