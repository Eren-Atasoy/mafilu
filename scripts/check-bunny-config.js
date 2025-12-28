/**
 * Bunny.net Configuration Checker
 * 
 * Bu script, .env.local dosyasında Bunny.net ayarlarının olup olmadığını kontrol eder.
 * 
 * Kullanım: node scripts/check-bunny-config.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Bunny.net Ayarları Kontrol Ediliyor...\n');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local dosyası bulunamadı!');
    console.log('📝 Lütfen .env.local dosyası oluşturun ve şu değişkenleri ekleyin:');
    console.log('   BUNNY_STREAM_API_KEY=your_api_key');
    console.log('   BUNNY_STREAM_LIBRARY_ID=your_library_id');
    console.log('   NEXT_PUBLIC_BUNNY_CDN_URL=your_cdn_url (opsiyonel)\n');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    }
});

const required = [
    'BUNNY_STREAM_API_KEY',
    'BUNNY_STREAM_LIBRARY_ID'
];

const optional = [
    'NEXT_PUBLIC_BUNNY_CDN_URL'
];

let allGood = true;

console.log('📋 Gerekli Ayarlar:');
required.forEach(key => {
    const value = envVars[key];
    if (value && value !== `your_${key.toLowerCase()}` && !value.includes('xxx')) {
        console.log(`   ✅ ${key}: ${value.substring(0, 20)}...`);
    } else {
        console.log(`   ❌ ${key}: Eksik veya placeholder değer`);
        allGood = false;
    }
});

console.log('\n📋 Opsiyonel Ayarlar:');
optional.forEach(key => {
    const value = envVars[key];
    if (value && value !== `your_${key.toLowerCase()}` && !value.includes('xxx')) {
        console.log(`   ✅ ${key}: ${value.substring(0, 30)}...`);
    } else {
        console.log(`   ⚠️  ${key}: Ayarlanmamış (opsiyonel)`);
    }
});

console.log('\n' + '='.repeat(50));

if (allGood) {
    console.log('✅ Tüm gerekli ayarlar mevcut!');
    console.log('🎬 Artık gerçek video yükleyebilirsiniz.\n');
    console.log('📝 Sonraki Adımlar:');
    console.log('   1. Producer hesabıyla giriş yapın');
    console.log('   2. /dashboard/movies/upload sayfasına gidin');
    console.log('   3. Film bilgilerini doldurun');
    console.log('   4. Video dosyasını yükleyin');
    console.log('   5. Admin panelinden filmi onaylayın\n');
} else {
    console.log('❌ Bazı ayarlar eksik!');
    console.log('\n📚 Bunny.net Ayarları Nasıl Alınır:');
    console.log('   1. https://bunny.net adresine gidin');
    console.log('   2. Stream Library oluşturun');
    console.log('   3. API Key\'i kopyalayın');
    console.log('   4. Library ID\'yi kopyalayın');
    console.log('   5. .env.local dosyasına ekleyin\n');
    process.exit(1);
}

