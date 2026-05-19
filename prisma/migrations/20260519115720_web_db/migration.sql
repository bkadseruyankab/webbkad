-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "module" TEXT NOT NULL DEFAULT 'general',
    "color" TEXT NOT NULL DEFAULT '#0D6B3F',
    "images" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlobFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "compressedSize" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT NOT NULL,
    "thumbnailPath" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'general',
    "altText" TEXT NOT NULL DEFAULT '',
    "synced" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryId" TEXT,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "readTime" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "images" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "caption" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gallery_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '',
    "suffix" TEXT NOT NULL DEFAULT '',
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FinancialData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" TEXT NOT NULL,
    "pendapatan" INTEGER NOT NULL,
    "belanja" INTEGER NOT NULL,
    "realisasi" REAL NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL DEFAULT '',
    "image" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '[]',
    "downloadableFiles" TEXT NOT NULL DEFAULT '[]',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NavbarMenu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'FileText',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDynamic" BOOLEAN NOT NULL DEFAULT true,
    "externalUrl" TEXT NOT NULL DEFAULT '',
    "openInNewTab" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavbarMenu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavbarMenu" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Official" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "nip" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryId" TEXT,
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '[]',
    "downloadableFiles" TEXT NOT NULL DEFAULT '[]',
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Publication_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT '',
    "images" TEXT NOT NULL DEFAULT '[]',
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Infographic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'umum',
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'baru',
    "images" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Laporan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "avatar" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SetupState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "adminName" TEXT NOT NULL DEFAULT '',
    "adminEmail" TEXT NOT NULL DEFAULT '',
    "adminPassword" TEXT NOT NULL DEFAULT '',
    "appName" TEXT NOT NULL DEFAULT 'Badan Keuangan dan Aset Daerah',
    "appShortName" TEXT NOT NULL DEFAULT 'BKAD',
    "appSubtitle" TEXT NOT NULL DEFAULT 'Kabupaten Seruyan',
    "primaryColor" TEXT NOT NULL DEFAULT '#0D6B3F',
    "secondaryColor" TEXT NOT NULL DEFAULT '#C5960C',
    "darkColor" TEXT NOT NULL DEFAULT '#064E2B',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "selectedMenus" TEXT NOT NULL DEFAULT '[]',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "workHours" TEXT NOT NULL DEFAULT 'Senin - Jumat, 08:00 - 16:00 WIB',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AppIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appName" TEXT NOT NULL DEFAULT 'Badan Keuangan dan Aset Daerah',
    "appShortName" TEXT NOT NULL DEFAULT 'BKAD',
    "appSubtitle" TEXT NOT NULL DEFAULT 'Kabupaten Seruyan',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "logoText" TEXT NOT NULL DEFAULT 'BK',
    "primaryColor" TEXT NOT NULL DEFAULT '#0D6B3F',
    "secondaryColor" TEXT NOT NULL DEFAULT '#C5960C',
    "darkColor" TEXT NOT NULL DEFAULT '#064E2B',
    "phone" TEXT NOT NULL DEFAULT '(0532) 882123',
    "email" TEXT NOT NULL DEFAULT 'bkad@seruyankab.go.id',
    "workHours" TEXT NOT NULL DEFAULT 'Senin - Jumat, 08:00 - 16:00 WIB',
    "topLinks" TEXT NOT NULL DEFAULT 'PPID|SIPD|Lapor!',
    "address" TEXT NOT NULL DEFAULT 'Jl. Trans Kalimantan, Kuala Pembuang, Kab. Seruyan, Kalimantan Tengah 74211',
    "footerDescription" TEXT NOT NULL DEFAULT 'Badan Keuangan dan Aset Daerah Kabupaten Seruyan, Kalimantan Tengah. Mewujudkan pengelolaan keuangan daerah yang transparan, akuntabel, dan berorientasi pada pelayanan publik.',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "quickLinks" TEXT NOT NULL DEFAULT 'Kementerian Dalam Negeri|https://kemendagri.go.id,Pemerintah Kabupaten Seruyan|#',
    "layananLinks" TEXT NOT NULL DEFAULT 'Pengelolaan APBD|#',
    "copyrightText" TEXT NOT NULL DEFAULT 'Badan Keuangan dan Aset Daerah Kabupaten Seruyan',
    "faviconUrl" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT 'Website resmi Badan Keuangan dan Aset Daerah Kabupaten Seruyan',
    "metaKeywords" TEXT NOT NULL DEFAULT 'BKAD, Seruyan, Keuangan Daerah, Aset Daerah',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IkmUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "headName" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IkmSurveyPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT NOT NULL DEFAULT '',
    "endDate" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IkmResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "surveyPeriodId" TEXT NOT NULL,
    "ind1" INTEGER NOT NULL DEFAULT 0,
    "ind2" INTEGER NOT NULL DEFAULT 0,
    "ind3" INTEGER NOT NULL DEFAULT 0,
    "ind4" INTEGER NOT NULL DEFAULT 0,
    "ind5" INTEGER NOT NULL DEFAULT 0,
    "ind6" INTEGER NOT NULL DEFAULT 0,
    "ind7" INTEGER NOT NULL DEFAULT 0,
    "ind8" INTEGER NOT NULL DEFAULT 0,
    "ind9" INTEGER NOT NULL DEFAULT 0,
    "respondentName" TEXT NOT NULL DEFAULT '',
    "respondentAge" TEXT NOT NULL DEFAULT '',
    "respondentGender" TEXT NOT NULL DEFAULT '',
    "respondentEdu" TEXT NOT NULL DEFAULT '',
    "respondentJob" TEXT NOT NULL DEFAULT '',
    "suggestions" TEXT NOT NULL DEFAULT '',
    "ipAddress" TEXT NOT NULL DEFAULT '',
    "userAgent" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IkmResponse_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "IkmUnit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "IkmResponse_surveyPeriodId_fkey" FOREIGN KEY ("surveyPeriodId") REFERENCES "IkmSurveyPeriod" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdBubble" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "contentType" TEXT NOT NULL DEFAULT 'image',
    "mediaUrl" TEXT NOT NULL DEFAULT '',
    "textContent" TEXT NOT NULL DEFAULT '',
    "ctaLabel" TEXT NOT NULL DEFAULT '',
    "ctaUrl" TEXT NOT NULL DEFAULT '',
    "ctaTarget" TEXT NOT NULL DEFAULT '_blank',
    "displayType" TEXT NOT NULL DEFAULT 'floating-bubble',
    "displayMode" TEXT NOT NULL DEFAULT 'rounded-bubble',
    "position" TEXT NOT NULL DEFAULT 'bottom-right',
    "customOffsetX" INTEGER NOT NULL DEFAULT 0,
    "customOffsetY" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 300,
    "height" INTEGER NOT NULL DEFAULT 250,
    "mobileWidth" INTEGER NOT NULL DEFAULT 200,
    "mobileHeight" INTEGER NOT NULL DEFAULT 180,
    "bgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "bgOpacity" REAL NOT NULL DEFAULT 1.0,
    "borderRadius" INTEGER NOT NULL DEFAULT 16,
    "shadowSize" TEXT NOT NULL DEFAULT 'md',
    "borderColor" TEXT NOT NULL DEFAULT '#e5e7eb',
    "borderWidth" INTEGER NOT NULL DEFAULT 0,
    "animIn" TEXT NOT NULL DEFAULT 'fade',
    "animOut" TEXT NOT NULL DEFAULT 'fade',
    "animDuration" INTEGER NOT NULL DEFAULT 500,
    "showDelay" INTEGER NOT NULL DEFAULT 0,
    "autoHide" INTEGER NOT NULL DEFAULT 0,
    "showOnScroll" INTEGER NOT NULL DEFAULT 0,
    "exitIntent" BOOLEAN NOT NULL DEFAULT false,
    "closeable" BOOLEAN NOT NULL DEFAULT true,
    "minimizable" BOOLEAN NOT NULL DEFAULT false,
    "draggable" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TEXT NOT NULL DEFAULT '',
    "endDate" TEXT NOT NULL DEFAULT '',
    "showHours" TEXT NOT NULL DEFAULT '',
    "targetDevice" TEXT NOT NULL DEFAULT 'all',
    "targetPages" TEXT NOT NULL DEFAULT '[]',
    "targetExclude" TEXT NOT NULL DEFAULT '[]',
    "zIndex" INTEGER NOT NULL DEFAULT 9999,
    "order" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_slug_key" ON "PageContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NavbarMenu_slug_key" ON "NavbarMenu"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IkmUnit_code_key" ON "IkmUnit"("code");
